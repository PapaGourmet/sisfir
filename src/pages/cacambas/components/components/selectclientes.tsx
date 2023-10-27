import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where, } from "firebase/firestore"
import Loading from '../../../../bundles/loading/loading'
import { FormDataEnvio } from '../../../../types/types'
import { FirebaseClienteDatabase } from '../ioc/clientes/clienteDatabase'
import { ClienteManager } from '../ioc/clientes/iclientesrepository'
import dbDatabaseFirestoreNao from '../util/firestoreconfig'
const clienteDatabase = new FirebaseClienteDatabase()
const clienteManager = new ClienteManager(clienteDatabase)
const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

interface SelectProps {
    onChangeCliente: React.Dispatch<React.SetStateAction<FormDataEnvio>>
    onChangeTipo: React.Dispatch<React.SetStateAction<FormDataEnvio>>
    active: boolean
}

const SelectClientesCacambas: React.FC<SelectProps> = ({
    onChangeCliente,
    onChangeTipo,
    active
}) => {

    const q = query(
        collection(dbDatabaseFirestoreNao, "cacambas-clientes"),
        where("uid", "==", localStorage.getItem('uid'))
    );

    const [value, loading, error] = useCollection(q,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const handleSelectClinte = async (id: string) => {
        try {
            const cliente: FormDataEnvio = await clienteManager.buscarCliente(id) || initCliente
            onChangeCliente(cliente)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='w-full'>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <div className='flex justify-center items-center'><Loading /></div>}
            {value && (
                <>
                    <label>Clientes</label>
                    <select
                        className='border h-8 rounded-lg w-full p-1'
                        onChange={(item) => {
                            if (item) {
                                const { value } = item.target
                                if (!!value.length) {
                                    handleSelectClinte(value)
                                } else {
                                    onChangeTipo(initCliente)
                                }
                            }
                        }}
                    >
                        <option></option>
                        {value.docs
                            .sort((a, b) => a.data().nome.localeCompare(b.data().nome))
                            .filter(key => key.data().status === active)
                            .map((doc) => (
                                <option key={doc.id} value={doc.id}>{doc.data().nome}</option>
                            ))}
                    </select>
                </>

            )}
        </div>
    )
}

export default SelectClientesCacambas