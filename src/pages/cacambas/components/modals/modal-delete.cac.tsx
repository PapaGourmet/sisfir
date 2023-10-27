import React, { useState } from "react"
import Modal from "react-modal"
import { ServiceFirestoreCacambas } from "../ioc/cacambas/servicefirestorecacamba"
import { ApplyCacambaService } from "../ioc/cacambas/icacambasservice"
import { toast, ToastContainer } from "react-toastify"
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)

interface ModalDeleteCacambaProps {
    HandleOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
    id: string
}


const ModalDeleteCacamba: React.FC<ModalDeleteCacambaProps> = (
    {
        HandleOpenModal,
        isOpen,
        id
    }
) => {

    const notify = () => toast("Caçamba removida com sucesso!",
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
    )


    const handleConfirm = () => {
        HandleOpenModal(false)
        cacambasservice.removeCacamba(id)
    }

    const handleCancel = () => {
        HandleOpenModal(false)
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <div className="flex flex-col">
                    <p className="text-center text-white">Tem certeza que deseja deletar este item?</p>
                    <div className="grid grid-cols-12 mt-6">
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleConfirm}>Sim</button>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleCancel}
                            >Cancelar</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </>



    )
}

export default ModalDeleteCacamba