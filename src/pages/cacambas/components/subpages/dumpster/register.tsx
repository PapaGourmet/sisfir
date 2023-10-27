import React, { useState } from "react"
import Loading from "../../../../../bundles/loading/loading"
import { FormDataEnvio } from "../../../../../types/types"
import DumpsterZodSchema from "../../zods/zodschemadumpster"
import { uid as uid2 } from "uid"
import { ApplyCacambaService, IDumpster } from "../../ioc/cacambas/icacambasservice"
import { ServiceFirestoreCacambas } from "../../ioc/cacambas/servicefirestorecacamba"
import { ToastContainer, toast } from "react-toastify"
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

const data = { logradouro: "", bairro: "", localidade: "", uf: "" }

const RegisterDumpster: React.FC = () => {
    const { register, handleSubmit, reset, setValue, setError, errors } = DumpsterZodSchema()
    const [uid, setUid] = useState(localStorage.getItem('uid') || "")
    const [isLoading, setIsLoading] = useState(false)

    const notify = (message: string) => toast(message,
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

    const handleSaveData = async (data: any): Promise<void> => {
        const { numero } = data

        const dumpster: IDumpster = {
            id: uid2(10),
            numeroSerie: numero,
            status: true,
            uid: uid
        }

        setIsLoading(true)

        try {

            const response = await cacambasservice.getDumpsterByRegister(numero.toString().padStart(5, '0'), uid)
            if (response) {
                setIsLoading(false)
                setError("numero", {
                    type: "manual",
                    message: "Número de série ja existe no cadastro"
                })

                return
            }

            await cacambasservice.addDumpster(dumpster)
            reset()
            setValue('numero', "")
            setIsLoading(false)
            notify("Sucesso")

        } catch (err) {
            console.log(err)
            setIsLoading(false)
        }

    }

    return (
        <main>
            <form onSubmit={handleSubmit(handleSaveData)}>

                <div className="grid grid-col-1">

                    <div className="flex flex-col mt-3 ">
                        <label>Número de série</label>
                        <input
                            type="text"
                            className="border outline-none h-8 rounded-md text-sm p-2"
                            {...register('numero')}
                        />
                        {errors.numero && <span className="alerta">{errors.numero.message}</span>}
                    </div>
                </div>

                <div className='flex justify-center items-center mt-10'>
                    <button
                        className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                        type="submit"
                    >salvar</button>
                </div>

                <ToastContainer />

                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            </form>

        </main>
    )
}

export default RegisterDumpster