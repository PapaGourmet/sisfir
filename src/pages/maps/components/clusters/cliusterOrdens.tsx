import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, MarkerClusterer, Marker } from '@react-google-maps/api'
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../../util/firebase-nao-config'
import { collection, getFirestore, query, where } from 'firebase/firestore'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import IOrdem from '../../../../interfaces/iordem'
import Loading from '../../../../bundles/loading/loading'
import { concatenateEmployeeNames, concatenateStrings, convertDateFormat, convertDatesToMilliseconds, generateDateList, getCurrentDateSaoPauloCluster, randomFraction } from '../../utils/utils'
import ChecksOrdensComponente from './components/checkboxordens'
import SubTitle from '../../../../bundles/subtitle'
import RangeSlider from './components/rangeslider'
const firebase = initializeApp(firebaseConfig, "polys")
const firestore = getFirestore(firebase)

interface Location {
    lat: number
    lng: number
}

interface IClusterOrdensProps { }

const ClusterOrdens: React.FC<IClusterOrdensProps> = ({ }) => {

    const currentDate = useMemo(() => {
        return getCurrentDateSaoPauloCluster()
    }, [])

    const [isGerador, setIsGerador] = useState(true)
    const [isLixo, setIsLixo] = useState(true)
    const [dates, setDates] = useState<number[]>(convertDatesToMilliseconds('18-03-2023', currentDate))

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

    const ref = query(
        collection(firestore, "ordens"),
        where("ordens", "!=", [])
    )
    const q = useFirestoreQuery(["ordens"], ref, {
        subscribe: true,
    })

    if (q.isLoading) {
        return <div className='flex justify-center items-center'><Loading /></div>
    }

    // DataSnapshot
    const snapshot = q.data
    refMapa.current = []
    refOrdens.current = []

    // Iterate the values in order and add an element to the array
    snapshot!.forEach((p) => {
        const data = p.data()
        data.ordens.forEach((x: any) => {
            const index: any = Object.keys(x)[0]
            refOrdens.current.push({ ...x[index], id: index })
        })
    })

    const apiKey = 'AIzaSyBpA20WSB4QwNBGEw_keQRyynjK_3BHbmY' // Substitua pela sua API Key do Google Maps

    return (
        <main>
            <SubTitle title='MAPA DAS ORDENS DE SERVIÇO' />

            <ChecksOrdensComponente
                isGerador={isGerador}
                isLixo={isLixo}
                setIsGerador={setIsGerador}
                setIsLixo={setIsLixo}
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
                                {refOrdens.current
                                    .filter((x: IOrdem) => x.geocode && x.status)
                                    .filter((x: IOrdem) => generateDateList(dates).includes(x.dataOrdem))
                                    .map((l: IOrdem, index) => (
                                        <Marker
                                            key={l.geocode!.lat + '-' + l!.key}
                                            position={{ lat: l.geocode!.lat + randomFraction(), lng: l.geocode!.lng + randomFraction() }}
                                            clusterer={clusterer}
                                            title={`OS: ${l.key} \nData: ${convertDateFormat(l.dataOrdem)} \nUnidade: ${concatenateStrings(l.unit)} \nSegmento: (${concatenateStrings(l.segmento)}) \nEquipe: ${concatenateEmployeeNames(l.equipe)} \nLocal: ${l.local}`}
                                        />
                                    ))}
                            </>
                        )}
                    </MarkerClusterer>
                }

                {isGerador && !isLixo &&
                    <MarkerClusterer>
                        {(clusterer) => (
                            <>
                                {refOrdens.current
                                    .filter((x: IOrdem) => x.geocode && x.status)
                                    .filter((x: IOrdem) => generateDateList(dates).includes(x.dataOrdem))
                                    .filter((x: IOrdem) => x.segmento?.includes('Grande Gerador'))
                                    .map((l: IOrdem, index) => (
                                        <Marker
                                            key={l.geocode!.lat + '-' + l!.key}
                                            position={{ lat: l.geocode!.lat + randomFraction(), lng: l.geocode!.lng + randomFraction() }}
                                            clusterer={clusterer}
                                            title={`OS: ${l.key} \nData: ${convertDateFormat(l.dataOrdem)} \nUnidade: ${concatenateStrings(l.unit)} \nSegmento: (${concatenateStrings(l.segmento)}) \nEquipe: ${concatenateEmployeeNames(l.equipe)} \nLocal: ${l.local}`}
                                        />
                                    ))}
                            </>
                        )}
                    </MarkerClusterer>
                }

                {
                    !isGerador && isLixo &&
                    <MarkerClusterer>
                        {(clusterer) => (
                            <>
                                {refOrdens.current
                                    .filter((x: IOrdem) => x.geocode && x.status)
                                    .filter((x: IOrdem) => generateDateList(dates).includes(x.dataOrdem))
                                    .filter((x: IOrdem) => x.segmento?.includes('Lixo Zero'))
                                    .map((l: IOrdem, index) => (
                                        <Marker
                                            key={l.geocode!.lat + '-' + l!.key}
                                            position={{ lat: l.geocode!.lat + randomFraction(), lng: l.geocode!.lng + randomFraction() }}
                                            clusterer={clusterer}
                                            title={`OS: ${l.key} \nData: ${convertDateFormat(l.dataOrdem)} \nUnidade: ${concatenateStrings(l.unit)} \nSegmento: (${concatenateStrings(l.segmento)}) \nEquipe: ${concatenateEmployeeNames(l.equipe)} \nLocal: ${l.local}`}
                                        />
                                    ))}
                            </>
                        )}
                    </MarkerClusterer>
                }
            </GoogleMap>

        </main>


    )
}

export default ClusterOrdens
