import React, { useCallback } from "react"
import { collection } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import dbDatabaseFirestoreNao from "../../../cacambas/components/util/firestoreconfig"
import Loading from "../../../../bundles/loading/loading"
import IEmployee from "../../../../interfaces/iemployee"


interface SelectEmployeesProps {
    setEmployees: React.Dispatch<React.SetStateAction<IEmployee[]>>
}

const SelectEmployees: React.FC<SelectEmployeesProps> = ({ setEmployees }) => {
    const [data, loading, error] = useCollection(
        collection(dbDatabaseFirestoreNao, "employees"),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const handleChangeEmployee = (value: any) => {
        if (data) {
            const filter = data.docs.filter(doc => doc.data().id === value)
            const result = filter.map(doc => doc.data())
            console.log()
            setEmployees(result as IEmployee[])
        }
    }

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
        <main>
            <label>Funcionários</label>
            <select
                className="border h-8 w-full rounded-md pl-2 outline-none"
                onChange={(event) => {
                    const { value } = event.target
                    handleChangeEmployee(value)
                }}
            >
                <option></option>
                {data && data.docs
                    .sort((a, b) => a.data().name.localeCompare(b.data().name))
                    .map(doc => (
                        <option key={doc.data().id} value={doc.data().id}>{doc.data().name}{doc.data().id}</option>
                    ))}
            </select>
        </main>
    )
}

export default SelectEmployees