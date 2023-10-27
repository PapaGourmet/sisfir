import { useEffect, useRef, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../util/firebase-config'
import { getDatabase } from 'firebase/database'
import IEmployee from '../../../interfaces/iemployee'
import IOrdem from '../../../interfaces/iordem'
import moment, { Moment } from 'moment';
import { GetDayOrdem, GetEmails } from "../../../services/servicesApi"
import Modal from "react-modal"
import IEmail from "../../../interfaces/iemail"
import Loading from "../../../bundles/loading/loading"
const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentData } from "firebase/firestore"
import axios, { AxiosRequestConfig } from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
const agora = moment()


const formataData = (data: string) => {
    const yy = data.substring(0, 4)
    const mm = data.substring(5, 7)
    const dd = data.substring(8)
    return `${dd}-${mm}-${yy}`
}

function formatList(list: any) {
    const formattedList = list.map((item: any) => `(${item.name} - ${item.role}) `).join(" ");
    return formattedList;
}

function refreshPage() {
    window.location.reload()
}

/**
 * Adiciona 6 dias a uma data no formato yyyy-mm-dd.
 * 
 * @param {string} dateString - A data a ser modificada, no formato yyyy-mm-dd.
 * @returns {string} A nova data, no formato yyyy-mm-dd.
 */
function addSixDays(dateString: string): string {
    const date = moment(dateString, 'YYYY-MM-DD');
    const newDate = date.add(6, 'days');
    return newDate.format('YYYY-MM-DD');
}


/**
 * Gera uma lista de datas no formato "dd-mm-yyyy" contendo as duas datas fornecidas e todas as datas entre elas.
 *
 * @param startDate - A data de início no formato "yyyy-mm-dd".
 * @param endDate - A data final no formato "yyyy-mm-dd".
 * @returns A lista de datas no formato "dd-mm-yyyy", incluindo as duas datas fornecidas e todas as datas entre elas.
 * @throws {Error} Se as datas fornecidas forem inválidas ou se a data de início for posterior à data final.
 */
function generateDateList(startDate: string, endDate: string): string[] {
    if (!startDate || !endDate) {
        throw new Error('Ambas as datas devem ser fornecidas.');
    }

    const start = moment(startDate, 'YYYY-MM-DD');
    const end = moment(endDate, 'YYYY-MM-DD');

    if (!start.isValid() || !end.isValid()) {
        throw new Error('As datas fornecidas são inválidas.');
    }

    if (start.isAfter(end)) {
        throw new Error('A data de início deve ser anterior ou igual à data final.');
    }

    const dateList: string[] = [];

    let currentDate: Moment = start;

    while (currentDate.isSameOrBefore(end)) {
        dateList.push(currentDate.format('DD-MM-YYYY'));
        currentDate = currentDate.add(1, 'days');
    }

    return dateList;
}


const schema = z.object({
    email: z.string().nonempty("Informe o email do responsável")
})

type modalSchema = z.infer<typeof schema>


