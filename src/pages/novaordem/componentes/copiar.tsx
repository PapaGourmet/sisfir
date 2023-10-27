import React, { useCallback, useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../../context/sisfircontext"
import makeAnimated from 'react-select/animated'
import { createOption } from "../../ordem/create/util"
import Select from 'react-select'
import { formataData, notify } from "./util"
import { OrdemService } from "../interfaces/iordemservice"
import { FirestoreOrdemService } from "../services/firestoreordemservice"
import IOrdem from "../../../interfaces/iordem"
import objectId from "../../../interfaces/objectId"
import Loading from "../../../bundles/loading/loading"
import { GetNumeroOrdem } from "../../../services/servicesApi"

const _service = new FirestoreOrdemService()
const service = new OrdemService(_service)
const print = console.log

export const CopiarComponent: React.FC = () => {
    const { setOrdem, ordem, setOS, OS } = useContext(sisfirContext)
    const [values, setValues] = useState<{ label: string, value: string }[]>([])
    const [De, SetDe] = useState<string | null>(null)
    const [Para, setPara] = useState<string | null>(null)
    const [ordens, setOrdens] = useState<any[]>([])
    const [toCopy, setToCopy] = useState<any[]>([])
    const animatedComponents = makeAnimated()
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (value: any) => {

        value.forEach((t: string) => {
            setValues(pre => [...pre, createOption(t)])
        })

        setToCopy([])

        for (const ord of ordens) {
            const key = Object.keys(ord)[0]
            if (value.includes(key)) {
                setToCopy(pre => [...pre, ord])
            }
        }

    }

    const handleDe = async (data: string) => {
        setValues([])
        if (data) {
            try {
                const response: any = await service.getDayOrdem(data)
                if (response) {
                    setOS(response.OS)
                }
            } catch (e) {
                throw e
            }
        }
    }

    const handleCopy = async () => {
        const toSend: IOrdem[] = []

        console.log(Para)

        const aux: any[] = []

        for (const ord of toCopy) {
            const key = Object.keys(ord)[0]
            const obj = ord[key]
            aux.push(obj)
        }

        let count = 0

        setIsLoading(true)

        const interval = setInterval(async () => {
            try {

                try {

                    let numero = await service.getTotal()
                    let num = `${String(numero).padStart(4, '0')}/2023`
                    print(num)
                    await service.addOrdem(Para!, aux[count], num)
                    await service.setTotal()

                    count++

                } catch (e) {

                }

            } catch (e) {
                throw e
            }

            if (count === aux.length) {
                clearInterval(interval)
                setIsLoading(false)
                notify('Ordens de serviços copiadas')
            }

        }, 750)

    }



    useEffect(() => {
        if (OS) {
            setValues([])
            setOrdens([])
            for (let ord of OS.ordens!) {
                setOrdens(pre => [...pre, ord])
                const key = Object.keys(ord)
                setValues(pre => [...pre, createOption(key[0])])
            }
        }
    }, [OS])


    return (

        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full">
                <label>De</label>
                <input
                    className="border h-10 rounded-lg p-2 outline-none"
                    type="date"
                    onChange={(item: any) => {

                        const { value } = item.target
                        SetDe(formataData(value))
                        handleDe(formataData(value))
                    }}
                >
                </input>
            </div>

            <div className="flex flex-col w-full mt-3">
                <label>Para</label>
                <input
                    className="border h-10 rounded-lg p-2 outline-none"
                    type="date"
                    onChange={(item: any) => {
                        const { value } = item.target
                        setPara(formataData(value))
                    }}
                >
                </input>
            </div>


            <div className="flex flex-col w-full mt-3">
                <label>Ordens</label>
                <Select
                    options={values}
                    isMulti
                    name="colors"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(item) => {
                        const response: string[] = []
                        item.forEach((i: any) => {
                            response.push(i.label)
                        })

                        handleChange(response)
                    }}
                />
            </div>

            {!isLoading && !!De && !!Para && <div className="flex flex-col w-full items-center justify-center mt-10">
                <button
                    className="h-20 w-20 bg-blue-900 hover:bg-blue-600 text-white rounded-full"
                    onClick={() => {
                        handleCopy()
                    }}
                >COPIAR
                </button>
            </div>}

            {
                isLoading &&
                <div className="flex items-center justify-center">
                    <Loading />
                </div>
            }

            <pre>{De} - {Para}</pre>
        </div>


    )
}