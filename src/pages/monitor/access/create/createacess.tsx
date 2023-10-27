import { initializeApp } from "firebase/app"
import firebaseNAOConfig from '../../../../util/firebase-nao-config'
import moment from "moment"
const firebase = initializeApp(firebaseNAOConfig, "email-manager")
import { getFirestore } from "firebase/firestore"
const database = getFirestore(firebase)
const agora = moment()
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import {
    query,
    collection,
} from "firebase/firestore";
import Loading from "../../../../bundles/loading/loading"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react"
import { InsertAcesso } from "../../../../services/servicesApi"
const uriRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+){1,4}\.(?:[a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,}|com\.br|br)(?:\/[\w#!:.?+=&%@!\-\/]*)?$/;


const tiposDeEmpresa = ['Extraordinário', 'Biológico', 'Reciclagem']


interface IDataAccess {
    link: string,
    login: string,
    senha: string
}

const accessFormSchema = z.object({
    link: z.string()
        .nonempty('O link é obrigatório')
        .regex(new RegExp(uriRegex), 'Endereço URL inválido')
        .toLowerCase()
        .trim(),

    login: z.string()
        .nonempty('O login é obrigatório')
        .trim(),

    senha: z.string()
        .nonempty('A senha é obrigatória')
        .trim(),

    monitoramento: z.string()
        .nonempty('O monitoramento é obrigatório')
        .trim(),
})

type AccessFormSchema = z.infer<typeof accessFormSchema>

export default function AcessCreate() {

    const [tipo, setTipo] = useState<any>()
    const [empresa, setEmpresa] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AccessFormSchema>({
        resolver: zodResolver(accessFormSchema)
    })

    // Define a query reference using the Firebase SDK
    const reference = query(collection(database, "empresas"));

    // Provide the query to the hook
    const q = useFirestoreQuery(["empresas"], reference, {
        subscribe: true,
    });

    if (q.isLoading) {
        return <div className="flex items-center justify-center">
            <Loading />
        </div>;
    }

    const snapshot = q.data;


    const inserir = (data: any) => {
        setIsLoading(true)
        InsertAcesso(empresa, data)
            .then(
                () => {
                    setIsLoading(false)
                    window.location.reload()
                }
            )

            .catch(
                (err) => {
                    setIsLoading(false)
                }
            )
    }


    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>SALVAR ACESSOS</h1>
            </div>

            <form
                onSubmit={handleSubmit(inserir)}
            >
                <div className="grid grid-cols-1 mx-8 mt-3">
                    <label>Tipo</label>
                    <select className="border p-1 mb-6 rounded-md outline-none" id="exampleFormControlSelect1"
                        onChange={(item) => {
                            setTipo(item.target.value)
                        }}
                    >
                        <option key={1000}>selecione ...</option>
                        {tiposDeEmpresa.map((x, i) => (
                            <option value={i}>{x}</option>
                        ))}
                    </select>


                    {tipo && <>
                        <label>Empresa</label>
                        <select className="border p-1 rounded-md outline-none" id="exampleFormControlSelect1"
                            onChange={(item) => {
                                setEmpresa(item.target.value)
                            }}
                        >
                            <option key={1000}>selecione ...</option>
                            {snapshot?.docs
                                .sort(function (a: any, b: any) {
                                    return a.data().nome.localeCompare(b.data().nome);
                                })
                                .filter(x => x.data().tipo === tiposDeEmpresa[tipo])
                                .map((x, i) => (
                                    <option key={i} value={x.id}>{x.data().nome}</option>
                                ))}
                        </select>
                    </>}
                </div>

                {empresa && <>

                    <div className="grid grid-cols-1 mx-8 mt-3">
                        <div className="flex flex-col mt-2">
                            <label htmlFor="monitoramento">Monitoramento</label>
                            <input id="monitoramento" className="border p-1 outline-none px-2  rounded-md"
                                {...register('monitoramento')}
                            ></input>
                            {errors.monitoramento && <span className="text-red-800">{errors.monitoramento.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 mt-6 mx-8">
                        <div className="flex flex-col">
                            <label htmlFor="login">Login</label>
                            <input id="logn" className="border p-1 outline-none px-2  rounded-md"
                                {...register('login')}
                            ></input>
                            {errors.login && <span className="text-red-800">{errors.login.message}</span>}
                        </div>

                        <div className="flex flex-col ">
                            <label htmlFor="senha">Senha</label>
                            <input id="senha" className="border p-1 outline-none px-2 rounded-md"
                                {...register('senha')}
                            ></input>
                            {errors.senha && <span className="text-red-800">{errors.senha.message}</span>}
                        </div>

                        <div className="flex flex-col ">
                            <label htmlFor="link">Link</label>
                            <input id="link" className="border p-1 outline-none px-2 rounded-md"
                                {...register('link')}
                            ></input>
                            {errors.link && <span className="text-red-800">{errors.link.message}</span>}
                        </div>
                    </div>

                    <div className="flex mt-4 items-center justify-center">
                        <button
                            type="submit"
                            className="bg-emerald-700 w-20 h-20 rounded-full hover:bg-emerald-600  text-white"
                        >inserir</button>
                    </div>

                </>}

                {isLoading && <div className="flex items-center justify-center">
                    <Loading />
                </div>}


            </form>

        </main>


    )
}