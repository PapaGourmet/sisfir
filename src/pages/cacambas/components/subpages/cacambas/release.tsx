import React, { useRef, useState } from "react"
import { FormDataEnvio } from "../../../../../types/types"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { ServiceFirestoreCacambas } from "../../ioc/cacambas/servicefirestorecacamba"
import { ApplyCacambaService, ICacambaProps } from "../../ioc/cacambas/icacambasservice"
import Loading from "../../../../../bundles/loading/loading"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TableCacambas from "../../components/tablecacambas"
import { calcularDiferenca, calcularDiferencaHoras, converterTempoMilissegundosParaFormato } from "../../util/actions"
import ModalDeleteCacamba from "../../modals/modal-delete.cac"
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)

const mapContainerStyle = {
    width: '100%',
    height: '100%'
}

const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

const CacambasRelease: React.FC = () => {
    const [cacamba, setCacamba] = useState<ICacambaProps[]>([])
    const [center, setCenter] = useState<{ lat: number, lng: number }>({
        lat: -22.9205975,
        lng: -43.2355761
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [id, setId] = useState<string>("")
    const mapRef = useRef<google.maps.Map>()
    const uid = useRef(localStorage.getItem('uid') || "")
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDzpuznODvjWY8oOf-M3IACkM3RA6zLQoE",
    });

    const notify = () => toast("Caçamba salva com sucesso!",
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        }
    )


    return (
        <main>
            <div className="flex flex-col md:flex-row gap-4  h-screen">
                <div className="w-full md:w-1/3 h-auto md:h-3/4 flex flex-col justify-centerp-3">
                    <TableCacambas
                        onChangeCacambas={setCacamba}
                        HandleOpenModal={setIsModalOpen}
                        HandleIdCacamba={setId}
                        HandleChangeCenter={setCenter}
                        mapRef={mapRef}
                    />
                </div>

                <div className="w-full md:w-2/3 h-full  md:h-auto flex items-center justify-center bg-gray-300">
                    {isLoaded && <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={10}
                        onLoad={(map) => {
                            mapRef.current = map;
                        }}
                    >

                        {cacamba
                            .filter(cac => cac.status)
                            .filter(cac => cac.uid === uid.current)
                            .sort((a: any, b: any) => a.data - b.data)
                            .map((cac: ICacambaProps, i: number) => (
                                <Marker key={cac.lat} position={new google.maps.LatLng(cac.lat, cac.lng)}
                                    icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${i + 1}|${calcularDiferencaHoras(cac.data)}|FFFFFF`}
                                    title={`${cac.numero ? cac.numero : 'Sem colocação'}\n${converterTempoMilissegundosParaFormato(cac.data)}\n${cac.nome}\n${cac.numero ? calcularDiferenca(cac.data) : ""}`}
                                />
                            ))}
                    </GoogleMap>}
                </div>
            </div>

            <ToastContainer />

            {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

            <ModalDeleteCacamba
                HandleOpenModal={setIsModalOpen}
                isOpen={isModalOpen}
                id={id}
            />
        </main>
    )
}

export default CacambasRelease
