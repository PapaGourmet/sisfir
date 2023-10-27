import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where, } from "firebase/firestore"
import Loading from '../../../../bundles/loading/loading'
import { FormDataEnvio } from '../../../../types/types'
import { ServiceFirestoreCacambas } from '../ioc/cacambas/servicefirestorecacamba'
import { ApplyCacambaService } from '../ioc/cacambas/icacambasservice'
import dbDatabaseFirestoreNao from '../util/firestoreconfig'
import { UseFormRegister } from 'react-hook-form'
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

interface SelectProps {
    uid: string,
    register: UseFormRegister<{
        numero: string;
    }>
}

const SelectDumpster: React.FC<SelectProps> = ({
    uid,
    register,
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
                    <select
                        className='border h-10 rounded-lg w-full p-1'
                        {...register('numero')}
                    >
                        <option></option>
                        {value.docs
                            .filter(doc => doc.data().status)
                            .map((doc) => (
                                <option key={doc.id} value={doc.data().numeroSerie}>{doc.data().numeroSerie}</option>
                            ))}
                    </select>
                </>

            )}
        </div>
    )
}

export default SelectDumpster