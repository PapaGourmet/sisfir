import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseNAOConfig from '../../../util/firebase-nao-config'
import App from "../../../App"
import { getDatabase } from 'firebase/database'
import Loading from "../../../bundles/loading/loading"
import moment from "moment"
import Modal from "react-modal"
import { DelEmail, PatchEmail } from '../../../services/servicesApi'
const firebase = initializeApp(firebaseNAOConfig, "email-manager")
import { ref } from "firebase/database"
import { useDatabaseSnapshot } from "@react-query-firebase/database"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const database = getDatabase(firebase)
const GRUPOS = [
    { label: 'Alpha', value: 'Alpha' },
    { label: 'Bravo', value: 'Bravo' },
    { label: 'Charlie', value: 'Charlie' },
    { label: 'Delta', value: 'Delta' },
    { label: 'Omega', value: 'Omega' }
]




interface IContact {
    Name: string,
    Email: string,
    Key?: string,
    Grupo: string
}


const sort = function (a: IContact, b: IContact) {
    return a.Name.localeCompare(b.Name)
}

const schema = z.object({
    Name: z.string()
        .nonempty('O campo nome é obrigatório.'),
    Email: z.string()
        .nonempty('O campo email é obrigatório')
        .email('Formato de e-mail inválido'),
    Grupo: z.string()
        .nonempty('O campo grupo é obrigatório')
})

type FormSchema = z.infer<typeof schema>


export default function ManagerEmail() {
    const [isLoading, setIsLoading] = useState(false)
    const [key, setKey] = useState<any>()
    const emails = useRef<IContact[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })


    const handleConfirmClick = () => {
        setIsLoading(true)
        DelEmail(key)
            .then(() => setIsLoading(false))
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
        setIsModalOpen(false)
    }

    const handleCancelClick = () => {
        setIsModalOpen(false)
    }

    const insert = (value: any) => {
        setIsLoading(true)
        const obj: IContact = {
            Name: value.Name,
            Email: value.Email,
            Grupo: value.Grupo
        }

        PatchEmail(obj)
            .then(() => {
                setIsLoading(false)
                reset()
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    }

    const remove = (key: string | undefined) => {
        setKey(key)
        setIsModalOpen(true)
    }

    try {

        const dbRef = ref(database, "email")
        const lista = useDatabaseSnapshot(["email"], dbRef, {
            subscribe: true
        })

        if (lista.isLoading) {
            return <div className="flex items-center justify-center">
                <Loading />
            </div>
        }

        // DataSnapshot
        const snapshot = lista.data
        emails.current = []

        snapshot!.forEach((childSnapshot) => {
            const {
                Email,
                Name,
                Grupo
            } = childSnapshot.val()


            emails.current.push({ Name, Email, Grupo, Key: childSnapshot.key || "" })


        })
    } catch (e) {
        console.log(e)
    }


    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>GERENCIAR E-MAILS</h1>
            </div>

            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <div className="flex flex-col">
                    <p className="text-center text-white">Tem certeza que deseja deletar este item?</p>
                    <div className="grid grid-cols-12 mt-6">
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleConfirmClick}>Sim</button>
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
                </div>
            </Modal>

            <form onSubmit={handleSubmit(insert)}>
                <div className='grid grid-cols-1 md:grid-cols-3 mx-8 mt-3 gap-x-6'>
                    <div>
                        <label className='h-6' htmlFor='nome'>Nome</label>
                        <input
                            id='nome'
                            className='border w-full h-8 rounded-lg outline-none p-2'
                            {...register('Name')}
                        >
                        </input>
                        {errors.Name && <span className='text-red-800'>{errors.Name.message}</span>}
                    </div>

                    <div className='grid grid-col'>
                        <label htmlFor='grupo' className='h-6'>Grupo</label>
                        <select
                            id='grupo'
                            className='border w-full h-8 rounded-lg outline-none'
                            {...register('Grupo')}
                        >
                            <option></option>
                            {
                                GRUPOS.map((x: any, i: number) => (
                                    <option key={i} value={x.value}>{x.label}</option>
                                ))
                            }
                        </select>
                        {errors.Grupo && <span className='text-red-800'>{errors.Grupo.message}</span>}
                    </div>

                    <div className='grid grid-cols-12'>
                        <div className='col-span-10'>
                            <label className='h-6' htmlFor='email'>Email</label>
                            <input
                                id='email'
                                className='border w-full h-8 rounded-lg outline-none p-2'
                                {...register('Email')}
                            >
                            </input>
                            {errors.Email && <span className='text-red-800'>{errors.Email.message}</span>}
                        </div>

                        <div className='col-span-2'>
                            <button
                                type="submit"
                                className='border w-full h-8 mt-8 rounded-lg bg-teal-900 hover:bg-teal-600 text-white'
                            >incluir
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 mx-8 mt-3 gap-x-6'>
                    <table className="table-auto w-full mt-4 text-xs md:text-lg">
                        <thead>
                            <tr className='border first:bg-black text-white'>
                                <th className='p-2'>Nome</th>
                                <th >Email</th>
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.current.sort(sort).map((x: IContact) => (
                                <tr key={`${x.Name + 'tr'}`} className='odd:bg-orange-200 even:bg-blue-50'>
                                    <td className='p-2' key={x.Name} >{`${x.Name} - ${x.Grupo}`}</td>
                                    <td key={x.Email} >{x.Email}</td>
                                    <td key={`${x.Name + 'button'}`} ><button type="button" className="btn btn-link" onClick={() => { remove(x.Key) }}>remover</button></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                    {isLoading && <div className="flex items-center justify-center">
                        <Loading />
                    </div>}
                </div>

            </form>



        </main>
    )
}