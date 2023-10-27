import React, { useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InputMask from 'react-input-mask'
import ClientesZodSchema from "../../zods/zodschemaclientes"
import { FormDataEnvio, ResponseCep } from "../../../../../types/types"
import { uid as uid2 } from "uid"
import Loading from "../../../../../bundles/loading/loading"
import { ViaCep } from "../../ioc/cep/viacep"
import { CepManager } from "../../ioc/cep/icep"
import { FirebaseClienteDatabase } from "../../ioc/clientes/clienteDatabase"
import { ClienteManager } from "../../ioc/clientes/iclientesrepository"
import { toast, ToastContainer } from "react-toastify"
const clienteDatabase = new FirebaseClienteDatabase()
const clienteManager = new ClienteManager(clienteDatabase)
import { cpf, cnpj } from 'cpf-cnpj-validator'
const data = { logradouro: "", bairro: "", localidade: "", uf: "" }


const Clients: React.FC = () => {
    const [tipo, setTipo] = useState<string | null>("")
    const [cep, setCep] = useState<string>("")
    const [dataCep, setDataCep] = useState<ResponseCep>(data)
    const [isLoading, setIsLoading] = useState(false)
    const [isDuplicate, setisDuplicate] = useState(false)
    const [isInative, setisInative] = useState(false)
    const { register, handleSubmit, setError, reset, setValue, errors } = ClientesZodSchema()
    const uid = useRef(localStorage.getItem('uid') || "")


    const notify = (message: string) => toast(message,
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        })

    const handleSearchCEP = async () => {
        try {

            const cepFind = new ViaCep()
            const cepManager = new CepManager(cepFind)
            setIsLoading(true)
            const response = await cepManager.buscarCep(cep)

            if (response?.logradouro === undefined) {
                setError('cep', { message: 'Código Postal inexistente' })
                setDataCep(data)
                return
            }

            setDataCep(response)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestDocumet = async (documento: string) => {
        let test: boolean = false

        if (tipo === 'Cpf') {
            test = cpf.isValid(documento)
        }

        if (tipo === 'Cnpj') {
            test = cnpj.isValid(documento)
        }

        try {
            if (test) {
                const response = await clienteManager.buscarClientePorDocumento(documento, uid.current)
                if (!!response?.documento) {

                    if (!response.status) {
                        setError('documento', {
                            type: 'manual',
                            message: 'Esse cliente foi inativado, vá para aba reativar cliente'
                        })
                        return
                    }

                    setError('documento', {
                        type: 'manual',
                        message: 'Documento cadastrado para outro cliente'
                    })

                    setisDuplicate(true)
                } else {
                    setisDuplicate(false)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleCelFixo = (celular: string, fixo: string) => {
        if (!celular && !fixo) {
            setError('celular', { message: 'É necessário informa um celular ou um fixo' })
            return


        } else {
            if (celular) {
                const regexCelularBrasileiro = /^\(\d{2}\) 9\d{4}-\d{4}$/
                const test = regexCelularBrasileiro.test(celular)
                if (!test) {
                    setError('celular', { message: 'Formato de número inválido' })
                    return
                }
            }

            if (fixo) {
                const regexTelefoneFixo = /^\(\d{2}\) \d{4}-\d{4}$/
                const test = regexTelefoneFixo.test(fixo)
                if (!test) {
                    setError('fixo', { message: 'Formato de número inválido' })
                    return
                }
            }
        }
    }

    const handleSaveData = async (data: any) => {

        if (!dataCep.logradouro) {
            setError('cep', { message: 'Busca pelos dados obrigatória' })
        }

        if (isDuplicate) {
            setError('documento', {
                type: 'manual',
                message: 'Documento cadastrado para outro cliente'
            })

            return
        }

        const {
            tipo,
            documento,
            nome,
            email,
            cep,
            numero,
            complemento,
            celular,
            fixo
        } = data

        handleCelFixo(celular, fixo)

        const user = localStorage.getItem('email') || ""
        const uid = localStorage.getItem("uid") || ""

        const envio: FormDataEnvio = {
            id: String(uid2(10)),
            user,
            uid,
            tipo,
            documento,
            nome,
            email,
            cep,
            logradouro: dataCep.logradouro,
            bairro: dataCep.bairro,
            municipio: dataCep.localidade,
            uf: dataCep.uf,
            numero: numero ? numero : "",
            celular: celular ? celular : "",
            complemento: complemento ? complemento : "",
            fixo: fixo ? fixo : ""
        }

        setIsLoading(true)

        try {
            await clienteManager.adicionarCliente(envio)
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
            reset()
            setValue('documento', "")
            setValue("cep", "")
            setValue("celular", "")
            setValue("fixo", "")
            setDataCep(data)
            setIsLoading(false)
            notify("Sucesso")
        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }
    }

    return (
        <main>
            <form onSubmit={handleSubmit(handleSaveData)}>

                <div className="grid grid-col-1 md:grid-cols-2 gap-x-6">
                    <div className="flex flex-col mt-3 ">
                        <label>Tipo</label>
                        <select
                            className="border outline-none h-8 rounded-md text-sm"
                            {...register('tipo')}
                            onChange={(item: React.ChangeEvent<HTMLSelectElement>) => {
                                const value = String(item.target.value)
                                setTipo(value)
                            }}
                        >
                            <option></option>
                            <option value={"Cnpj"}>Cnpj</option>
                            <option value={"Cpf"}>Cpf</option>
                        </select>
                        {errors.tipo && <span className="alerta">{errors.tipo.message}</span>}
                    </div>


                    {!!tipo && <>
                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>{tipo || 'Documento'}</label>
                            <InputMask
                                mask={tipo === 'Cpf' ? '999.999.999-99' : '99.999.999/9999-99'}
                                className="border outline-none h-8 rounded-md p-2"
                                {...register('documento')}
                                onChange={(doc: any) => {
                                    const { value } = doc.target

                                    handleTestDocumet(value)
                                }}
                            />
                            {errors.documento && <span className="alerta">{errors.documento.message}</span>}
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>{tipo === 'Cnpj' ? 'Razão social' : 'Nome completo'}</label>
                            <input
                                className="border outline-none h-8 rounded-md p-2"
                                {...register('nome')}
                            ></input>
                            {errors.nome && <span className="alerta">{errors.nome.message}</span>}
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Email</label>
                            <input
                                className="border outline-none h-8 rounded-md p-2"
                                {...register('email')}
                            ></input>
                            {errors.email && <span className="alerta">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Cep</label>
                            <div className="grid grid-cols-12">
                                <div className="col-span-11">
                                    <InputMask
                                        mask={'99999-999'}
                                        className="border w-full outline-none h-8 rounded-md p-2"
                                        {...register('cep')}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            const value = String(event.target.value)
                                            if (value.replaceAll('_', '').length < 9) {
                                                setCep("")
                                                return
                                            }

                                            setCep(value)

                                        }}
                                    />
                                    {errors.cep && <span className="alerta">{errors.cep.message}</span>}
                                </div>

                                <div className="col-span-1">
                                    <button
                                        className="border outline-none w-full h-8 rounded-md"
                                        type="button"
                                        onClick={handleSearchCEP}
                                    >
                                        <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faSearch} size={'sm'} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div></div> {/* div vazia */}

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Logradouro</label>
                            <input
                                value={dataCep.logradouro}
                                disabled
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            ></input>
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Bairro</label>
                            <input
                                value={dataCep.bairro}
                                disabled
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            ></input>
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Município</label>
                            <input
                                value={dataCep.localidade}
                                disabled
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            ></input>
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>UF</label>
                            <input
                                value={dataCep.uf}
                                disabled
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            ></input>
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Número</label>
                            <input
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                                {...register('numero')}
                            ></input>
                            {errors.numero && <span className="alerta">{errors.numero.message}</span>}
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Complemento</label>
                            <input
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                                {...register('complemento')}
                            ></input>
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Celular</label>
                            <InputMask
                                mask="(99) 99999-9999"
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                                {...register('celular')}
                            />
                            {errors.celular && <span className="alerta">{errors.celular.message}</span>}
                        </div>

                        <div className="flex flex-col gap-x-3 mt-3">
                            <label>Fixo</label>
                            <InputMask
                                mask="(99) 9999-9999"
                                className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                                {...register('fixo')}
                            />
                            {errors.fixo && <span className="alerta">{errors.fixo.message}</span>}
                        </div>

                    </>}

                </div>

                {!!tipo && <div className='flex justify-center items-center mt-10'>
                    <button
                        className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                        type="submit"
                    >salvar</button>
                </div>}

                <ToastContainer />

                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            </form>

        </main>
    )
}

export default Clients