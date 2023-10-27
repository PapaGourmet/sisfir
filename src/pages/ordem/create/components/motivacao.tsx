import React, { useCallback } from "react"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import IEmployee from "../../../../interfaces/iemployee"
import { createOption } from "../util"
import { InsertItemOpcoes } from "../../../../services/servicesApi"

interface MotivacaoProps {
    optMotivacao: any
    setOptMotivacao: (value: any) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    setShowMotivacao: (value: React.SetStateAction<boolean>) => void,
    setMotivacao: (value: React.SetStateAction<string | undefined>) => void
}

const Motivacao: React.FC<MotivacaoProps> = ({
    optMotivacao,
    setOptMotivacao,
    setIsLoading,
    setShowMotivacao,
    setMotivacao

}) => {

    const animatedComponents = makeAnimated()


    const handleCreateMotivacao = useCallback((inputValue: string) => {
        const newOption = createOption(inputValue)
        setOptMotivacao((prev: any) => [...prev, newOption])
        InsertItemOpcoes('motivacao', inputValue)
            .then(() => {
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="motivacao">Motivação</label>
                <CreatableSelect
                    options={[...optMotivacao, { label: 'Outras', value: 'Outras' }]}
                    isClearable
                    isSearchable
                    isDisabled={false}
                    isLoading={false}
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    onCreateOption={handleCreateMotivacao}
                    placeholder={"selecione ..."}
                    onChange={(item: any) => {
                        setShowMotivacao(false)
                        if (item) {
                            if (item.value === 'Outras') {
                                setShowMotivacao(true)
                                setMotivacao(undefined)
                            } else {
                                setShowMotivacao(false)
                                setMotivacao(item.label)
                            }
                        }
                    }}
                />
            </div>
        </div>

    )
}


export default Motivacao