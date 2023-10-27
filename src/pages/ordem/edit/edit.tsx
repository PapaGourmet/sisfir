import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../util/firebase-config'
import App from "../../../App"
import { getDatabase } from 'firebase/database'
import Loading from "../../../bundles/loading/loading"
import IEmployee from '../../../interfaces/iemployee'
import moment from "moment"
import { GetOpcoes, RemoveItemOpcoes } from "../../../services/servicesApi"
import IOptions from "../../../interfaces/ioptions"
import { DocumentData } from "firebase/firestore"
const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)
const agora = moment()
const lista = [, 'acao', 'integracao', 'motivacao', 'recursos', 'segmento']


const sort = (a: IEmployee, b: IEmployee) => {
    if (a.name > b.name) {
        return 1
    }

    if (a.name < b.name) {
        return -1
    }

    return 0
}

const formataData = (data: string) => {
    const yy = data.substring(0, 4)
    const mm = data.substring(5, 7)
    const dd = data.substring(8)
    return `${dd}-${mm}-${yy}`
}

interface IList {
    label: string,
    value: string
}

const sortList = (a: IList, b: IList) => {
    if (a.label > b.label) {
        return 1
    }

    if (a.label < b.label) {
        return -1
    }

    return 0
}

function refreshPage() {
    window.location.reload()
}

export default function EditOrdem() {
    const [msg, setMsg] = useState("Escolha uma opção para prosseguir.")
    const [style, setStyle] = useState("alert-danger")
    const [showMsg, setShowMsg] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState<IOptions | DocumentData | undefined>({ acao: [] })
    const [option, setOption] = useState<number>()
    const [showCase, setShowCase] = useState(false)
    const [value, setValue] = useState<any>()
    const [itens, setItens] = useState<IList[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        GetOpcoes()
            .then(response => {
                setIsLoading(false)
                setOptions(response)
            })
            .catch((err) => {
                setIsLoading(false)
            })
    }, [])


    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>REMOVER ITENS</h1>
            </div>
            <div className='grid grid-cols-1 mx-8 mt-3'>
                <label htmlFor="opcoes">Opções</label>
                <select
                    value={option ? option : 0}
                    className="form-control"
                    id="opcoes"
                    onChange={(item) => {
                        if (item.target.value) {
                            setShowMsg(false)
                            const response = parseInt(item.target.value)
                            setShowCase(true)
                            setOption(response)
                            const type = lista[response]
                            //@ts-ignore
                            setItens(options![type])
                        }
                    }}
                >
                    <option></option>
                    <option value={1}>ação</option>
                    <option value={2}>integração</option>
                    <option value={3}>motivação</option>
                    <option value={4}>recursos</option>
                    <option value={5}>segmentos</option>
                </select>
            </div>

            <div className='grid grid-cols-1 mx-8 mt-3'>
                <ul className="list-group">

                    {
                        itens!.map((x: any) => (
                            <li className="flex items-center justify-center" key={x.value}>
                                <div className="grid grid-cols-12 border min-w-full">
                                    <div className="col-span-8 ml-6 flex items-center">
                                        {x.value}
                                    </div>

                                    <div className="col-span-4 flex justify-end p-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-link"
                                            onClick={() => {
                                                setShowMsg(false)
                                                if (!option) {
                                                    setShowMsg(true)
                                                    return
                                                }

                                                RemoveItemOpcoes(option || 0, x.label)
                                                    .then(() => {
                                                        GetOpcoes()
                                                            .then(response => {
                                                                setIsLoading(false)
                                                                setOptions(response)
                                                                const type = lista[option]

                                                                //@ts-ignore
                                                                setItens(response![type])
                                                            })
                                                            .catch((err) => {
                                                                setIsLoading(false)
                                                            })
                                                    })
                                                    .catch(err => {
                                                        setIsLoading(false)
                                                    })
                                            }}

                                        >remover</button>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className='flex items-center justify-center'>
                {isLoading && <Loading />}
            </div>
        </main>
    )
}
