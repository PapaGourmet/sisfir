import React from "react"
import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <main className=" flex">
            <div className="bg-slate-500 h-screen w-full items-center justify-center flex">
                <div className="block">
                    <h1 className="text-white text-3xl sm:text-5xl">Acesso não autorizado</h1>
                    <div className="text-yellow-300">
                        <Link to='/login'>retornar à tela de login</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}