import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { GoogleMap, MarkerClusterer, Marker } from '@react-google-maps/api'
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../../util/firebase-nao-config'
import { collection, getFirestore, query, where } from 'firebase/firestore'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import IOrdem from '../../../../interfaces/iordem'
import Loading from '../../../../bundles/loading/loading'
import { convertDatesToMilliseconds, converterMilissegundosParaData, generateDateList, getCurrentDateSaoPauloCluster, getLocalTimeInSaoPauloMilliseconds, randomFraction } from '../../utils/utils'
import SubTitle from '../../../../bundles/subtitle'
import RangeSlider from './components/rangeslider'
import dbDatabaseFirestoreNao from '../../../cacambas/components/util/firestoreconfig'
import { calcularDiferenca, calcularDiferencaHoras, converterTempoMilissegundosParaFormato } from '../../../cacambas/components/util/actions'
import ChecksCacambasComponente from './components/checkboxcacambas'
import { interval } from 'rxjs'
const firebase = initializeApp(firebaseConfig, "polys")
const firestore = getFirestore(firebase)

interface Location {
    lat: number
    lng: number
}

interface IClusterCacambasProps { }

const ClusterCacambas: React.FC<IClusterCacambasProps> = ({ }) => {

    const [value, loading, error] = useCollection(
        collection(dbDatabaseFirestoreNao, 'cacambas-cacambas'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    )

    const currentDate = useMemo(() => {
        return getCurrentDateSaoPauloCluster()
    }, [])

    const [isGerador, setIsGerador] = useState(true)
    const [isLixo, setIsLixo] = useState(true)
    const [dates, setDates] = useState<number[]>(convertDatesToMilliseconds('18-03-2023', currentDate))
    const [status, setStatus] = useState(true)
    const [up, setUp] = useState<number>(getLocalTimeInSaoPauloMilliseconds())

    const rioDeJaneiroLatLng = useMemo(() => {
        return new google.maps.LatLng(-22.9083, -43.1971)
    }, [])


    type IOrdemBody = {
        aprovado?: boolean,
        aprovador?: string,
        obs: string,
        ordem: IOrdem[]
    }

    const refMapa = useRef<IOrdemBody[]>([])
    const refOrdens = useRef<IOrdem[]>([])

    const mapStyles = {
        height: '100vh',
        width: '100%',
    }


    const apiKey = 'AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY' // Substitua pela sua API Key do Google Maps

    useEffect(() => {
        const subscription = interval(300000).subscribe(() => {
            setUp(getLocalTimeInSaoPauloMilliseconds())
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [])

    return (

        <main>

            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <div className='flex justify-center items-center'><Loading /></div>}
            {value && <>
                <SubTitle title='MAPA DAS CAÇAMBAS' />

                <ChecksCacambasComponente
                    setStatus={setStatus}
                    status={status}
                />

                <div className='grid grid-cols-12 mb-4'>
                    <div className='col-span-4'></div>
                    <div className='col-span-4'>
                        <RangeSlider
                            handleStateRangeDate={setDates}
                        />
                    </div>
                    <div className='col-span-4'></div>
                </div>

                <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={rioDeJaneiroLatLng}>
                    {isGerador && isLixo &&
                        <MarkerClusterer>
                            {(clusterer) => (
                                <>
                                    {value.docs
                                        .filter(doc => doc.data().status === !status)
                                        .filter((doc: any) => generateDateList(dates).includes(converterMilissegundosParaData(doc.data().data)))
                                        .map((doc: any, i: number) => (
                                            <Marker
                                                key={doc.data().lat + '-' + doc.key}
                                                position={{ lat: doc.data().lat + randomFraction(), lng: doc.data().lng + randomFraction() }}
                                                clusterer={clusterer}
                                                title={`
                                                Numero: ${!!doc.data().numero ? doc.data().numero : 'Não depositada'}\nInício: ${converterTempoMilissegundosParaFormato(doc.data().data)}\nHoras: ${calcularDiferenca(doc.data().data)}\nTérmino: ${doc.data().termino ? converterTempoMilissegundosParaFormato(doc.data().termino) : 'ainda não finalizada'}`}
                                                icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${i + 1}|${calcularDiferencaHoras(doc.data().data)}|FFFFFF`}
                                            />
                                        ))}
                                </>
                            )}
                        </MarkerClusterer>
                    }
                </GoogleMap>
                <div>{`Última atualização: ${converterTempoMilissegundosParaFormato(up)}`}</div>
            </>}
        </main>
    )
}

export default ClusterCacambas
