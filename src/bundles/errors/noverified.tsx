import React from "react"
import { Link } from "react-router-dom";

export default function Noverified() {
    return (
        <main className=" flex">
            <div className="bg-slate-500 h-screen w-full items-center justify-center flex">
                <div className="flex flex-col gap-4">
                    <h1 className="text-white text-3xl sm:text-5xl">Email ainda não verificado</h1>
                    <p className="text-blue-300">Verifique sua caixa de email</p>
                    <div className="text-yellow-300">
                        <Link to='/login'>retornar à tela de login</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}