import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error: any = useRouteError();

    return (
        <main className=" flex">
            <div className="bg-slate-500 h-screen w-full items-center justify-center flex">
                <div className="block">
                    <h1 className="text-white text-3xl sm:text-5xl">Página não encontrada</h1>
                    <div className="text-yellow-300">
                        <Link to='/'>retornar à tela inicial</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}