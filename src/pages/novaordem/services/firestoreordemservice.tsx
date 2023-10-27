import { doc, updateDoc, arrayUnion, getFirestore, getDoc } from "firebase/firestore"
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

    async getDayOrdem(data: string): Promise<IOrdem[]> {

        try {
            const ordensRef = doc(db, "ordens", data)
            const docSnap = await getDoc(ordensRef)
            const infos: any = docSnap.data()

            const ordens = infos!['ordens']
            const dados: IOrdem[] = []
            ordens
                .forEach((x: any) => {
                    const key = Object.keys(x)[0]
                    const obj = x[key]
                    const index = dados.findIndex((t: IOrdem) => t.key === key)

                    if (index === -1) {
                        dados.push({
                            key,
                            unit: obj['unit'],
                            recursos: obj['recursos'],
                            inicio: obj['inicio'],
                            fim: obj['fim'],
                            dataOrdem: obj['dataOrdem'],
                            segmento: obj['segmento'],
                            acao: obj['acao'],
                            motivacao: obj['motivacao'],
                            equipe: obj['equipe'],
                            integracao: obj['integracao'],
                            local: obj['local'],
                            status: obj['status'],
                            relatorio: obj['relatorio'] ? obj['relatorio'] : null,
                            relator: obj['relator'] ? obj['relator'] : null,
                            responsavel: obj['responsavel'] ? obj['responsavel'] : null,
                            dataEnvio: obj['dataEnvio'] ? obj['dataEnvio'] : null,
                            tipo: obj['tipo'] ? obj['tipo'] : null,
                            orientacao: obj['orientacao'] ? obj['orientacao'] : null
                        })
                    }

                })

            return dados.filter((x: IOrdem) => x.status)

        } catch (e) {
            throw e
        }


    }

}