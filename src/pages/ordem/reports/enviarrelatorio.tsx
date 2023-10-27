import { useEffect, useRef, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../util/firebase-config'
import { getDatabase } from 'firebase/database'
import Loading from "../../../bundles/loading/loading"
import IEmployee from '../../../interfaces/iemployee'
import IOrdem from '../../../interfaces/iordem'
import moment from 'moment-timezone';
import { DeleteOrdem as UpdateOrdem, GetDayOrdem } from "../../../services/servicesApi"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)
const agora = moment().tz('America/Sao_Paulo').valueOf();


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

const GerarSaidaFormatada = (data: number): string => {
    return moment(data).tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss');
};

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

export default function ReportSend() {

    const [showOrdemSelect, setShowOrdemSelect] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [ordens, setOrdens] = useState<IOrdem[]>([])
    const [ordem, setOrdem] = useState<IOrdem | null | undefined>()
    const [showText, setShowText] = useState(false)
    const refTextArea = useRef<HTMLTextAreaElement | any>()
    const refTextAreaClone = useRef<HTMLTextAreaElement>()

    const schema = z.object({
        report: z.string()
            .nonempty('Preencha o relatório operacional')
            .min(10, 'Use um mínimo de 10 caracteres')
            .max(255, 'Use um máximo 255 caracteres'),
        key: z.string(),
        dia: z.string().transform((value) => formataData(value))
    })

    type FormSchema = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormSchema>({
        mode: 'onChange',
        resolver: zodResolver(schema)
    })

    const enviar = (value: any) => {
        setIsLoading(true)
        const { dia, key, report } = value
        const index = ordens.findIndex((x: IOrdem) => x.key === key)
        ordens[index].relatorio = report
        ordens[index].relator = localStorage.getItem('email')
        ordens[index].dataEnvio = agora

        //  renomeei para UpdateOrdem por uma questão de melhor compreensão
        // Essa função chama-se DeleteOrdem na realidade
        UpdateOrdem(dia, ordens, value)
            .then(data => {
                setIsLoading(false)
                setShowText(false)
                showText
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        /**
         * Função do Hook UseForm
         */
        setValue('report', ordem?.relatorio ? ordem.relatorio : "")
    }, [showText])


    return (
        <main className="flex flex-col gap-3">
            <form onSubmit={handleSubmit(enviar)}>
                <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                    <h1>ENVIAR RELATÓRIO</h1>
                </div>

                {/* data */}
                <div className="flex mt-4 grid-cols-1 items-center justify-center">
                    <div className="grid grid-col w-full mx-8">
                        <label htmlFor="motivacao-outros">Data</label>
                        <input
                            type="date"
                            className="form-control"
                            id="motivacao-outros"
                            placeholder="Informe a motivação"
                            {...register('dia')}
                            onChange={(item) => {
                                setOrdem(null)
                                setShowOrdemSelect(true)
                                setIsLoading(true)
                                const data = formataData(item.target.value)

                                GetDayOrdem(data)
                                    .then(response => {
                                        setIsLoading(false)
                                        setOrdens(response.filter((x: IOrdem) => x.status))
                                    })

                                    .catch(err => {
                                        setIsLoading(false)
                                    })
                            }}
                        >

                        </input>


                        {showOrdemSelect && <>
                            <label htmlFor="motivacao-outro" className="mt-3">Ordem de serviço</label>
                            <select
                                className="form-control"
                                {...register('key')}
                                value={ordem ? ordem!.key : '0'}
                                id="motivacao-outros"
                                placeholder="Informe a motivação"
                                onChange={(item) => {
                                    setShowText(false)
                                    if (item) {
                                        const value = item.target.value
                                        const index = ordens.findIndex((x: IOrdem) => x.key === value)
                                        const ordem = ordens[index]
                                        if (!ordem.relatorio) {
                                            ordem.relatorio = ""
                                        }

                                        setOrdem(ordem)
                                    }
                                }}
                            >
                                <option value={'0'}>selecione ...</option>
                                {
                                    ordens.map((x: IOrdem) => (
                                        <option key={x.key} value={x.key}>{x.key}</option>
                                    ))
                                }

                            </select>

                            {ordem && <ul className="border p-7 mt-6 rounded-lg bg-cyan-400">
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white "><b>Segmento</b>{`: ${ordem?.segmento}`}</li>
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white"><b>Unidade</b>{`: ${ordem?.unit}`}</li>
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white"><b>Local</b>{`: ${ordem?.local}`}</li>
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white"><b>Ação</b>{`: ${ordem?.acao}`}</li>
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white"><b>Motivação</b>{`: ${ordem?.motivacao}`}</li>
                                <li className="w-full border p-2 mb-1 rounded-lg bg-white"><b>Recursos</b>{`: ${ordem?.recursos}`}</li>
                            </ul>}


                            {ordem && <>
                                <label htmlFor="obs" className="mt-3">Relatório</label>
                                <div className="grid grid-cols-12 items-center justify-center">
                                    {!showText && <>
                                        <textarea
                                            ref={refTextArea}
                                            value={ordem! ? ordem.relatorio! : ''}
                                            disabled
                                            className="border rounded-tl-lg rounded-bl-lg col-span-9 md:col-span-11 h-full p-3"
                                            id="obs"
                                            rows={3}
                                        ></textarea>


                                        <button
                                            type="button"
                                            className="outline-none border rounded-tr-lg rounded-br h-full w-full col-span-3 md:col-span-1 text-teal-600 hover:text-teal-950 hover:bg-teal-50 text-sm md:text-xl truncate"
                                            onClick={() => {
                                                setShowText(true)
                                            }}
                                        >
                                            atualizar
                                        </button>
                                    </>}


                                    {showText && <>
                                        <textarea
                                            //@ts-ignore
                                            ref={refTextAreaClone}
                                            className="outline-none border rounded-tl-lg rounded-bl-lg col-span-9 md:col-span-11 h-full p-3 hover:bg-teal-50"
                                            id="obs"
                                            rows={3}
                                            {...register('report')}

                                        ></textarea>


                                        <button
                                            type="submit"
                                            className="outline-none border rounded-tr-lg rounded-br h-full w-full col-span-3 md:col-span-1 text-teal-600 hover:text-teal-950 hover:bg-teal-50 text-sm md:text-xl truncate"
                                        >
                                            salvar
                                        </button>
                                    </>}
                                </div>
                                {errors.report && <span className="text-red-700 mt-1">{errors.report.message}</span>}
                                {ordem && ordem.dataEnvio && <span className="mt-1 text-green-700">{`Ultima atualização: ${GerarSaidaFormatada(ordem.dataEnvio)} (${ordem.relator})`}</span>}
                            </>}

                        </>}
                    </div>
                </div>


                <div className='flex items-center justify-center'>
                    {isLoading && <Loading />}
                </div>
            </form>

        </main>
    )
}