import React, { useEffect, useRef, useState } from "react"
import InputMask from 'react-input-mask'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { uid as uid2 } from "uid"
import { toast, ToastContainer } from "react-toastify"
import { Rules } from "../cacambas/components/libs/rules"
import RegsiterZodSchema, { verifyValueDocs } from "./componentes/zods/zodschemaadmin"
import { concatenarLabels } from "./componentes/utils/util"
import User from "../../interfaces/users"
import { FirestoreServiceRegister } from "./componentes/ioc/register/firestoreserviceregister"
import StateManagedSelect from "react-select"
import Loading from "../../bundles/loading/loading"
import SubTitle from "../../bundles/subtitle"
import { ServiceRegister } from "./componentes/ioc/register/iserviceregister"
const firestoreservice = new FirestoreServiceRegister()
const serviceregister = new ServiceRegister(firestoreservice)

const Register: React.FC = () => {
    const [tipo, setTipo] = useState<string | null>("")
    const [documento, setDocumento] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, clearErrors, setValue, reset, errors } = RegsiterZodSchema()
    const animatedComponents = makeAnimated()
    const selectRef = useRef<any>(null)


    const notify = () => toast("Acesse a mensagem de confirmação em seu email",
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

    const handleTipo = (response: boolean) => {
        if (!!tipo) {
            if (!response) {
                switch (tipo) {
                    case 'Cpf':
                        setError('documento', {
                            type: 'manual',
                            message: 'Número de Cpf inválido'
                        })
                        break

                    case 'Cnpj':
                        setError('documento', {
                            type: 'manual',
                            message: 'Número de Cnpj inválido'
                        })
                        break

                    case 'Matricula':
                        setError('documento', {
                            type: 'manual',
                            message: 'Formato de matrícula inválido'
                        })
                        break

                    default:
                        break
                }
            } else {
                clearErrors('documento')
            }
        } else {
            setError('documento', {
                type: 'manual',
                message: 'Escolha um tipo'
            })
        }
    }

    const handleSaveData = async (data: any) => {

        const { regras, documento, email, senha, confirsenha, tipo, nome } = data

        if (senha !== confirsenha) {
            setError('senha', {
                type: 'manual',
                message: 'Confirmação de senha não confere'
            })

            setError('confirsenha', {
                type: 'manual',
                message: 'Confirmação de senha não confere'
            })

            return
        } else {
            clearErrors('senha')
            clearErrors('confirsenha')
        }

        const rules: any[] = []
        const lista = regras.split(',').map((regra: string) => regra.trim())


        const user: User = {
            id: uid2(10),
            email: email,
            rules: lista,
            matricula: documento,
            nome
        }

        setIsLoading(true)

        try {
            const response = await serviceregister.register_email(email, senha)

            try {
                await serviceregister.register_access(user, response)
                setIsLoading(false)
                reset()
                setValue('documento', '')
                selectRef.current.clearValue()
                notify()

            } catch (err) {
                console.log(err)
            }

        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }

    }

    useEffect(() => {
        const response = verifyValueDocs(tipo || "", documento)
        handleTipo(response)
    }, [tipo, documento])

    return (
        <main>
            <SubTitle title="CADASTRAR USUÁRIO" />
            <form onSubmit={handleSubmit(handleSaveData)}>

                <div className="grid grid-col-1 gap-x-6 mx-4">
                    <div className="flex flex-col mt-3 ">
                        <label>Regras</label>
                        <Select
                            ref={selectRef}
                            isMulti
                            options={Rules}
                            isClearable
                            isSearchable
                            isDisabled={false}
                            isLoading={false}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            placeholder={"selecione ..."}

                            onChange={(item) => {
                                setValue('regras', concatenarLabels(item))
                            }}

                        />

                        {errors.regras && <span className="alerta">{errors.regras.message === 'Required' ? 'O campo regras é obrigatório' : errors.regras.message}</span>}
                    </div>


                    <div className="flex flex-col mt-3">
                        <label>Nome</label>
                        <input
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('nome')}
                        >
                        </input>
                        {errors.nome && <span className="alerta">{errors.nome.message}</span>}
                    </div>


                    <div className="flex flex-col mt-3 ">
                        <label>Tipo</label>
                        <select
                            className="border outline-none h-8 rounded-md text-sm"
                            {...register('tipo')}
                            onChange={(item: React.ChangeEvent<HTMLSelectElement>) => {
                                const value = String(item.target.value)
                                setTipo(value)
                                setValue('documento', '')
                            }}
                        >
                            <option></option>
                            <option value={"Cnpj"}>Cnpj</option>
                            <option value={"Cpf"}>Cpf</option>
                            <option value={"Matricula"}>Matrícula</option>
                        </select>
                        {errors.tipo && <span className="alerta">{errors.tipo.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>{tipo || 'Documento'}</label>
                        <InputMask
                            mask={tipo === 'Cpf' ? '999.999.999-99' : tipo === 'Cnpj' ? '99.999.999/9999-99' : '999999'}
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('documento')}
                            onChange={(value) => {
                                const doc = value.target.value.replaceAll('_', "")
                                setDocumento(doc)

                            }}
                        />
                        {errors.documento && <span className="alerta">{errors.documento.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Email</label>
                        <input
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('email')}
                        >
                        </input>
                        {errors.email && <span className="alerta">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Senha</label>
                        <input
                            type="password"
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('senha')}
                        >
                        </input>
                        {errors.senha && <span className="alerta">{errors.senha.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Confirmação de senha</label>
                        <input
                            type="password"
                            className="border outline-none h-8 rounded-md p-2"
                            {...register('confirsenha')}
                        >
                        </input>
                        {errors.confirsenha && <span className="alerta">{errors.confirsenha.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3 ">
                        <div className='flex justify-center items-center mt-10'>
                            <button
                                className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                                type="submit"
                            >salvar</button>
                        </div>
                    </div>

                </div>


                <ToastContainer />


                {/* input fantasma */}
                <div className="flex flex-col mt-3">
                    <label className="text-white">Tipo</label>
                    <input
                        className="outline-none h-10 rounded-md p-2 disabled:bg-white text-white"
                        disabled
                        {...register('regras')}
                    ></input>
                </div>

            </form>

            {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

        </main>
    )
}

export default Register