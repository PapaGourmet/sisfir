import React, { useContext, useRef, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import IEmployee from "../../../interfaces/iemployee"
import moment from "moment"
import ListNAO from "../../../util/naolists"
import { useDatabaseSnapshot } from "@react-query-firebase/database"
import { ref } from "firebase/database"
import { getDatabase } from 'firebase/database'
import { initializeApp } from "firebase/app"
import firebaseConfig from "../../../util/firebase-config"
import Loading from "../../../bundles/loading/loading"
import { GetRelatores } from "../../../services/servicesApi"
import { relatoresGroup } from "../../ordem/create/util"
import { notify } from "./util"
const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)

/**
 * Lista com os valores de bases possíveis para as operações de fiscalização
 */
const list = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']

type Relator = {
    grupo: string
    valor: number
    total?: number
}


const sort = (a: IEmployee, b: IEmployee) => {
    if (a.name > b.name) {
        return 1
    }

    if (a.name < b.name) {
        return -1
    }

    return 0
}

/**
 * Adiciona o campo "total" em um objeto da lista relatoresGroup com base no grupo especificado.
 * @param {string} grupo O nome do grupo ao qual o objeto pertence.
 * @param {any} total O valor a ser adicionado como campo "total" no objeto.
 */
function adicionarTotal(relGroup: any, grupo: any, total: any) {
    // Encontra o índice do objeto na lista que tem o grupo especificado.
    const index = relGroup.findIndex((objeto: any) => objeto.grupo === grupo)

    // Se o objeto não for encontrado, exibe um erro e interrompe a função.
    if (index === -1) {
        console.error(`Não foi encontrado um objeto com o grupo "${grupo}" na lista.`)
        return
    }

    // Cria um novo objeto com os mesmos campos do objeto original e com o campo "total" adicionado.
    const objeto = relGroup[index]
    const novoObjeto = { ...objeto, total }

    // Atualiza a lista com o novo objeto.
    relGroup[index] = novoObjeto
    return relGroup
}

/**
    * Retorna o objeto da lista relatoresGroup com o menor valor de "total".
    * Em caso de mais de um objeto com o mesmo valor de "total", retorna o objeto com o menor valor de "total"
    * e, em seguida, o objeto com o menor valor de "valor".
    * @param {Array} relatoresGroup A lista de objetos a ser pesquisada.
    * @returns {Object} O objeto da lista com o menor valor de "total".
    */
function obterMenorTotal(relatoresGroup: any[]): Relator {
    // Inicializa as variáveis "menorTotal" e "menorObjeto" com o primeiro objeto da lista.
    let menorTotal = relatoresGroup[0].total
    let menorObjeto = relatoresGroup[0]

    // Percorre a lista a partir do segundo objeto.
    for (let i = 1; i < relatoresGroup.length; i++) {
        const objeto = relatoresGroup[i]

        // Se o valor de "total" do objeto atual for menor que o valor de "total" do menor objeto encontrado até agora,
        // o menor objeto é atualizado com o objeto atual.
        if (objeto?.total < menorTotal) {
            menorTotal = objeto.total
            menorObjeto = objeto
        }
        // Se o valor de "total" do objeto atual for igual ao valor de "total" do menor objeto encontrado até agora,
        // compara os valores de "valor" dos dois objetos e atualiza o menor objeto com o objeto atual, se necessário.
        else if (objeto.total === menorTotal && objeto.valor < menorObjeto.valor) {
            menorObjeto = objeto
        }
    }

    // Retorna o menor objeto encontrado.
    return menorObjeto
}

/**
 * Remove de "relatoresGroup" os objetos que não possuem nenhum dos valores da lista em "grupo".
 * @param {Array} valores A lista de valores a serem mantidos.
 * @param {Array} relatoresGroup A lista de objetos a ser filtrada.
 * @returns {Array} A lista de objetos filtrada.
 */
function removerSemGrupo(valores: string[] | undefined, relatoresGroup: Relator[]): Relator[] {
    // Filtra os objetos que possuem o valor de "grupo" na lista "valores".
    const filtrado = relatoresGroup.filter((objeto) => valores!.includes(objeto.grupo))

    return filtrado
}


