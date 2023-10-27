import React, { useState } from "react"
import Loading from "../../../../../bundles/loading/loading"
import { FirebaseClienteDatabase } from "../../ioc/clientes/clienteDatabase"
import { ClienteManager } from "../../ioc/clientes/iclientesrepository"
import { FormDataEnvio } from "../../../../../types/types"
import Modal from "react-modal"
import { toast, ToastContainer } from "react-toastify"
import SelectClientesCacambas from "../../components/selectclientes"
import SubTitle from "../../../../../bundles/subtitle"
const clienteDatabase = new FirebaseClienteDatabase()
const clienteManager = new ClienteManager(clienteDatabase)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}


const ClienteRemover: React.FC = () => {
    const [cliente, setCliente] = useState<FormDataEnvio>(initCliente)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const notify = () => toast("Sucesso",
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

    const handleDeleteCliente = (data: any) => {
        setIsModalOpen(true)
    }

    const handleConfirmClick = async (data: any) => {
        setIsModalOpen(false)
        setIsLoading(true)

        try {
            await clienteManager.inativarCliente(cliente.id || "")
            setTimeout(() => {
                setIsLoading(false)
            }, 200)

            notify()
        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }
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
                            <span className="text-white">Confirma a inativação do cliente?</span>
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

                <SelectClientesCacambas onChangeCliente={setCliente} onChangeTipo={setCliente} active={true} />
                {!!cliente.id?.length === false && <span className="alerta">Escolha de cliente obrigatória</span>}

                {!!cliente.id?.length === true && (
                    <div className='flex justify-center items-center mt-10'>
                        <button
                            className='w-20 h-20 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                            type="button"
                            onClick={handleDeleteCliente}
                        >remover</button>
                    </div>
                )}

                <ToastContainer />

                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            </form>

        </main>
    )
}

export default ClienteRemover