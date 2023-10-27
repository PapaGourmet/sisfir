import { Auth, UserCredential } from "firebase/auth"
import { AxiosPromise } from "axios"
import User from "../../../../../interfaces/users"

export interface IServiceRegister {
    register_email(email: string, pass: string): Promise<UserCredential>
    register_access(user: User, credential: UserCredential): Promise<AxiosPromise<any>>
}


export class ServiceRegister {
    constructor(private service: IServiceRegister) { }

    async register_email(email: string, pass: string): Promise<UserCredential> {
        return this.service.register_email(email, pass)
    }

    async register_access(user: User, credential: UserCredential): Promise<AxiosPromise<any>> {
        return this.service.register_access(user, credential)
    }

}


