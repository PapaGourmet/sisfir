import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import IEmployee from "../../../../../interfaces/iemployee"
import { IServiceEmployee } from "./iserviceemployee"
import dbDatabaseFirestoreNao from "../../../../cacambas/components/util/firestoreconfig"

export class FirestoreServiceEmployees implements IServiceEmployee {
    private db = dbDatabaseFirestoreNao

    async getSegmento(): Promise<string[]> {
        try {
            const minhaColecao = collection(this.db, "dados")
            const querySnapshot = await getDocs(minhaColecao)
            const response = querySnapshot.docs.map((doc) => doc.data())
            const documentos: string[] = []
            response.forEach(doc => {
                const data = doc.data().segmento
                const { ...rest } = data
                documentos.push(rest)
            })

            return documentos

        } catch (err) {
            throw new Error('Problemas ao recuperar os documentos')
        }
    }

    async getEmployees(): Promise<IEmployee[]> {
        try {
            const minhaColecao = collection(this.db, "employees")
            const querySnapshot = await getDocs(minhaColecao)
            const response = querySnapshot.docs.map((doc) => doc.data())
            const documentos: IEmployee[] = []
            response.forEach(doc => {
                const data = doc.data()
                const { ...rest } = data
                documentos.push(rest)
            })

            return documentos

        } catch (err) {
            throw new Error('Problemas ao recuperar os documentos')
        }
    }

    async addEmployee(employee: IEmployee): Promise<void> {
        console.log(employee)
        try {
            const refCacamba = collection(this.db, "employees")
            const docRef = doc(refCacamba, employee.id)
            await setDoc(docRef, employee)
        } catch (err) {
            console.log(err)
            throw new Error('Problemas ao salvar o empregado')
        }
    }

    async updateEmployee(employee: IEmployee): Promise<void> {
        console.log(employee.id)
        try {
            const refDumpster = collection(this.db, "employees")
            const docRef = doc(refDumpster, employee.id)

            const { ...envio } = employee

            await updateDoc(docRef, envio);
        } catch (err) {
            throw new Error('Problemas ao atualizar o empregado')
        }

    }
}