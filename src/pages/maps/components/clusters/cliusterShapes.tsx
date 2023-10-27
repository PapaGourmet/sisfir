import React, { useMemo, useRef } from 'react'
import { GoogleMap, LoadScript, MarkerClusterer, Marker } from '@react-google-maps/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../../util/firebase-nao-config'
import { collection, getFirestore, query } from 'firebase/firestore'
import { useDatabaseSnapshot } from '@react-query-firebase/database'
import { useFirestoreQuery } from '@react-query-firebase/firestore'
import { convertDateFormat, randomFraction, reverseDate } from '../../utils/utils'
import Loading from '../../../../bundles/loading/loading'
import { useNavigate } from 'react-router'
const firebase = initializeApp(firebaseConfig, "polys")
const firestore = getFirestore(firebase)

interface Location {
    lat: number
    lng: number
}

interface IClusterProps { }

const Cluster: React.FC<IClusterProps> = ({ }) => {

    const navigate = useNavigate()

    const rioDeJaneiroLatLng = useMemo(() => {
        return new google.maps.LatLng(-22.9083, -43.1971)
    }, [])

    type IPoligonos = {
        latlng: google.maps.LatLng,
        data: string,
        cor: string,
        key: any,
        titulo: string,
        fiscais: number
    }

    const refMapa = useRef<IPoligonos[]>([])

    const mapStyles = {
        height: '100vh',
        width: '100%',
    }

    const ref = query(collection(firestore, "poligonos"));
    const q = useFirestoreQuery(["poligonos"], ref, {
        subscribe: true,
    });

    if (q.isLoading) {
        return <div className='flex justify-center items-center'><Loading /></div>
    }

    // DataSnapshot
    const snapshot = q.data
    refMapa.current = []

    // Iterate the values in order and add an element to the array
    snapshot!.forEach((p) => {
        const data = p.data()
        refMapa.current.push(
            { key: p.id, data: convertDateFormat(data.date), cor: data.color.background.replace('#', ''), latlng: new google.maps.LatLng(data.CentralPoint.lat, data.CentralPoint.lng), titulo: data.title, fiscais: data.fiscais }
        )
    })


    const apiKey = 'AIzaSyBpA20WSB4QwNBGEw_keQRyynjK_3BHbmY' // Substitua pela sua API Key do Google Maps

    return (

        <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={rioDeJaneiroLatLng}>
            <MarkerClusterer>
                {(clusterer) => (
                    <>
                        {refMapa.current.map((l: IPoligonos, index) => (
                            <Marker
                                key={`${l.key}`}
                                position={{ lat: l.latlng.lat() + randomFraction(), lng: l.latlng.lng() + randomFraction() }}
                                clusterer={clusterer}
                                title={`${l.data} (${l.titulo}) (${l.fiscais} ${l.fiscais > 1 ? 'fiscais' : 'fiscal'})`}
                                icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${index + 1}|${l.cor}|FFF`}
                                onClick={async () => {
                                    navigate(`/mapas/criar?key=${l.key}`)
                                }}
                            />
                        ))}
                    </>
                )}
            </MarkerClusterer>
        </GoogleMap>

    )
}

export default Cluster
