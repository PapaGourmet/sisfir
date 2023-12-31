import React, { useCallback, useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import IEmployee from "../../../interfaces/iemployee"
import { InsertItemOpcoes } from "../../../services/servicesApi"
import { createOption } from "./util"
import makeAnimated from 'react-select/animated'
import Select from "react-select"
import { OrientacoesComponent } from "./orientacoes"

export const FiscaisComponent: React.FC = () => {
    const { setOrdem, ordem, equipes } = useContext(sisfirContext)
    const [options, setOptions] = useState<{ label: string, value: string }[]>([])
    const [show, setShow] = useState(false)

    const [values, setValues] = useState<{ label: string, value: string }[]>([])
    const animatedComponents = makeAnimated()

    const handleChange = (value: any) => {

        value.forEach((t: string) => {
            setValues(pre => [...pre, createOption(t)])
        })

        const ordemEquipe: IEmployee[] = []

        for (let v of value) {
            const _iemployee = equipes.filter((x: IEmployee) => x.label === v)
            ordemEquipe.push(_iemployee[0])
        }

        setOrdem({ ...ordem, equipe: ordemEquipe })


    }


    const handleToggleShow = () => {
        setShow(!show)
    }

    useEffect(() => {
        setOptions([])
        setValues([])
        for (const e of equipes) {
            const value = createOption(`${e.label}`)
            setOptions(pre => [...pre, value])
        }

    }, [equipes])

    useEffect(() => {
        if (ordem.equipe) {
            for (let equipe of ordem.equipe) {
                const label = `${equipe.name} (${equipe.role}) (${equipe.unit}) (${equipe.type})`
                setValues(pre => [...pre, createOption(label)])
            }
        }
    }, [ordem])

    return (
        <div className="w-full">
            <div className="flex flex-row w-full gap-x-8">
                <div className="flex flex-col w-11/12">
                    <label>Fiscais</label>
                    <Select
                        value={values}
                        options={options}
                        isMulti
                        isClearable
                        isSearchable
                        isDisabled={false}
                        isLoading={false}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        placeholder={"selecione ..."}
                        onChange={(item) => {
                            setValues([])
                            const response: string[] = []
                            item.forEach((i: any) => {
                                if (response.indexOf(i.label) === -1) {
                                    response.push(i.label)
                                }
                            })

                            handleChange(response)
                        }}
                    />
                </div>
                <div className="flex flex-col w-1/12 items-center justify-center">
                    <label className="text-white">.</label>
                    <button
                        className="border p-2 rounded-lg hover:bg-blue-400 bg-blue-800 text-white font-bold outline-none"
                        onClick={() => handleToggleShow()}
                    >orientações</button>
                </div>
            </div>
            {show && <div className="flex flex-col w-full gap-x-8 mt-4">
                <OrientacoesComponent />
            </div>}

        </div>

    )
}