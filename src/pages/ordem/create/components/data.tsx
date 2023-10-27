import React from "react"
import IEmployee from "../../../../interfaces/iemployee"
import moment from "moment"
import ListNAO from "../../../../util/naolists"
import { GetNumeroOrdem, GetOpcoes, GetRelatores, InsertItemOpcoes, InsertOrdem } from "../../../../services/servicesApi"
import { createOption, relatoresGroup } from "../util"

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


interface DataInicioProps {
    refData: React.MutableRefObject<undefined>,
    setShowMsg: (value: React.SetStateAction<boolean>) => void,
    setEmployees: (value: React.SetStateAction<IEmployee[]>) => void,
    refEquipe: React.MutableRefObject<undefined>,
    unidade: string[],
    segmento: string[],
    setMsg: (value: React.SetStateAction<string>) => void,
    reference: React.MutableRefObject<any[]>,
    setDataOrdem: (value: React.SetStateAction<string>) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    setRelator: React.Dispatch<any>,
    setInicio: (value: React.SetStateAction<string>) => void
    setFim: (value: React.SetStateAction<string>) => void
}


const Data: React.FC<DataInicioProps> = ({
    refData,
    setShowMsg,
    setEmployees,
    refEquipe,
    unidade,
    segmento,
    setMsg,
    reference,
    setDataOrdem,
    setIsLoading,
    setRelator,
    setInicio,
    setFim
}) => {


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
    function removerSemGrupo(valores: string[], relatoresGroup: Relator[]): Relator[] {
        // Filtra os objetos que possuem o valor de "grupo" na lista "valores".
        const filtrado = relatoresGroup.filter((objeto) => valores.includes(objeto.grupo))

        return filtrado
    }


    return (<div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 items-center justify-center mx-8">
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="data">Data</label>
                <input
                    //@ts-ignore
                    ref={refData}
                    type="date"
                    className="form-control"
                    id="data"
                    onChange={(item) => {
                        setShowMsg(false)
                        setEmployees([])
                        //@ts-ignore
                        refEquipe!.current.clearValue()
                        const date = moment(item && item.target.value)
                        const index = date.day()
                        const day = ListNAO.days[index]

                        let error = false

                        const veriryArrays = [
                            unidade,
                            segmento
                        ]

                        veriryArrays.forEach(c => {
                            if (c!.length === 0) {

                                setMsg("Preencha todos os campos da OS")
                                setShowMsg(true)
                                error = true
                            }
                        })

                        if (error) {
                            setShowMsg(true)
                            setMsg('Preencha o segmento e a unidade para prosseguir.')
                            //@ts-ignore
                            refData!.current.value = ""
                            return
                        }


                        let filter: IEmployee[] = reference.current.filter(
                            x => x[day]
                        )

                        filter = filter.sort(sort)


                        let auxUnidade: IEmployee[] = []
                        let auxSegmento: IEmployee[] = []



                        segmento.forEach(u => {
                            const fil = filter.filter(x => x.type === u)
                            fil.forEach(y => {
                                auxSegmento.push(y)
                            })
                        })


                        unidade.sort((a: string, b: string) => -1 * a.localeCompare(b)).forEach(u => {
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

                        setEmployees(auxUnidade)
                        item && setDataOrdem(item.target.value)


                        /**
                         * Daqui para frente eu constru o fluxo para pegar o mais folgado na escala de
                         * cofeção de relatórios:
                         * Obs: os valores de contagem dos grupos só poderão ser incrementados ao slavar a OS
                         * 1) Pegar os dados de confeção de relatórios na coleção relatorios (fcz-nao)
                         * 2) pegar dos dados de grupo e valor apenas das unidades selecionadas em Unidade
                         * 3) adicionar o valor da coleção relatórios por grupo às unidades selecionadas
                         * 4) obter aquela que possui o menor total e ou menor total e menor valor
                         */


                        setIsLoading(true)
                        GetRelatores()
                            .then((data: any) => {
                                setIsLoading(false)
                                const response = removerSemGrupo(unidade, relatoresGroup)
                                let _adicionarTotal: any[] = []
                                unidade.forEach(d => {
                                    const total = data[0][d.toLowerCase()]
                                    _adicionarTotal = adicionarTotal(response, d, total)
                                })
                                setRelator(obterMenorTotal(_adicionarTotal).grupo)
                            })

                            .catch(err => {
                                setIsLoading(false)
                                console.log(err)
                            })


                    }}
                ></input>
            </div>
        </div>
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="inicio">Início</label>
                <input
                    type="time"
                    className="form-control"
                    id="inicio"
                    onChange={(item) => {
                        setShowMsg(false)
                        item && setInicio(item.target.value)
                    }}
                ></input>
            </div>
        </div>
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="fim">Fim</label>
                <input
                    type="time"
                    className="form-control"
                    id="fim"
                    onChange={(item) => {
                        setShowMsg(false)
                        item && setFim(item.target.value)
                    }}
                ></input>
            </div>
        </div>
    </div>)
}


export default Data