import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import dbDatabaseFirestoreNao from "../../util/firestoreconfig";
import { ICacambaProps, IApplyCacambaService, IDumpster } from "./icacambasservice";
import { getLocalTimeInSaoPauloMilliseconds } from "../../../../maps/utils/utils";

export class ServiceFirestoreCacambas implements IApplyCacambaService {

    private db = dbDatabaseFirestoreNao

    async addCacamba(cacamba: ICacambaProps): Promise<void> {

        try {
            const refCacamba = collection(this.db, "cacambas-cacambas")
            const docRef = doc(refCacamba, cacamba.id)
            await setDoc(docRef, cacamba)
        } catch (err) {

            throw new Error('Problemas ao atualizar salvar caçamba')
        }
    }

    async removeCacamba(id: string): Promise<void> {

        try {
            const refCacamba = collection(this.db, "cacambas-cacambas")
            const docRef = doc(refCacamba, id)
            await updateDoc(docRef, {
                status: false,
                termino: getLocalTimeInSaoPauloMilliseconds()
            });
        } catch (err) {
            throw new Error('Problemas ao atualizar o status pelo id')
        }

    }

    async getCacamba(id: string): Promise<ICacambaProps> {

        try {
            const refCliente = collection(this.db, "cacambas-cacambas")
            const cacsQuery = query(refCliente, where('id', '==', id))
            const querySnapshot = await getDocs(cacsQuery)

            let resultados: any = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                resultados = data
            })

            return resultados

        } catch (err) {

            throw new Error('Problemas ao deletar pelo id')
        }
    }

    async getAllCacamba(): Promise<ICacambaProps[]> {

        try {
            const minhaColecao = collection(this.db, "cacambas-cacambas")
            const querySnapshot = await getDocs(minhaColecao)
            const response = querySnapshot.docs.map((doc) => doc.data())
            const documentos: ICacambaProps[] = []
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

    async addDumpster(dumpster: IDumpster): Promise<void> {

        try {
            const refDumpster = collection(this.db, "cacambas-dumpster")
            const docRef = doc(refDumpster, dumpster.id)
            await setDoc(docRef, dumpster)
        } catch (err) {

            throw new Error('Problemas ao salvar o dumpster')
        }
    }

    async removeDumpster(id: string, status: boolean): Promise<void> {

        try {
            const refDumpster = collection(this.db, "cacambas-dumpster")
            const docRef = doc(refDumpster, id)
            await updateDoc(docRef, {
                status
            });
        } catch (err) {
            throw new Error('Problemas ao atualizar o status pelo id')
        }

    }

    async getDumpster(id: string): Promise<IDumpster> {

        try {
            const refDumpster = collection(this.db, "cacambas-dumpster")
            const dumpsterQuery = query(refDumpster, where('id', '==', id))
            const querySnapshot = await getDocs(dumpsterQuery)

            let resultados: any = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                resultados = data
            })

            return resultados

        } catch (err) {

            throw new Error('Problemas ao pegar dumpster pelo id')
        }
    }

    async getDumpsterByRegister(register: string, uid: string): Promise<IDumpster> {
        try {
            const refDumpster = collection(this.db, "cacambas-dumpster")
            const dumpsterQuery = query(
                refDumpster,
                where('numeroSerie', '==', register),
                where('uid', '==', uid))
            const querySnapshot = await getDocs(dumpsterQuery)

            let resultados: any = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                resultados = data
            })

            return resultados

        } catch (err) {

            throw new Error('Problemas ao pegar dumpster pelo numero de série')
        }
    }

    async updateCacamba(id: string, numero: string, termino: number, status: boolean, data?: number) {

        try {
            const refDumpster = collection(this.db, "cacambas-cacambas")
            const docRef = doc(refDumpster, id)

            const envio: { numero: string, termino: number, status: boolean, data?: number } = {
                numero,
                termino,
                status
            }

            if (data) {
                envio.data = data
            }

            await updateDoc(docRef, envio);
        } catch (err) {
            throw new Error('Problemas ao atualizar o status pelo id e número')
        }

    }

}

