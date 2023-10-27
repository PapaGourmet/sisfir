import { useCollection } from 'react-firebase-hooks/firestore'
import { getFirestore, collection, query, where, } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import firebaseNAOConfig from '../../../../util/firebase-nao-config'
import Loading from '../../../../bundles/loading/loading'
import { FormDataEnvio } from '../../../../types/types'
import { useEffect, useRef } from 'react'
import { FirebaseClienteDatabase } from '../ioc/clientes/clienteDatabase'
import { ClienteManager } from '../ioc/clientes/iclientesrepository'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICacambaProps } from '../ioc/cacambas/icacambasservice'
import { calcularDiferencaHoras } from '../util/actions'
import { uid } from 'uid'
import dbDatabaseFirestoreNao from '../util/firestoreconfig'
import { toast, ToastContainer } from 'react-toastify'
const app = initializeApp(firebaseNAOConfig, "cacs")
const db = getFirestore(app)
const clienteDatabase = new FirebaseClienteDatabase()
const clienteManager = new ClienteManager(clienteDatabase)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

interface SelectProps {
    onChangeCacambas: React.Dispatch<React.SetStateAction<ICacambaProps[]>>
    HandleOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    HandleIdCacamba: React.Dispatch<React.SetStateAction<string>>
    HandleChangeCenter: React.Dispatch<React.SetStateAction<{
        lat: number;
        lng: number;
    }>>
    mapRef: React.MutableRefObject<google.maps.Map | undefined>
}

const TableCacambas: React.FC<SelectProps> = ({
    onChangeCacambas,
    HandleOpenModal,
    HandleIdCacamba,
    HandleChangeCenter,
    mapRef
}) => {
    const uid = useRef(localStorage.getItem('uid') || "")

    const q = query(
        collection(dbDatabaseFirestoreNao, "cacambas-cacambas"),
        where("uid", "==", uid.current)
    );

    const [value, loading, error] = useCollection(q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )


    useEffect(() => {
        if (value) {
            const response: ICacambaProps[] = []
            onChangeCacambas([])

            for (let c of value.docs) {
                const { cor, data, documento, id, lat, lng, local, nome, numero, status, uid } = c.data()
                onChangeCacambas(pre => [...pre, { cor, data, documento, id, lat, lng, local, nome, numero, status, uid }])
            }
        }
    }, [value])

    const HandleChangeCor = (tempo: number): string => {
        const response = `${'#' + calcularDiferencaHoras(tempo)}`
        return response
    }

    return (
        <div className='w-full'>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <div className='flex justify-center items-center'><Loading /></div>}
            {value && (
                <>
                    <label>Caçambas</label>

                    <ul>
                        <li key={1245} className='border p-2 font-bold'>
                            <div className='grid grid-cols-12'>
                                <div className='col-span-9 mx-3'>
                                    <span>cliente</span>
                                </div>
                                <div className='col-span-1'></div>
                                <div className='col-span-2 text-center'>
                                    <span>ação</span>
                                </div>
                            </div>
                        </li>
                        {value.docs
                            .filter(doc => doc.data().status)
                            .filter(doc => doc.data().uid === localStorage.getItem("uid"))
                            .sort((a: any, b: any) => a.data().data - b.data().data)
                            .map((doc: any, i: number) => (
                                <li key={doc.id} className='border p-2'>
                                    <div className='grid grid-cols-12'>
                                        <div className='col-span-9 mx-3 truncate'>

                                            <span style={{ color: HandleChangeCor(doc.data().data) }}>{doc.data().nome}</span>
                                        </div>
                                        <div className='col-span-1'></div>
                                        <div className='col-span-2 text-center'>
                                            <div className='grid grid-cols-12'>
                                                <span className='col-span-6 text-red-800 hover:text-red-300'>
                                                    <div className='flex items-center justify-center p-2'>
                                                        <FontAwesomeIcon
                                                            className='text-red-400 hover:text-red-100'
                                                            icon={faTrash}
                                                            size={'sm'}
                                                            onClick={() => {
                                                                HandleOpenModal(true)
                                                                HandleIdCacamba(doc.id)
                                                            }}
                                                        />
                                                    </div>
                                                </span>

                                                <span className='col-span-6 text-red-800 hover:text-red-300'>
                                                    <div className='flex items-center justify-center p-2'>
                                                        <FontAwesomeIcon
                                                            className='text-cyan-400 hover:text-cyan-100'
                                                            icon={faEye}
                                                            size={'sm'}
                                                            onClick={() => {
                                                                HandleChangeCenter({ lat: doc.data().lat, lng: doc.data().lng })
                                                                mapRef.current?.setZoom(20)

                                                            }}
                                                        />
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </>
            )}


        </div>
    )
}

export default TableCacambas