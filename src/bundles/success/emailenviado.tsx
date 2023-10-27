import { Link, useRouteError } from "react-router-dom";

export default function Send() {
    const error: any = useRouteError();

    return (
        <main className=" flex">
            <div className="bg-slate-500 h-screen w-full items-center justify-center flex">
                <div className="flex flex-col mx-8">
                    <h1 className="text-white text-sm sm:text-lg">Link de recastramento criado</h1>
                    <h1 className="text-white text-sm sm:text-lg">Vá para caixa de entrada do seu e-mail</h1>
                    <div className="text-yellow-300">
                        <Link to='/login'>retornar à tela inicial</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}