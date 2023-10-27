import React, { useCallback, useContext, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import makeAnimated from 'react-select/animated'
import { createOption } from "../../ordem/create/util"
import Select from 'react-select'

export const EditarComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)
    const [values, setValues] = useState<{ label: string, value: string }[]>([])
    const animatedComponents = makeAnimated()

    const handleChange = (value: any) => {

        value.forEach((t: string) => {
            setValues(pre => [...pre, createOption(t)])
        })

        if (ordem) {
            setOrdem({ ...ordem, integracao: value })
        }
    }


    return (

        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
                <label>Dia</label>
                <input
                    className="border h-10 rounded-lg p-2 outline-none"
                    type="date"
                    onChange={(item: any) => {
                        const { value } = item.target
                        handleChange(value)
                    }}
                >
                </input>
            </div>


            <div className="flex flex-col w-full mt-3">
                <label>Ordens</label>
                <select
                    className="border h-10 rounded-lg p-2 outline-none"
                    defaultValue={"tipo"}
                    onChange={(item: any) => {
                        const { value } = item.target
                        handleChange(value)
                    }}
                >
                    <option className='text-slate-100' value="tipo" disabled>selecione ...</option>
                </select>
            </div>

            <div className="flex flex-col w-full items-center justify-center mt-10">
                <button
                    className="h-20 w-20 bg-blue-900 hover:bg-blue-600 text-white rounded-full"
                >COPIAR
                </button>
            </div>
        </div>


    )
}