import IOrdem from "../interfaces/iordem"
import IOs from "../interfaces/OS"
import { IServiceOrder } from "../ioc/iorderservice"
import { arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import firebaseNAOConfig from "../util/firebase-nao-config"
import { initializeApp } from "firebase/app"
import objectId from "../interfaces/objectId"
const app = initializeApp(firebaseNAOConfig, "NAO")
const db = getFirestore(app)

export class FirestoreOrderService implements IServiceOrder {


    async getOrdem(data: string): Promise<IOs> {
        try {
            const ordensRef = doc(db, "ordens", data)
            const docSnap = await getDoc(ordensRef)
            const infos: any = docSnap.data()
            return infos
        } catch (e) {
            throw e
        }
    }

    async deleteOrdem(data: any, ordens: IOrdem[], id: any): Promise<void> {
        try {

            const aux: any[] = []

            ordens.forEach((x: IOrdem) => {
                const obj: objectId = {}
                obj[x.key || ""] = x
                aux.push(obj)
            })

            await setDoc(doc(db, "ordens", data), {
                ordens: aux
            }, { merge: true })

        } catch (e) {
            throw e
        }
    }

    async getDayOrdem(data: string): Promise<IOrdem[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const ordensRef = doc(db, "ordens", data)
                const docSnap = await getDoc(ordensRef)
                const infos: any = docSnap.data()

                if (infos!['ordens'].length === 0) {
                    resolve([])
                }

                const ordens = infos!['ordens']
                const dados: IOrdem[] = []
                ordens.forEach((x: any) => {
                    const key = Object.keys(x)[0]
                    const obj = x[key]
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
                        dataEnvio: obj['dataEnvio'] ? obj['dataEnvio'] : null
                    })


                })

                resolve(dados)
            } catch (err) {
                reject(err)
            }
        })
    }

    async insertOrdem(data: string, ordem: IOrdem, id: any): Promise<void> {
        const ord: objectId = {}
        ord[id] = ordem

        try {
            const ordemRef = doc(db, "ordens", data)

            await updateDoc(ordemRef, {
                ordens: arrayUnion(ord)
            })

        } catch (e) {
            throw e
        }
    }
}