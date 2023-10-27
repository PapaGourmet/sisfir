import { doc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore"
import IOrdem from "../../../interfaces/iordem"
import IOs from "../../../interfaces/OS"
import { IOrdemService } from "../interfaces/iordemservice"
import { initializeApp } from "firebase/app"
import firebaseNAOConfig from "../../../util/firebase-nao-config"
import objectId from "../../../interfaces/objectId"
const app = initializeApp(firebaseNAOConfig, "NAO")
const db = getFirestore(app)

export class FirestoreOrdemService implements IOrdemService {

    async addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void> {

        const ord: objectId = {}
        ord[numeroOrdem] = ordem

        try {
            const ordemRef = doc(db, "ordens", data)

            await updateDoc(ordemRef, {
                ordens: arrayUnion(ord)
            })

        } catch (e) {
            throw e
        }
    }


    async updateOrdem(data: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


    async getDayOrdem(data: string): Promise<IOs> {
        throw new Error("Method not implemented.");
    }

}