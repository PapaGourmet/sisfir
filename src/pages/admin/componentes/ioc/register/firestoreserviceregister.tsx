import { Auth, UserCredential } from "firebase/auth"
import { IServiceRegister } from "./iserviceregister"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { initializeApp } from "firebase/app"
import firebaseConfig from "../../../../../util/firebase-config"
import User from "../../../../../interfaces/users"
import objectId from "../../../../../interfaces/objectId"
import axios, { AxiosPromise, AxiosRequestConfig } from "axios"
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export class FirestoreServiceRegister implements IServiceRegister {

    async register_email(email: string, pass: string): Promise<UserCredential> {
        const app = initializeApp(firebaseConfig)
        const auth = getAuth()
        const _usercredential = await createUserWithEmailAndPassword(auth, email, pass)
        await sendEmailVerification(_usercredential.user)

        return _usercredential
    }

    async register_access(user: User, credential: UserCredential): Promise<AxiosPromise<any>> {
        const usuario: objectId = {}
        const { email, matricula, rules, nome } = user
        usuario[user.id || ""] = { email, matricula, rules, uid: credential.user.uid, nome }

        const config: AxiosRequestConfig = {
            method: 'patch',
            url: `https://fcz-cacambas-default-rtdb.firebaseio.com/users.json`,
            data: usuario
        }

        return axios(config)
    }
}