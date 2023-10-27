import React, { useRef, useState } from "react"
import Loading from "../../../../../bundles/loading/loading"
import { FormDataEnvio } from "../../../../../types/types"
import Modal from "react-modal"
import SelectDumpsterDelete from "../../components/selectdumpsterDelete"
import { ServiceFirestoreCacambas } from "../../ioc/cacambas/servicefirestorecacamba"
import { ApplyCacambaService } from "../../ioc/cacambas/icacambasservice"
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)

const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

const data = { logradouro: "", bairro: "", localidade: "", uf: "" }

const DumpsterReative: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [serie, setSerie] = useState("")
    const uid = useRef(localStorage.getItem('uid') || "")


    const handleConfirmClick = async (data: any) => {
        cacambasservice.removeDumpster(serie, true)
        setIsModalOpen(false)
    }

    const handleCancelClick = () => {
        setIsModalOpen(false)
    }

    return (
        <main>
            <form>

                <Modal
                    isOpen={isModalOpen}
                    ariaHideApp={false}
                    className="flex w-full h-screen items-center justify-center bg-slate-500"
                >

                    <div className="flex flex-col">
                        <div className="flex items-center justify-center">
                            <span className="text-white">Confirma a reativação da caçamba?</span>
                        </div>

                        <div className="grid grid-cols-12 mt-6">
                            <div className="col-span-5">
                                <button
                                    type="button"
                                    className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                    style={{
                                        width: "6rem"
                                    }}
                                    onClick={handleConfirmClick}
                                >sim</button>
                            </div>
                            <div className="col-span-2"></div>
                            <div className="col-span-5">
                                <button
                                    type="button"
                                    className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                                    style={{
                                        width: "6rem"
                                    }}
                                    onClick={handleCancelClick}
                                >não</button>
                            </div>
                        </div>
                    </div>


                </Modal>

                <SelectDumpsterDelete uid={uid.current} setSerie={setSerie} status={false} />

                {!!serie === true && (
                    <div className='flex justify-center items-center mt-10'>
                        <button
                            className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                        >reativar</button>
                    </div>
                )}


                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            </form>

        </main>
    )
}

export default DumpsterReative