import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where, } from "firebase/firestore"
import Loading from '../../../../bundles/loading/loading'
import { FormDataEnvio } from '../../../../types/types'
import dbDatabaseFirestoreNao from '../util/firestoreconfig'
import { UseFormRegister } from 'react-hook-form'

const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

interface SelectProps {
    uid: string,
    setSerie: React.Dispatch<React.SetStateAction<string>>,
    status: boolean
}

const SelectDumpsterDelete: React.FC<SelectProps> = ({
    uid,
    setSerie,
    status
}) => {

    const q = query(
        collection(dbDatabaseFirestoreNao, "cacambas-dumpster"),
        where("uid", "==", uid)
    );

    const [value, loading, error] = useCollection(q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    return (
        <div className='w-full'>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <div className='flex justify-center items-center'><Loading /></div>}
            {value && (
                <>
                    <label>Número de série</label>
                    <select
                        className='border h-8 rounded-lg w-full p-1'
                        onChange={(item) => {
                            if (item) {
                                const { value } = item.target
                                if (!!value.length) {
                                    setSerie && setSerie(value)
                                } else {
                                    setSerie && setSerie("")
                                }
                            }
                        }}
                    >
                        <option></option>
                        {value.docs
                            .sort((a: any, b: any) => a.data().numeroSerie.localeCompare(b.data().numeroSerie))
                            .filter(doc => doc.data().status === status)
                            .map((doc) => (
                                <option key={doc.id} value={doc.id}>{doc.data().numeroSerie}</option>
                            ))}
                    </select>
                </>

            )}
        </div>
    )
}

export default SelectDumpsterDelete