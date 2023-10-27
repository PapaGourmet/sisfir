import { useEffect, useState } from "react"
import Loading from "../../../../bundles/loading/loading"
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IEmployee from "../../../../interfaces/iemployee"
import { collection } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import dbDatabaseFirestoreNao from "../../../cacambas/components/util/firestoreconfig"
import { useNavigate } from "react-router"

interface EmployeesTableProps {
    setAmount: React.Dispatch<React.SetStateAction<number>>,
    amount: number,
    name: string
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({
    setAmount,
    amount = 10,
    name
}) => {

    const [data, loading, error] = useCollection(
        collection(dbDatabaseFirestoreNao, "employees"),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const [parts, setParts] = useState(0)
    const [init, setInit] = useState(0)
    const [employees, setEmployees] = useState<any[]>([])
    const navigate = useNavigate()


    useEffect(() => {
        setEmployees([])
        if (data) {
            setInit(0)
            const len = data.docs.length
            const rest = Math.floor(len % amount)

            if (!!name) {
                setParts(1)
                setAmount(len)
                const result = data.docs.map(key => key.data())
                setEmployees(result.filter(employee => employee.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())))
            } else {

                if (rest > 0) {
                    setParts(Math.floor(len / amount) + 1)
                } else {
                    setParts(Math.floor(len / amount))
                }
                setEmployees(data.docs.map(key => key.data()))
            }

        }

    }, [amount, data, name])


    if (loading) {
        return (
            <div className='flex justify-center items-center'><Loading /></div>
        )
    }

    if (error) {
        return (
            <h1>{error.message}</h1>
        )
    }

    return (
        <main className="h-screen">
            <ul className="overflow-auto h-1/2">
                {data && employees
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .slice(init * amount, init * amount + amount)
                    .map((key: IEmployee) => (
                        <ul key={key.name} className="w-full py-1 rounded-lg odd:bg-cyan-50" >

                            <li className="w-full p-3 border rounded-lg ">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-11 truncate">
                                        <span>{key.name}{key.id}</span>
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            className="outline-none focus:outline-none active:outline-none">
                                            <FontAwesomeIcon
                                                className='text-cyan-400 hover:text-cyan-100'
                                                icon={faPen}
                                                size={'sm'}
                                                onClick={() => {
                                                    const params = { empregados: [key] }
                                                    navigate('/empregados/cadastro', { state: params })
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    ))}
            </ul>
            <div className="grid grid-cols-1 mt-5 text-xs md:text-lg">

                <div className="flex justify-end">
                    {init > 0 && <span
                        className="border p-2 text-blue-800 hover:text-blue-500"
                        onClick={() => {
                            if (init > 0) {
                                setInit(0)
                            }
                        }}

                    >Primeira</span>}
                    <span
                        className="border p-2 text-blue-800 hover:text-blue-500"
                        onClick={() => {
                            if (init > 0) {
                                setInit(init => init - 1)
                            }
                        }}

                    >Anterior</span>
                    <span className="border p-2">{init + 1}</span>
                    <span className="border p-2">{parts}</span>
                    <span
                        className="border p-2 text-blue-800 hover:text-blue-500"
                        onClick={() => {
                            if (init < parts - 1) {
                                setInit(init => init + 1)
                            }
                        }}>Próxima</span>
                    {init < parts - 1 && <span
                        className="border p-2 text-blue-800 hover:text-blue-500"
                        onClick={() => {
                            if (init < parts) {
                                console.log(parts)
                                setInit(parts - 1)
                            }
                        }}

                    >Última</span>}
                </div>
            </div>
        </main>
    )
}

export default EmployeesTable