export default function CheckReporter() {

    const [ordens, setOrdens] = useState<IOrdem[]>([])
    const [ordem, setOrdem] = useState<IOrdem | null | undefined>()
    const [emails, setEmails] = useState<IEmail[] | DocumentData[]>()
    const [email, setEmail] = useState<any>()
    const [day, setDay] = useState<any>()
    const [lista, setLista] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const ref = useRef<HTMLSelectElement | any>()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<modalSchema>({
        resolver: zodResolver(schema)
    })

    const handleDeleteClick = () => {
        setIsModalOpen(true)
    }


    const handleConfirmClick = (data: any) => {
        const dia = formataData(ordem?.dataOrdem || "")
        setIsLoading(true)
        const config: AxiosRequestConfig = {
            method: 'get',
            url: `https://us-central1-fcz-cacambas.cloudfunctions.net/check?dia=${dia}&os=${ordem?.key}&email=${data.email}`
        }
        axios(config)
            .then(data => {
                setOrdem(null)
                setIsLoading(false)
                setIsModalOpen(false)
                reset()
            })
            .catch(err => {
                setIsLoading(false)
                setIsModalOpen(false)
                reset()
            })

    }

    const handleCancelClick = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        GetEmails()
            .then(data => {
                setEmails(data)
            })
    }, [])


    const getOrdens = async (lista: string[]) => {
        setIsLoading(true)

        try {
            setOrdens([])
            setLista([])
            for (let l of lista) {
                const response = await GetDayOrdem(l)
                if (response.length > 0) {
                    for (let r of response) {
                        setOrdens((pre) => [...pre, r])
                    }
                }
            }

            //setOrdens(ordens.filter((x: IOrdem) => x.status))
            setIsLoading(false)

        } catch (err) {
            setIsLoading(false)
        }

    }


    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>CHECAR ENTREGA DE RELATÓRIOS</h1>
            </div>

            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <form className="flex flex-col" onSubmit={handleSubmit(handleConfirmClick)}>
                    <label htmlFor="email" className="text-white">Email</label>
                    <select
                        id="email"
                        className="p-2 rounded-lg"
                        {...register('email')}

                    >
                        <option></option>
                        {
                            emails?.filter(x => x.Grupo === ordem?.responsavel)
                                .map((x: any, i: number) => (
                                    <option key={i} value={x.Email}>{x.Email}</option>
                                ))
                        }
                    </select>
                    {errors.email && <span className="text-red-300 p-1">{errors.email.message}</span>}
                    <div className="grid grid-cols-12 mt-6">
                        <div className="col-span-5">
                            <button
                                type="submit"
                                className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                style={{
                                    width: "6rem"
                                }}
                            >Enviar</button>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleCancelClick}
                            >Cancelar</button>
                        </div>
                    </div>
                </form>
            </Modal>


            <div className='grid grid-cols-1 md:grid-cols-12 mx-8 mt-3 gap-3.5'>
                <div className="flex flex-col md:col-span-5">
                    <label htmlFor="data">Início</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data"
                        onChange={(item) => {
                            if (item) {
                                setDay(item.target.value)
                                ref.current.value = item.target.value
                            }
                        }}
                    ></input>
                </div>

                <div className="flex flex-col md:col-span-5">
                    <label htmlFor="data">Fim</label>
                    <input
                        ref={ref}
                        type="date"
                        className="form-control"
                        id="data"
                        min={day}
                        max={addSixDays(day)}
                        onChange={(item) => {
                            if (item) {
                                const fim = item.target.value
                                setLista([])
                                setLista(generateDateList(day, fim))
                            }
                        }}
                    ></input>
                </div>

                <div className="flex items-center justify-center md:col-span-2">
                    <button className="border w-12 h-12 mt-4 rounded-full bg-teal-900 hover:bg-teal-600 text-white">
                        <FontAwesomeIcon icon={faCheck} size={'xl'} onClick={() => {
                            if (day && lista.length === 0) {
                                getOrdens([formataData(day)])
                            }

                            if (day && lista.length > 0) {
                                getOrdens(lista)
                            }
                        }} />
                    </button>
                </div>

            </div>

            {
                day && ordens.length > 0 && <div className='grid grid-cols-1 mx-8 mt-3'>

                    <ul className="border p-7 mt-6 rounded-lg bg-cyan-400">
                        {
                            ordens.map((x: IOrdem) => (
                                <li key={x.key} className="w-full border p-2 mb-1 rounded-lg bg-white">
                                    <p className=" border p-2 rounded-lg text-blue-950">{`OS: ${x.key} de ${formataData(x.dataOrdem || "")}`}</p>
                                    {x.responsavel && <>
                                        <p className="mt-1 border p-2 rounded-lg">{`Responsável: ${x.responsavel ? x.responsavel : ""}`}</p>

                                        {x.relator && <p className="mt-1  border p-2 rounded-lg truncate">{`Relator: ${x.relator ? x.relator : ""}`}</p>}

                                        <p className="mt-1 border p-2 rounded-lg">{`Equipe: ${formatList(x.equipe)}`}</p>

                                        <p className={`mt-1  border p-2 rounded-lg ${!x.relatorio ? "text-red-900" : "text-green-900"}`}>{`Status: ${x.relatorio ? "entregue" : "ausente"}`}</p>
                                        {!x.relatorio && <p className="mt-1  border p-1 rounded-lg flex items-center justify-center">
                                            <p
                                                className="p-1 border-none outline-none text-blue-900 hover:text-blue-500 hover:bg-green-50"
                                                onClick={() => {
                                                    setOrdem(x)
                                                    setIsModalOpen(true)
                                                }}
                                            >enviar lembrete</p>
                                        </p>}
                                    </>}
                                    {!x.responsavel && <p className="mt-1 border p-2 rounded-lg">{`Sem responsável definido`}</p>}

                                </li>
                            ))
                        }
                    </ul>

                    {isLoading && <div className="flex items-center justify-center">
                        <Loading />
                    </div>}
                </div>
            }
        </main >
    )
}
