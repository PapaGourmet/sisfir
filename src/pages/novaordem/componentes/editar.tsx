import React, { useCallback, useContext, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import makeAnimated from 'react-select/animated'
import { createOption } from "../../ordem/create/util"
import { formataData, notify } from "./util"
import { OrdemService } from "../interfaces/iordemservice"
import { FirestoreOrdemService } from "../services/firestoreordemservice"
import IOs from "../../../interfaces/OS"
import IOrdem from "../../../interfaces/iordem"
const _service = new FirestoreOrdemService()
const service = new OrdemService(_service)

interface EditarComponentProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}


export const EditarComponent: React.FC<EditarComponentProps> = ({ setShowForm }) => {
    const { setOrdem, setDataOS, setOS } = useContext(sisfirContext)
    const [ordens, setOrdens] = useState<IOrdem[]>([])
    const animatedComponents = makeAnimated()

    const handleChange = async (value: any): Promise<void> => {
        setDataOS(value)
        setOrdem({})
        setOrdens([])
        setShowForm(false)

        if (value) {
            const dt = formataData(value)

            try {
                const response: any = await service.getDayOrdem(dt)
                if (response) {
                    console.log(response.ordens)
                    setOrdens(response.ordens)
                    console.log(response.OS)
                    setOS(response.OS)
                }
            } catch (e) {
                throw e
            }

        } else {
            notify('Informe a data para prosseguir')
            return
        }
    }

    const handleSelect = (key: any): void => {
        const ord = ordens.filter((x: IOrdem) => x.key === key)[0]
        setOrdem(ord)
        setShowForm(true)
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
                        handleSelect(value)
                    }}
                >
                    <option className='text-slate-100' value="tipo" disabled>selecione ...</option>
                    {
                        ordens.map((ordem: IOrdem) => (
                            <option key={ordem.key} value={ordem.key}>{ordem.key}</option>
                        ))
                    }
                </select>
            </div>
        </div>


    )
}