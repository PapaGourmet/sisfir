import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import { useCallback } from "react"
import { createOption } from "../util"
import { InsertItemOpcoes } from "../../../../services/servicesApi"


interface AcaoProps {
    optAcao: any,
    optIntegracao: any,
    optRecursos: any,
    setAcao: (value: React.SetStateAction<string[]>) => void,
    setIntegracao: (value: React.SetStateAction<string[]>) => void,
    setRecursos: (value: React.SetStateAction<string[]>) => void,
    setOptAcao: React.Dispatch<any>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOptIntegracao: React.Dispatch<any>,
    setOptRecursos: React.Dispatch<any>
}

const AcaoIntegracaoRecursos: React.FC<AcaoProps> = ({ setOptRecursos, setOptIntegracao, optAcao, optIntegracao, optRecursos, setOptAcao, setAcao, setIntegracao, setRecursos, setIsLoading
}) => {
    const animatedComponents = makeAnimated()



    const handleCreateIntegracao = useCallback((inputValue: string) => {
        const newOption = createOption(inputValue)
        setOptIntegracao((prev: any) => [...prev, newOption])
        InsertItemOpcoes('integracao', inputValue)
            .then(() => {
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])


    const handleCreateAcao = useCallback((inputValue: string) => {
        const newOption = createOption(inputValue)
        setOptAcao((prev: any) => [...prev, newOption])
        InsertItemOpcoes('acao', inputValue)
            .then(() => {
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])


    const handleCreateRecursos = useCallback((inputValue: string) => {
        const newOption = createOption(inputValue)
        setOptRecursos((prev: any) => [...prev, newOption])
        InsertItemOpcoes('recursos', inputValue)
            .then(() => {
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])



    return (
        < div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 items-center justify-center mx-8">
            <div className="w-full flex items-center justify-center">
                <div className="w-full mb-3 md:mb-0">
                    <label htmlFor="segmento">Ação</label>
                    <CreatableSelect
                        isMulti
                        options={optAcao}
                        isClearable
                        isSearchable
                        isDisabled={false}
                        isLoading={false}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        placeholder={"selecione ..."}
                        onCreateOption={handleCreateAcao}
                        onChange={(item) => {
                            const response: string[] = []
                            item.forEach((i: any) => {
                                response.push(i.label)
                            })
                            setAcao(response)
                        }}
                    />
                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <div className="w-full mb-3 md:mb-0">
                    <label htmlFor="segmento">Integração</label>
                    <CreatableSelect
                        isMulti
                        options={optIntegracao}
                        isClearable
                        isSearchable
                        isDisabled={false}
                        isLoading={false}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        placeholder={"selecione ..."}
                        onCreateOption={handleCreateIntegracao}
                        onChange={(item) => {
                            const response: string[] = []
                            item.forEach((i: any) => {
                                response.push(i.label)
                            })

                            setIntegracao(response)
                        }}
                    />
                </div>
            </div>
            <div className="w-full flex items-center justify-center">
                <div className="w-full mb-3 md:mb-0">
                    <label htmlFor="recursos">Recursos</label>
                    <CreatableSelect
                        isMulti
                        options={optRecursos}
                        isClearable
                        isSearchable
                        isDisabled={false}
                        isLoading={false}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        placeholder={"selecione ..."}
                        onCreateOption={handleCreateRecursos}
                        onChange={(item) => {
                            const response: string[] = []
                            item.forEach((i: any) => {
                                response.push(i.label)
                            })
                            setRecursos(response)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AcaoIntegracaoRecursos