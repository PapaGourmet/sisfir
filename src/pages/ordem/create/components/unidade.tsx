import React, { useCallback } from "react"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import IEmployee from "../../../../interfaces/iemployee"
import { DecrementGrupoRelator, IncrementGrupoRelator } from "../../../../services/servicesApi"

interface UnidadeProps {
    setOpcoesSelecionadas: React.Dispatch<React.SetStateAction<never[]>>,
    opcoesSelecionadasAntigas: React.MutableRefObject<never[]>,
    unitRef: React.MutableRefObject<any[]>,
    opcoesSelecionadas: never[],
    setShowMsg: (value: React.SetStateAction<boolean>) => void,
    setEmployees: (value: React.SetStateAction<IEmployee[]>) => void,
    setRelator: (value: any) => void,
    setUnidade: (value: React.SetStateAction<string[]>) => void,
    refEquipe: React.MutableRefObject<undefined>,
    refData: React.MutableRefObject<undefined>
}

const Unidade: React.FC<UnidadeProps> = ({
    setOpcoesSelecionadas,
    setShowMsg,
    setEmployees,
    setRelator,
    opcoesSelecionadasAntigas,
    unitRef,
    opcoesSelecionadas,
    setUnidade,
    refEquipe,
    refData

}) => {

    const animatedComponents = makeAnimated()

    const handleChange = useCallback((opcoes: any, evento: any) => {
        // Atualiza o estado com a lista de opções selecionadas
        setOpcoesSelecionadas(opcoes)

        // Verifica se houve alguma opção retirada da seleção
        const opcaoRetirada: any = opcoesSelecionadasAntigas.current.find(
            (opcao) => !opcoes.includes(opcao)
        )

        if (opcaoRetirada) {
            const { label } = opcaoRetirada
            DecrementGrupoRelator(label.toLowerCase())
                .catch(err => console.log(err))
        } else {
            const len = opcoes.length
            const { label } = opcoes[len - 1]
            IncrementGrupoRelator(label.toLowerCase())
                .catch(err => console.log(err))
        }

        // Atualiza a referência com as opções selecionadas antigas
        opcoesSelecionadasAntigas.current = opcoes
    }, [])

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="segmento">Unidade</label>
                <CreatableSelect
                    isMulti
                    options={unitRef.current.sort((a: any, b: any) => a.label.localeCompare(b.label))}
                    isClearable={false}
                    isSearchable
                    isDisabled={false}
                    isLoading={false}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    placeholder={"selecione ..."}
                    value={opcoesSelecionadas}

                    onChange={(item: any, eventos) => {
                        handleChange(item, eventos)

                        setShowMsg(false)
                        setEmployees([])
                        //@ts-ignore
                        refEquipe!.current.clearValue()
                        //@ts-ignore
                        refData!.current.value = ""

                        setRelator(null)

                        const response: string[] = []
                        item.forEach((i: any) => {
                            response.push(i.label)
                        })

                        setUnidade(response)
                    }}
                />

            </div>
        </div>
    )
}

export default Unidade

