import React, { useCallback, useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import { createOption } from "./util"
import { InsertItemOpcoes } from "../../../services/servicesApi"

export const MotivacaoComponent: React.FC = () => {
    const { setOrdem, ordem, options } = useContext(sisfirContext)
    const [values, setValues] = useState<{ label: string, value: string }[]>([])
    const animatedComponents = makeAnimated()

    const handleChange = (value: any) => {

        value.forEach((t: string) => {
            setValues(pre => [...pre, createOption(t)])
        })

        if (ordem) {
            setOrdem({ ...ordem, motivacao: value })
        }
    }

    const handleCreate = useCallback(async (inputValue: string) => {
        const newOption = createOption(inputValue)
        await InsertItemOpcoes('motivacao', inputValue)
    }, [])

    return (
        <div className="flex flex-col w-full">
            <label>Motivação</label>
            <CreatableSelect
                value={values}
                options={options.motivacao}
                isMulti
                isClearable
                isSearchable
                isDisabled={false}
                isLoading={false}
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder={"selecione ..."}
                onCreateOption={handleCreate}
                onChange={(item) => {
                    setValues([])
                    const response: string[] = []
                    item.forEach((i: any) => {
                        response.push(i.label)
                    })

                    handleChange(response)
                }}
            />
        </div>
    )
}