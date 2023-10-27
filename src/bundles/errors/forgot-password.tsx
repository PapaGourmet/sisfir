
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { initializeApp } from "firebase/app"
import { useNavigate } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import firebaseConfig from '../../util/firebase-config'
import Loading from '../loading/loading'


const schema = z.object({
    email: z.string().email('O campo email é obrigatório')
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'all'
    })

    const onSubmit = (data: any) => {
        send(data.email)
    };

    const navigate = useNavigate();

    const send = (email: string): void => {
        setIsLoading(true)

        const app = initializeApp(firebaseConfig);
        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                navigate('/senha/enviada')
                setIsLoading(true)
            })
            .catch((error) => {
                const { code, message } = error
                console.log(message)
                setIsLoading(true)
            })

    }

    return (
        <main className="flex flex-col">
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>RECUPERAR ACESSO</h1>
            </div>

            <div className='flex flex-col items-center justify-center bg-slate-500 h-screen'>
                <form
                    className='flex flex-col bg-cyan-200 h-1/3 w-3/4 md:w-1/3 gap-2 p-4 rounded-2xl shadow-2xl shadow-blue-600'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='flex flex-col '>
                        <label htmlFor="nome">Email</label>
                        <input
                            className='p-2 rounded-lg h-10 outline-none'
                            type={"email"}
                            id="nome"
                            {...register('email')}
                        />
                        {errors.email && <span className='text-red-600 mt-1'>{errors.email.message}</span>}
                    </div>


                    <div className='flex items-center justify-center'>
                        <button
                            className='rounded-full bg-emerald-700 w-20 h-20 hover:bg-emerald-600 mt-5'
                            type="submit"
                        >Enviar</button>
                    </div>
                </form>

                <div className='flex items-center justify-center'>
                    {isLoading && <Loading />}
                </div>

            </div>

        </main >
    );
}