import { query, collection, where } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import dbDatabaseFirestoreNao from "../../../cacambas/components/util/firestoreconfig"
import { useCallback, useEffect, useState } from "react"
import Loading from "../../../../bundles/loading/loading"
import { UseFormRegister } from "react-hook-form"

interface SelectSegmentosProps {
    setTipo: React.Dispatch<React.SetStateAction<string | undefined>>,
    register: UseFormRegister<{
        type: string;
        name: string;
        unit: string;
        registry: string;
        obs?: string;
        rule: string;
    }>
}

const SelectSegmentos: React.FC<SelectSegmentosProps> = ({
    setTipo,
    register
}) => {

    const [data, loading, error] = useCollection(
        collection(dbDatabaseFirestoreNao, "dados"),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const handleChangeTipo = useCallback((tipo: string) => {
        setTipo(tipo)
    }, [])

    if (error) {
        return <h1>{error.message}</h1>
    }

    if (loading) {
        return <div className='flex justify-center items-center'><Loading /></div>
    }

    if (data) {

        const response = data.docs.map(doc => doc.data())
        const segmentos = response[0].segmento.sort()

        return (
            <main>
                <select
                    className="border w-full h-8 rounded-md outline-none pl-2"
                    {...register('type')}
                    onChange={(event) => {
                        const { value } = event.target
                        handleChangeTipo(value)
                    }}
                >
                    <option></option>
                    {response && segmentos.map((item: string) => (
                        <option key={item} value={item}>{item}</option>
                    ))}

                </select>

            </main>
        )

    }

    return (<></>)
}

export default SelectSegmentos