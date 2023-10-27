import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../../assets/logo.png'
import { FadeIn } from 'react-slide-fade-in'

export default function Burger(props: any) {

    const [showNao, setShowNao] = useState(false);
    const navigate = useNavigate()

    return (
        <main >
            <div className="flex flex-col gap-2 w-full text-center p-2">
                <div className="flex flex-col items-center justify-center">
                    <img src={logo} className='w-1/3 mt-6 mb-2'></img>
                    <h1 className="text-xs sm:text-xl ml-2">{props.user}</h1>
                    <h1 className="text-xs sm:text-xl ml-2">{props.rules.replace(',', ', ')}</h1>
                </div>
            </div>

            <div className="flex flex-col mt-6 ml-4">
                <button
                    className="w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                        setShowNao(true);
                    }}
                >NAO &darr;</button>

                {showNao &&

                    <FadeIn
                        from="top"
                        positionOffset={0}
                        triggerOffset={0}
                        delayInMilliseconds={100}
                        durationInMilliseconds={1000}
                    >
                        <ul className="mt-2 ml-1">
                            <li className="text-left flex-none">
                                <Link to='ordem/criar' onClick={() => { }}>Gerar OS</Link>
                            </li>
                            <li className="text-left flex-none">Gerenciar OS</li>
                            <li className="text-left flex-none">Gerenciar Itens</li>
                            <li className="text-left flex-none">Gerenciar Contatos</li>
                        </ul>
                    </FadeIn>}

            </div>

            <div className="flex flex-col mt-2 ml-4">
                <button
                    className="border-none w-2/3 h-9 bg-sky-900  hover:bg-sky-700 text-white text-left pl-1 rounded-md"
                    onClick={() => {
                        setShowNao(false);
                    }}
                >Outro &darr;</button>
            </div>







        </main>



    )
}