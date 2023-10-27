import React, { useCallback, useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import { createOption } from "./util"
import { InsertItemOpcoes } from "../../../services/servicesApi"

export const MotivacaoComponent: React.FC = () => {
    const { setOrdem, ordem, options } = useContext(sisfirContext)
    const [values, setValues] = useState<{ label: string, value: string } | null>(null)
    const animatedComponents = makeAnimated()

    const handleChange = (value: any) => {

        if (value) {
            setValues(value)

            if (ordem) {
                setOrdem({ ...ordem, motivacao: value.label })
            }
        }

    }

    const handleCreate = useCallback(async (inputValue: string) => {
        const newOption = createOption(inputValue)
        await InsertItemOpcoes('motivacao', inputValue)
    }, [])

    useEffect(() => {
        if (ordem.motivacao) {
            setValues(createOption(ordem.motivacao || ""))
        }
    }, [ordem])

    return (
        <div className="flex flex-col w-full">
            <label>Motivação</label>
            <CreatableSelect
                value={values}
                options={options.motivacao}
                isClearable
                isSearchable
                isDisabled={false}
                isLoading={false}
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder={"selecione ..."}
                onCreateOption={handleCreate}
                onChange={(item) => {
                    setValues(null)
                    handleChange(item)
                }}
            />
        </div>
    )
}