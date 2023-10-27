import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { initializeApp } from "firebase/app"
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import firebaseConfig from '../../util/firebase-config'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import * as CryptoJS from 'crypto-js'
const SECRET = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY as string

const loginUserFormSchema = z.object({
    email: z.string()
        .nonempty('O e-mail é obrigatório')
        .email('Formato de e-mail inválido'),
    pass: z.string()
        .nonempty('A senha é obrigatória'),
})

type LoginUserFormSchema = z.infer<typeof loginUserFormSchema>

export default function Login() {
    initializeApp(firebaseConfig)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginUserFormSchema>({
        resolver: zodResolver(loginUserFormSchema)
    })


    const [showPass, setShowPass] = useState('password')

    let password

    if (localStorage.getItem('pass')) {
        password = CryptoJS.AES.decrypt(localStorage.getItem('pass')!, SECRET).toString(CryptoJS.enc.Utf8)
    }


    const [pass, setPass] = useState<any>(password)
    const [email, setEmail] = useState<any>(localStorage.getItem('email'))
    const [isFail, setIsFail] = useState(false)
    const [isVeriified, setIsVerified] = useState(true)
    const [errorMessage, setErrorMessage] = useState<any>()
    const navigate = useNavigate()


    const Access = (): void => {

        setErrorMessage(null)

        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {

                const user = userCredential.user
                const encryptedMessage = CryptoJS.AES.encrypt(pass, SECRET).toString()
                localStorage.setItem('email', user.email!)
                localStorage.setItem('uid', user.uid)
                localStorage.setItem('pass', encryptedMessage)

                if (!user.emailVerified) {
                    navigate('/noverified')
                    return
                }

                navigate('/home')

            })
            .catch((error) => {
                setIsFail(true)
                const e = error.message
                console.log(e)
                setErrorMessage('Login ou senha inválidos')
            })
    }


    const onChangeEmail = (value: string) => {
        setEmail(value)
    }

    const onchangePass = (value: string) => {
        setPass(value)
    }


    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 bg-cyan-50">
            <div className="bg-sky-800 h-40 sm:h-screen w-full items-center justify-center flex">
                <div className="h-screen w-full items-center justify-center flex">
                    <div className="block">
                        <h1 className="text-white text-center text-xl mt-6 sm:mt-auto sm:text-5xl">Seja Bem Vindo</h1>
                        <p className="text-white text-center text-xl sm:mt-4 sm:text-5xl">ao</p>
                        <p className="font-bold text-white text-center text-xl sm:mt-4 sm:text-5xl ">SINFIR</p>
                    </div>
                </div>
            </div>
            <div className="h-2/5 md:h-screen w-full items-center justify-center flex">
                <div className="h-screen w-full items-center justify-center flex p-8">


                    <form
                        className="bg-gray-600 flex flex-col px-3 h-2/7 p-4 rounded-3xl mt-28 sm:mt-0"
                        onSubmit={handleSubmit(Access)}
                    >

                        <div className="flex flex-col px-1 mt-4">
                            <label htmlFor="email" className="text-white text-xl">Email</label>
                            <input
                                id="email"
                                autoComplete='on'
                                type="email"
                                className="w-full mt-2 h-8 outline-none p-2 text-2xl sm:text-lg"
                                aria-describedby="informações de email"
                                value={email}
                                {...register('email')}
                                onChange={(event) => {
                                    onChangeEmail(event.target.value)
                                }}
                            ></input>
                            {errors.email && <span className="text-red-400">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col px-1 mt-3">
                            <label htmlFor="pass" className="text-white text-xl">Senha</label>
                            <div className="flex">
                                <input
                                    type={showPass}
                                    autoComplete='on'
                                    className="w-full mt-2 h-8 outline-none p-2 text-2xl sm:text-lg"
                                    id="pass"
                                    {...register('pass')}
                                    value={pass}
                                    onChange={(event) => {
                                        onchangePass(event.target.value)
                                    }}
                                ></input>
                                {showPass === 'password' && <FontAwesomeIcon className="bg-white h-8 mt-2  hover:text-red-200 text-amber-300" icon={faEye} size={'xl'} onClick={() => {
                                    showPass === 'password' ? setShowPass('text') : setShowPass('password')
                                }} />}

                                {showPass === 'text' && <FontAwesomeIcon className="bg-white h-8 mt-2  hover:text-red-200  text-amber-300" color="white" icon={faEyeSlash} size={'xl'} onClick={() => {
                                    showPass === 'text' ? setShowPass('password') : setShowPass('text')
                                }} />}

                            </div>

                            <div className="flex flex-col">
                                {errors.pass && <span className="text-red-400">{errors.pass.message}</span>}
                                {errorMessage && <span className="text-red-400">{errorMessage}</span>}
                            </div>

                        </div>

                        <div className="flex flex-col mt-4 items-center justify-center">
                            <button
                                type="submit"
                                className="bg-emerald-700 w-20 h-20 rounded-full hover:bg-emerald-600  text-white"
                            >Entrar</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <p
                                className="text-blue-100 hover:text-red-600"
                                onClick={() => {
                                    navigate('/senha/recuperar')
                                }}

                            >Esqueci a senha</p>
                            <p
                                className="text-blue-100 hover:text-red-600"
                                onClick={() => {
                                    localStorage.removeItem('pass')
                                    localStorage.removeItem('email')
                                    window.location.reload()
                                }}
                            >Limpar credenciais</p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}