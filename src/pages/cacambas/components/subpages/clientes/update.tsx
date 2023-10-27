import React, { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import InputMask, { ReactInputMask } from 'react-input-mask'
import useFormClientes from "../../zods/zodschemaclientes"
import { FormDataEnvio, ResponseCep } from "../../../../../types/types"
import { uid as uid2 } from "uid"
import Loading from "../../../../../bundles/loading/loading"
import { ViaCep } from "../../ioc/cep/viacep"
import { CepManager } from "../../ioc/cep/icep"
import { FirebaseClienteDatabase } from "../../ioc/clientes/clienteDatabase"
import { ClienteManager } from "../../ioc/clientes/iclientesrepository"
import { toast, ToastContainer } from "react-toastify"
import SelectClientesCacambas from "../../components/selectclientes"
const clienteDatabase = new FirebaseClienteDatabase()
const clienteManager = new ClienteManager(clienteDatabase)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

const data = { logradouro: "", bairro: "", localidade: "", uf: "" }

const ClientsAtualizar: React.FC = () => {
    const [cliente, setCliente] = useState<FormDataEnvio>(initCliente)
    const [tipo, setTipo] = useState<string | null>(null)
    const [cep, setCep] = useState<string>("")
    const [dataCep, setDataCep] = useState<ResponseCep>(data)
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, setValue, errors } = useFormClientes()

    const notify = () => toast("Sucesso",
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

    const handleUpdateData = (data: any) => {

        if (!dataCep.logradouro) {
            setError('cep', { message: 'Busca pelos dados obrigatória' })
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

        const user = localStorage.getItem('email') || ""
        const uid = localStorage.getItem("uid") || ""

        const envio: FormDataEnvio = {
            id: cliente.id,
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
            clienteManager.atualizarCliente(envio)
            setTimeout(() => {
                setIsLoading(false)
                notify()
            }, 200)
        } catch (err) {

        }
    }

    const handleSearchCEP = async () => {
        try {

            if (!cep) {
                return
            }

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


    useEffect(() => {
        if (cliente) {
            const { logradouro, bairro, municipio, uf, ...rest } = cliente


            Object.entries(rest).forEach(([key, value]) => {
                if (key === 'tipo') {
                    setTipo(value as string)
                }

                if (key === 'cep') {
                    setCep(value as string)
                }

                //@ts-ignore
                setValue(key, value)
            })

            setDataCep({ logradouro, bairro, localidade: municipio, uf })
        }
    }, [cliente])

    return (
        <main>
            <form onSubmit={handleSubmit(handleUpdateData)}>

                <SelectClientesCacambas onChangeCliente={setCliente} onChangeTipo={setCliente} active={true} />

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

                    <div className="flex flex-col gap-x-3 mt-3">
                        <label>{tipo || 'Documento'}</label>
                        <InputMask
                            mask={tipo === 'Cpf' ? '999.999.999-99' : '99.999.999/9999-99'}
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('documento')}
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
                                    className="border outline-none w-full h-8 rounded-md hover:bg-blue-100"
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
                            mask="(99) 999-999-999"
                            className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            {...register('celular')}
                        />
                    </div>

                    <div className="flex flex-col gap-x-3 mt-3">
                        <label>Fixo</label>
                        <InputMask
                            mask="(99) 9999-9999"
                            className="border outline-none h-8 rounded-md p-2 disabled:bg-cyan-50"
                            {...register('fixo')}
                        />
                    </div>



                </div>

                <div className='flex justify-center items-center mt-10'>
                    <button
                        className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                        type="submit"
                        onClick={() => {

                        }}
                    >atualizar</button>
                </div>

                <ToastContainer />

                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            </form>

        </main>
    )
}

export default ClientsAtualizar