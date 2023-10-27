import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { handleUpload } from '../../../../services/servicesApi'
import Loading from '../../../../bundles/loading/loading'
import axios, { AxiosRequestConfig } from 'axios'
import { uid } from 'uid'
import Tooltip from '../../../../bundles/toolstip/toolstip'
import { arrayToUrl } from '../../utils/utils'

type Email = {
    Email: string,
    Grupo: string,
    Nome: string
}

interface EnviarProps {
    isOpen: boolean,
    onCancel: () => void
}

const Enviar: React.FC<EnviarProps> = ({ isOpen, onCancel }) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState<any>()
    const [emails, setEmails] = useState<Email[]>([])
    const [lista, setLista] = useState<Email[]>([])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }, [])

    useEffect(() => {
        const config: AxiosRequestConfig = {
            method: "get",
            url: "https://fcz-nao-default-rtdb.firebaseio.com/email.json"
        }

        axios(config)
            .then(response => {
                setEmails([])
                const { data } = response
                const list = Object.keys(data)

                for (let l of list) {
                    setEmails((pre) => [...pre, data[l]])
                }
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onCancel}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <form className="flex flex-col">
                    <input
                        type="file"
                        value={file ? undefined : ''}
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className='border p-2 rounded-lg'

                    />

                    <label className='mt-3 text-white'>Emails</label>

                    <div className='grid grid-cols-12 gap-3'>
                        <div className='col-span-10'>
                            <select
                                value={selected ? selected : ""}
                                className='w-full border p-2 rounded-lg outline-none'
                                onChange={(item: ChangeEvent<HTMLSelectElement>) => {
                                    setSelected(item.target.value)
                                }}
                            >
                                <option></option>
                                {emails
                                    .sort((a, b) => a.Email.localeCompare(b.Email))
                                    .map((x: Email, i: number) => (
                                        <option key={x.Email} value={i}>{x.Email}</option>
                                    ))}

                            </select>
                        </div>

                        <div className='col-span-2 flex items-center justify-center'>
                            <span
                                className='solid outline-none text-blue-100 hover:text-red-300'
                                onClick={() => {
                                    if (selected) {
                                        setLista((pre: Email[]) => [...pre, emails[selected]])
                                        setEmails((pre: Email[]) => pre.filter((x: Email) => x !== emails[selected]))
                                        setSelected(null)
                                    }
                                }}
                            >
                                incluir
                            </span>
                        </div>
                    </div>

                    <Tooltip content='clique para remover'>
                        <label className='mt-3 text-white'>Selecionados</label>
                    </Tooltip>

                    <div className='w-full h-48 border overflow-auto'>
                        <ul className='text-white p-2'>
                            {
                                lista.map((x: Email, i: number) => (
                                    <li
                                        className='ml-4 hover:text-red-400 p-1'
                                        key={x.Nome}
                                        onClick={() => {
                                            setEmails((pre: Email[]) => [...pre, lista[i]])
                                            setLista((pre: Email[]) => pre.filter((x: Email) => x !== lista[i]))

                                        }}

                                    >{x.Email}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <div className='flex items-center justify-center'>
                            <button
                                type={'button'}
                                className='mt-4 h-20 w-20 rounded-full bg-green-700 hover:bg-green-100 text-white'
                                onClick={async () => {
                                    if (file && lista.length > 0) {

                                        const novaLista = lista.map((emails: Email) => emails.Email)
                                        const querys = arrayToUrl('key', novaLista)

                                        try {
                                            const response = await handleUpload(file, setUploading)
                                            const apiUrl = `https://us-central1-fcz-cacambas.cloudfunctions.net/pdf?${querys}&url=${response}`
                                            setIsLoading(true)

                                            fetch(apiUrl)
                                                .then(() => {
                                                    setUploading(false)
                                                    setIsLoading(false)
                                                    setFile(null)
                                                    //props.setIsSendlOpen(false)
                                                    location.reload()
                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                    setIsLoading(false)
                                                })


                                        } catch (err) {
                                            console.log(err)
                                            setIsLoading(false)
                                        }
                                    }
                                }} disabled={uploading}>
                                enviar
                            </button>
                        </div>

                        <div className='flex items-center justify-center'>
                            <button
                                type='button'
                                className='mt-4 h-20 w-20 rounded-full bg-red-700 hover:bg-red-100 text-white'
                                onClick={onCancel}
                            >
                                cancelar
                            </button>
                        </div>
                    </div>


                </form>
                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}
            </Modal>


        </div>
    )
}

export default Enviar