export const DataComponent: React.FC = () => {
    const { setOrdem, ordem, setEquipes, setDataOS, dataOS } = useContext(sisfirContext)
    const dbRef = ref(database, "employees")
    const employees = useDatabaseSnapshot(["employees"], dbRef)
    const unitRef = useRef<any[]>([])
    const reference = useRef<any[]>([])
    const dataRef = useRef<HTMLInputElement>(null)

    if (employees.isLoading) {
        return <div className='flex items-center justify-center'>
            <Loading />
        </div>
    }

    const snapshot = employees.data
    unitRef.current = [{ label: "Omega", value: "Omega" }]
    reference.current = []

    snapshot!.forEach((childSnapshot) => {
        reference.current.push(
            { ...childSnapshot.val(), label: `${childSnapshot.val().name} (${childSnapshot.val().role}) (${childSnapshot.val().unit}) (${childSnapshot.val().type})`, value: childSnapshot.val().name }
        )

        if (unitRef.current.findIndex(x => x.label === childSnapshot.val().unit) === -1) {


            if (list.indexOf(childSnapshot.val().unit) !== -1) {
                unitRef.current.push({ label: childSnapshot.val().unit, value: childSnapshot.val().unit })
            }

        }
    })


    const handleChange = (item: any) => {
        const { value } = item.target

        if (!ordem.segmento || !ordem.unit || ordem.segmento.length === 0 || ordem.unit.length === 0) {
            notify('Preencha segmento e unidades para prosseguir')
            dataRef.current!.value = ''
            setDataOS(null)
            return
        }

        setEquipes([])
        setDataOS(value)

        const date = moment(item && item.target.value)
        const index = date.day()
        const day = ListNAO.days[index]


        let filter: IEmployee[] = reference.current.filter(
            x => x[day]
        )

        filter = filter.sort(sort)

        let auxUnidade: IEmployee[] = []
        let auxSegmento: IEmployee[] = []


        ordem.segmento.forEach(u => {
            const fil = filter.filter(x => x.type === u)
            fil.forEach(y => {
                auxSegmento.push(y)
            })
        })


        ordem.unit.sort((a: string, b: string) => -1 * a.localeCompare(b)).forEach(u => {
            let fil

            if (u === "Omega") {
                fil = reference.current.filter(x => list.indexOf(x.unit) === -1).sort((a: IEmployee, b: IEmployee) => a.name.localeCompare(b.name))
                fil.forEach(z => {
                    auxUnidade.push(z)
                })
            } else {
                fil = auxSegmento.filter(x => x.unit === u)
                fil.forEach(y => {
                    auxUnidade.unshift(y)
                })
            }

        })

        setEquipes(auxUnidade)


        /**
         * Daqui para frente eu constru o fluxo para pegar o mais folgado na escala de
         * cofeção de relatórios:
         * Obs: os valores de contagem dos grupos só poderão ser incrementados ao slavar a OS
         * 1) Pegar os dados de confeção de relatórios na coleção relatorios (fcz-nao)
         * 2) pegar dos dados de grupo e valor apenas das unidades selecionadas em Unidade
         * 3) adicionar o valor da coleção relatórios por grupo às unidades selecionadas
         * 4) obter aquela que possui o menor total e ou menor total e menor valor
         */


        GetRelatores()
            .then((data: any) => {

                const response = removerSemGrupo(ordem!.unit, relatoresGroup)
                let _adicionarTotal: any[] = []
                if (ordem.unit) {
                    ordem.unit.forEach(d => {
                        const total = data[0][d.toLowerCase()]
                        _adicionarTotal = adicionarTotal(response, d, total)
                    })
                    const relator = obterMenorTotal(_adicionarTotal).grupo
                    setOrdem({ ...ordem, responsavel: relator })
                }

            })

            .catch(err => {
                console.log(err)
            })

    }


    return (
        <div className="flex flex-col w-full">
            <label>Data</label>
            <input
                value={dataOS ? dataOS : ''}
                ref={dataRef}
                type="date"
                className="border rounded-lg p-2 outline-none"
                onChange={(item: any) => {
                    handleChange(item)
                }}
            >
            </input>
        </div>
    )
}