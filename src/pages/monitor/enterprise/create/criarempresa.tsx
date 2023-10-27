import React, { useState } from "react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import IDataEnterprise from "../../../../interfaces/idataenterprise"
import { InsertEmpresa } from "../../../../services/servicesApi"
import Loading from "../../../../bundles/loading/loading"
const tiposDeEmpresa = ['Extraordinário', 'Biológico', 'Reciclagem']


const empresaFormSchema = z.object({
    tipo: z.string()
        .nonempty('O tipo de coleta é obrigatório'),
    nome: z.string()
        .nonempty('O nome da empresa é obrigatório')
        .transform(nome => nome.toUpperCase()),
    obs: z.string().optional()
});

type EmpresaFormSchema = z.infer<typeof empresaFormSchema>

export default function MonitorCreate() {
    const [cadastro, setCadastro] = useState<IDataEnterprise>({ tipo: "", nome: "" })
    const [tipo, setTipo] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<EmpresaFormSchema>({
        resolver: zodResolver(empresaFormSchema)
    })

    function salvar(data: any) {
        const { tipo, nome, obs } = data;

        const value: IDataEnterprise = {
            tipo: tiposDeEmpresa[tipo],
            nome,
            obs,
            acessos: []
        }

        setIsLoading(true);

        InsertEmpresa(value)
            .then(data => {
                setIsLoading(false)
                window.location.reload()
            })
            .catch(err => {
                setIsLoading(false)
            });
    }


    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>SALVAR EMPRESA</h1>
            </div>
            <form
                className=""
                onSubmit={handleSubmit(salvar)}
            >
                <div className="grid grid-cols-1 mx-8">
                    <label className="mt-3">Tipo</label>
                    <select className="border p-1 rounded-md outline-none" id="exampleFormControlSelect1"
                        {...register('tipo')}
                    >
                        <option key={1000}></option>
                        {tiposDeEmpresa.map((x, i) => (
                            <option value={i}>{x}</option>
                        ))}
                    </select>
                    {errors.tipo && <span className="text-red-400">{errors.tipo.message}</span>}


                    <label className="mt-3" htmlFor="empresa">Nome da Empresa</label>
                    <input
                        id="empresa"
                        className="border outline-none w-full h-8 p-3"
                        {...register('nome')}
                    ></input>
                    {errors.nome && <span className="text-red-400">{errors.nome.message}</span>}

                    <label htmlFor="obs" className="mt-3">Observações</label>
                    <textarea
                        className="border p-3"
                        id="obs"
                        rows={3}
                        {...register('obs')}
                    ></textarea>

                    <div className="flex mt-4 items-center justify-center">
                        <button
                            type="submit"
                            className="bg-emerald-700 w-20 h-20 rounded-full hover:bg-emerald-600  text-white"
                        >salvar</button>
                    </div>

                </div>

                {isLoading && <div className="flex items-center justify-center">
                    <Loading />
                </div>}
            </form>
        </main>


    )
}

