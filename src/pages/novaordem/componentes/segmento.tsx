import React, { useCallback, useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import { createOption } from "./util"
import { InsertItemOpcoes } from "../../../services/servicesApi"

export const SegmentoComponent: React.FC = () => {
    const { setOrdem, ordem, options, setEquipes, setDataOS } = useContext(sisfirContext)
    const [values, setValues] = useState<{ label: string, value: string }[]>([])
    const animatedComponents = makeAnimated()

    const handleChange = (value: any) => {

        setEquipes([])
        setDataOS(null)

        value.forEach((t: string) => {
            setValues(pre => [...pre, createOption(t)])
        })


        if (ordem) {
            setOrdem({ ...ordem, segmento: value })
        }
    }

    const handleCreate = useCallback(async (inputValue: string) => {
        const newOption = createOption(inputValue)
        await InsertItemOpcoes('segmento', inputValue)
    }, [])

    return (
        <div className="flex flex-col w-full">
            <label>Segmento</label>
            <CreatableSelect
                value={values}
                options={options.segmento}
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