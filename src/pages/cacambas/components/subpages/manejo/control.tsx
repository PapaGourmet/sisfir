import React, { useRef, useState } from "react"
import Loading from "../../../../../bundles/loading/loading"
import { FormDataEnvio } from "../../../../../types/types"
import Modal from "react-modal"
import { ServiceFirestoreCacambas } from "../../ioc/cacambas/servicefirestorecacamba"
import { ApplyCacambaService } from "../../ioc/cacambas/icacambasservice"
import TableManejo from "../../components/tablemanejo"
import { toast, ToastContainer } from "react-toastify"
import { getLocalTimeInSaoPauloMilliseconds } from "../../../../maps/utils/utils"
const firebaseservice = new ServiceFirestoreCacambas()
const service = new ApplyCacambaService(firebaseservice)

const ControlDumpster: React.FC = () => {

    const [isModalOpenDepositar, setIsModalOpenDepositar] = useState(false)
    const [isModalOpenRemover, setIsModalOpenRemover] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState("")
    const [numero, setNumero] = useState("")

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


    const handleConfirmClickDepositar = async (data: any) => {
        setIsModalOpenDepositar(false)
        setIsLoading(true)

        try {

            await service.updateCacamba(id, numero, 0, true, getLocalTimeInSaoPauloMilliseconds())
            setTimeout(() => {
                setIsLoading(false)
            }, 400)
            notify("Sucesso")
        } catch (err) {

        }
    }

    const handleCancelClickDepositar = () => {
        setIsModalOpenDepositar(false)
    }

    const handleConfirmClickRemover = async (data: any) => {
        setIsModalOpenRemover(false)

        setIsLoading(true)
        try {
            const tempo = getLocalTimeInSaoPauloMilliseconds()
            await service.updateCacamba(id, numero, tempo, false)
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
            notify("Sucesso")
        } catch (err) {
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
            console.log(err)
        }
    }

    const handleCancelClickRemover = () => {
        setIsModalOpenRemover(false)
    }

    return (
        <main>
            <h3 className='w-full text-center bg-blue-300 p-2  text-white font-bold mb-4 rounded-md'>LISTA DE CAÇAMBAS PARA MANEJO</h3>
            <div>
                <Modal
                    isOpen={isModalOpenDepositar}
                    ariaHideApp={false}
                    className="flex w-full h-screen items-center justify-center bg-slate-500"
                >

                    <div className="flex flex-col">
                        <div className="flex items-center justify-center">
                            <span className="text-white">Confirma a colocação da caçamba?</span>
                        </div>

                        <div className="grid grid-cols-12 mt-6">
                            <div className="col-span-5">
                                <button
                                    type="button"
                                    className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                    style={{
                                        width: "6rem"
                                    }}
                                    onClick={handleConfirmClickDepositar}
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
                                    onClick={handleCancelClickDepositar}
                                >não</button>
                            </div>
                        </div>
                    </div>

                </Modal>

                <Modal
                    isOpen={isModalOpenRemover}
                    ariaHideApp={false}
                    className="flex w-full h-screen items-center justify-center bg-slate-500"
                >

                    <div className="flex flex-col">
                        <div className="flex items-center justify-center">
                            <span className="text-white">Confirma a retirada da caçamba?</span>
                        </div>

                        <div className="grid grid-cols-12 mt-6">
                            <div className="col-span-5">
                                <button
                                    type="button"
                                    className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                    style={{
                                        width: "6rem"
                                    }}
                                    onClick={handleConfirmClickRemover}
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
                                    onClick={handleCancelClickRemover}
                                >não</button>
                            </div>
                        </div>
                    </div>

                </Modal>

                <TableManejo
                    setId={setId}
                    setNumero={setNumero}
                    numero={numero}
                    setIsModalOpenDepositar={setIsModalOpenDepositar}
                    setIsModalOpenRemover={setIsModalOpenRemover}
                />
            </div>
            <ToastContainer />

            {isLoading && <div className='flex justify-center items-center'><Loading /></div>}
        </main>
    )
}

export default ControlDumpster