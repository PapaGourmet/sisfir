import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where, } from "firebase/firestore"
import Loading from '../../../../bundles/loading/loading'
import { useRef, useState } from 'react'
import { calcularDiferencaHoras } from '../util/actions'
import dbDatabaseFirestoreNao from '../util/firestoreconfig'
import { ServiceFirestoreCacambas } from '../ioc/cacambas/servicefirestorecacamba'
import { ApplyCacambaService } from '../ioc/cacambas/icacambasservice'
import { toast, ToastContainer } from 'react-toastify'
import { getLocalTimeInSaoPauloMilliseconds } from '../../../maps/utils/utils'


interface SelectProps {
    setId: React.Dispatch<React.SetStateAction<string>>,
    setNumero: React.Dispatch<React.SetStateAction<string>>,
    setIsModalOpenDepositar: React.Dispatch<React.SetStateAction<boolean>>,
    setIsModalOpenRemover: React.Dispatch<React.SetStateAction<boolean>>
    numero: string
}

const TableManejo: React.FC<SelectProps> = ({
    setId,
    setNumero,
    setIsModalOpenDepositar,
    setIsModalOpenRemover,
    numero
}) => {
    const uid = useRef(localStorage.getItem('uid') || "")

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


    const q = query(
        collection(dbDatabaseFirestoreNao, "cacambas-cacambas"),
        where("uid", "==", uid.current)
    );

    const [value, loading, error] = useCollection(q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const Q = query(
        collection(dbDatabaseFirestoreNao, "cacambas-dumpster"),
        where("uid", "==", uid.current)
    );

    const [valueD, loadingD, errorD] = useCollection(Q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const HandleChangeCor = (tempo: number): string => {
        const response = `${'#' + calcularDiferencaHoras(tempo)}`
        return response
    }

    const handleUpdateDate = async (id: string): Promise<void> => {
        if (!numero) {
            notify('Selecione um número de série')
            return
        }

        setId(id)
        setIsModalOpenDepositar(true)



    }

    const handleCloseService = async (id: string, serie: string): Promise<void> => {
        setId(id)
        setNumero(serie)
        setIsModalOpenRemover(true)
    }

    return (
        <form className='w-full'>
            {error && errorD && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && loadingD && <div className='flex justify-center items-center'><Loading /></div>}
            {value && valueD && (
                <>
                    <ul key={1364} className=''>

                        {value.docs
                            .filter(doc => doc.data().status)
                            .filter(doc => doc.data().uid === localStorage.getItem("uid"))
                            .sort((a: any, b: any) => a.data().data - b.data().data)
                            .map((doc: any, i: number) => (
                                <div key={doc.id + '1944'} className='flex flex-col border rounded-lg p-3 mt-2'>

                                    <label key={doc.id + '1945'}>Cliente</label>
                                    <li key={doc.id + doc.data().nome} className='border p-2 rounded-lg truncate'>
                                        <span style={{ color: HandleChangeCor(doc.data().data) }} key={doc.id + 1947}>{doc.data().nome}</span>
                                    </li>

                                    <label className='mt-2' key={doc.id + '1946'} >Local</label>
                                    <li key={doc.id + doc.data().local} className='border p-2 rounded-lg truncate'>
                                        <span key={doc.id + 1948}>{doc.data().local}</span>
                                    </li>

                                    <label className='mt-2' key={doc.id + '1951'} >Número de série</label>
                                    <li key={doc.id + doc.data().local + 1955} className='flex flex-col rounded-lg truncate'>
                                        {
                                            !doc.data().numero && (
                                                <>
                                                    <select
                                                        className='border h-10 rounded-lg w-full p-1'
                                                        onChange={(item) => {
                                                            const { value } = item.target
                                                            setNumero(value)
                                                        }}
                                                    >
                                                        <option></option>
                                                        {valueD.docs
                                                            .filter(doc => doc.data().status)
                                                            .filter(doc => !value.docs.some((element) => element.data().numero === doc.data().numeroSerie && element.data().status))
                                                            .map((doc, i) => (
                                                                <option key={doc.id + i} value={doc.data().numeroSerie}>{doc.data().numeroSerie}</option>
                                                            ))}
                                                    </select>
                                                </>
                                            )
                                        }

                                        {!!doc.data().numero && (
                                            <input
                                                className='border h-10 rounded-lg p-2'
                                                value={doc.data().numero}
                                                disabled
                                                onChange={() => { }}
                                            ></input>

                                        )}

                                    </li>

                                    <li key={doc.id + doc.data().local + 1949} className='p-2 truncate'>
                                        <div className='flex flex-col'>
                                            {!doc.data().numero && <span className='text-red-800 hover:text-red-300'>
                                                <div className='flex items-center justify-center p-2'>
                                                    <button
                                                        className='text-blue-400 hover:text-blue-100 focus:outline-none active:outline-none'
                                                        type='button'
                                                        onClick={() => {
                                                            handleUpdateDate(doc.id)
                                                        }}
                                                    >depositar</button>
                                                </div>
                                            </span>}

                                            {!!doc.data().numero && <span className=' text-red-800 hover:text-red-300'>
                                                <div className='flex items-center justify-center p-2'>
                                                    <button
                                                        className='text-red-400 hover:text-blue-100 focus:outline-none active:outline-none'
                                                        type='button'
                                                        onClick={() => {
                                                            handleCloseService(doc.id, doc.data().numero)
                                                        }}
                                                    >remover</button>
                                                </div>
                                            </span>}
                                        </div>
                                    </li>

                                </div>
                            ))}
                    </ul>
                </>
            )}

            <ToastContainer />

        </form>
    )
}

export default TableManejo