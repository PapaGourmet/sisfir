import React, { useEffect, useState } from "react"
import Menu from "./components/components/menu"
import { Outlet, useNavigate } from "react-router-dom"
import { useUrl } from "../../bundles/hooks/useUrl"


const MainCacambas: React.FC = () => {
    const [url] = useUrl()
    const [title, setTitle] = useState<string | null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            if (url === 'http://127.0.0.1:5173/cacambas/') {
                setTitle('GERENCIAMENTO DE CAÇAMBAS')
            }
        } else if (process.env.NODE_ENV === 'production') {

            if (url === 'https://fcz-nao.web.app/cacambas/') {
                setTitle('GERENCIAMENTO DE CAÇAMBAS')
            }
        }
    }, [url])

    const navigate = useNavigate()

    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 border h-8">
                <div className="flex  text-white font-bold p-1">
                    <span className="text-center">{title || localStorage.getItem('menu') || ""}</span>
                </div>
            </div>
            <div className="flex bg-blue-950 border">
                <Menu setTitle={setTitle} />
            </div>

            <div className="p-4">
                <Outlet />
            </div>
        </main>
    )
}

export default MainCacambas