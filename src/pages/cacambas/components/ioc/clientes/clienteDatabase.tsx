import { getFirestore, collection, addDoc, doc, getDoc, setDoc, query, where, getDocs, updateDoc, deleteDoc, } from "firebase/firestore"
import { IClienteDatabase } from "./iclientesrepository"
import { FormDataEnvio } from "../../../../../types/types"
import dbDatabaseFirestoreNao from "../../util/firestoreconfig"

export class FirebaseClienteDatabase implements IClienteDatabase {
    private db = dbDatabaseFirestoreNao

    async salvarCliente(cliente: FormDataEnvio) {

        try {
            const refCacamba = collection(this.db, "cacambas-clientes")
            const docRef = doc(refCacamba, cliente.id)
            await setDoc(docRef, cliente)
        } catch (err) {
            throw new Error('Erro ao salvar documento')
        }

    }

    async atualizarCliente(cliente: FormDataEnvio) {

        try {

            const refCacamba = collection(this.db, "cacambas-clientes")
            const docRef = doc(refCacamba, cliente.id)

            const docSnapshot = await getDoc(docRef)

            if (docSnapshot.exists()) {
                await updateDoc(docRef, cliente)
            }
        } catch (err) {

            throw new Error('Erro ao atualizar documento')
        }

    }

    async getClienteId(id: string): Promise<FormDataEnvio | null | undefined> {

        try {
            const refCliente = collection(this.db, "cacambas-clientes")
            const cacsQuery = query(refCliente, where('id', '==', id))
            const querySnapshot = await getDocs(cacsQuery)

            let resultados: any = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                resultados = data
            })

            return resultados

        } catch (err) {
            throw new Error("Erro ao recuperar clientes.")
        }

    }

    async inativarClienteById(id: string): Promise<void> {

        try {
            const refCacamba = collection(this.db, "cacambas-clientes")
            const docRef = doc(refCacamba, id)
            const docSnapshot = await getDoc(docRef)

            if (docSnapshot.exists()) {
                await updateDoc(docRef, { status: false })
            }
        } catch (err) {
            throw new Error('problemas ao deletar pelo id')
        }
    }

    async reativarClienteById(id: string): Promise<void> {

        try {
            const refCacamba = collection(this.db, "cacambas-clientes")
            const docRef = doc(refCacamba, id)
            const docSnapshot = await getDoc(docRef)

            if (docSnapshot.exists()) {
                await updateDoc(docRef, { status: true })
            }
        } catch (err) {
            throw new Error('problemas ao deletar pelo id')
        }
    }

    async getClienteDocumento(documento: string, uid: string): Promise<FormDataEnvio | null | undefined> {

        try {
            const refCliente = collection(this.db, "cacambas-clientes")
            const cacsQuery = query(refCliente, where('documento', '==', documento), where('uid', '==', uid))
            const querySnapshot = await getDocs(cacsQuery)

            let resultados: any = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                resultados = data
            })

            return resultados

        } catch (err) {
            throw new Error("Erro ao recuperar clientes.")
        }

    }

}
