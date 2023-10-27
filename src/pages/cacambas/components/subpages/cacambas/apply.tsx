import React, { useEffect, useRef, useState } from "react"
import { FormDataEnvio } from "../../../../../types/types"
import SelectClientesCacambas from "../../components/selectclientes"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import CacambasZodSchema from "../../zods/zodschemacacambas"
import Tooltip from "../../../../../bundles/toolstip/toolstip"
import { AutocompleteRequest } from "../../../../../bundles/ioc/googleautocompleterequest"
import { GoogleAutocompleteRequest } from "../../../../../bundles/ioc/igoogleautocompleterequest"
import { GoogleMap, Marker } from "@react-google-maps/api"
import { ServiceFirestoreCacambas } from "../../ioc/cacambas/servicefirestorecacamba"
import { ApplyCacambaService, ICacambaProps } from "../../ioc/cacambas/icacambasservice"
import { uid as uid2 } from "uid"
import Loading from "../../../../../bundles/loading/loading"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { converterParaMilissegundos } from '../../util/actions'
import { converterMilissegundosParaData, getLocalTimeInSaoPauloMilliseconds } from "../../../../maps/utils/utils"
import { query, collection, where } from "firebase/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"
import dbDatabaseFirestoreNao from "../../util/firestoreconfig"
const autocompleteRequest = new AutocompleteRequest()
const autocompleteManager = new GoogleAutocompleteRequest(autocompleteRequest)
const firestoreservice = new ServiceFirestoreCacambas()
const cacambasservice = new ApplyCacambaService(firestoreservice)

const mapContainerStyle = {
    width: '100%',
    height: '100%'
}

const initCliente: FormDataEnvio = {
    bairro: "", celular: "", cep: "", complemento: "", documento: "", email: "", fixo: "", logradouro: "", municipio: "", nome: "", numero: "", tipo: "", uf: "", uid: localStorage.getItem('uid') || "", user: localStorage.getItem('user') || "", id: ""
}

const AplyCacambas: React.FC = () => {
    const [cliente, setCliente] = useState<FormDataEnvio>(initCliente)
    const [center, setCenter] = useState<{ lat: number, lng: number }>({
        lat: -22.9205975,
        lng: -43.2355761
    })
    const [coordinates, setCoordinates] = useState<google.maps.LatLng[]>([])
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { handleSubmit, register, setValue, setError, clearErrors, reset, errors } = CacambasZodSchema()
    const uid = useRef(localStorage.getItem('uid') || "")
    const [totalsCacambas, setTotalsCacambas] = useState(0)
    const [totalsDumpsters, setTotalsDumpsters] = useState(0)
    const [cacambas, loadingCacambas, errorCacambas] = useCollectionData(
        query(collection(dbDatabaseFirestoreNao, 'cacambas-cacambas'), where('uid', '==', uid.current), where('status', '==', true))
    )

    const [dumpsters, loadingDumpsters, errorDumpsters] = useCollectionData(
        query(collection(dbDatabaseFirestoreNao, 'cacambas-dumpster'), where('uid', '==', uid.current), where('status', '==', true))
    )

    const notify = (message: string) => toast(message,
        {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        })


    const handleSendFormCacambas = async (value: any) => {
        if (totalsCacambas >= totalsDumpsters) {
            setError('dia', {
                type: 'manual',
                message: 'Quantidade de caçambas insuficiente'
            })

            return
        }

        const { dia, local } = value
        const id = uid2(10)

        const cacamba: ICacambaProps = {
            data: converterParaMilissegundos(dia, '00:00'),
            documento: cliente.documento,
            id,
            lat: coordinates[0].lat(),
            lng: coordinates[0].lng(),
            local,
            status: true,
            uid: uid.current,
            nome: cliente.nome
        }

        setIsLoading(true)

        try {
            await cacambasservice.addCacamba(cacamba)
            reset()
            setCoordinates([])
            setCliente(initCliente)
            setShow(false)
            notify("Caçamba salva com sucesso!")
        } catch (err) {
            console.log(err)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
        }

    }

    const handleAutocompleteSearch = async (value: any) => {
        const { label } = value
        if (label) {
            setValue('local', label)
            clearErrors('local')
            const coordinates: google.maps.LatLng | [] = await autocompleteManager.adicionarCliente(label)
            setCoordinates([])
            setCoordinates(pre => [...pre, coordinates])
            const lat = coordinates.lat()
            const lng = coordinates.lng()
            setCenter({ lat, lng })
        }
    }

    useEffect(() => {
        setShow(false)

        if (!!cliente.nome.length) {
            setShow(true)
        }

    }, [cliente])

    useEffect(() => {
        setTotalsCacambas(cacambas?.length || 0)
        setTotalsDumpsters(dumpsters?.length || 0)
    }, [cacambas, dumpsters])


    if (loadingCacambas || loadingDumpsters) {
        return <div className='flex justify-center items-center'><Loading /></div>
    }

    if (errorCacambas || errorDumpsters) {
        return <h1>Erro de carregamento</h1>
    }

    return (
        <main>
            <div className="flex flex-col md:flex-row gap-4  h-screen">

                <form
                    className="w-full md:w-1/3 h-auto md:h-3/4 flex flex-col justify-centerp-3"
                    onSubmit={handleSubmit(handleSendFormCacambas)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="text-center">Total de caçambas</label>
                            <input disabled value={totalsDumpsters} className="border rounded-lg text-center" onChange={() => { }} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-center">Total empregado</label>
                            <input disabled value={totalsCacambas} className="border rounded-lg text-center" onChange={() => { }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-x-3 mt-3">
                        <div className="grid grid-cols-12">
                            <div className="col-span-11">
                                <SelectClientesCacambas
                                    onChangeCliente={setCliente}
                                    onChangeTipo={setCliente}
                                    active={true}
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="text-transparent">.</label>
                                <CopyToClipboard text={`${cliente.logradouro}, ${cliente.numero}, ${cliente.bairro}, ${cliente.municipio} - ${cliente.uf}`}>
                                    <button
                                        className="border outline-none w-full h-8 rounded-md hover:bg-blue-100"
                                        type="button"
                                    >
                                        <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faCopy} size={'sm'} />
                                    </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                    </div>


                    {show &&
                        (
                            <>
                                <div className="mt-4 mb-4">

                                    <GooglePlacesAutocomplete

                                        apiKey="AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY"

                                        selectProps={{
                                            placeholder: "Procure um local...",
                                            onChange: (item) => handleAutocompleteSearch(item)
                                        }}

                                    />


                                </div>

                                <div className="mb-3">
                                    <label>Local</label>
                                    <input
                                        {...register('local')}
                                        disabled
                                        type="text"
                                        className="border w-full outline-none h-8 rounded-md p-2 truncate"
                                    />
                                    {errors.local && <span className="alerta">{errors.local.message === 'Required' ? 'O campo local é obrigatório' : ''}</span>}
                                </div>


                                <div className="mb-3">
                                    <label>Dia da colocação da caçamba</label>
                                    <input
                                        type="date"
                                        min={converterMilissegundosParaData(getLocalTimeInSaoPauloMilliseconds())}
                                        {...register('dia')}
                                        className="border w-full outline-none h-8 rounded-md p-2 truncate"
                                    />
                                    {errors.dia && <span className="alerta">{errors.dia.message}</span>}
                                </div>

                                <div className="flex items-center justify-center mt-2">
                                    <button
                                        type="submit"
                                        className="bg-teal-900 hover:bg-teal-600 text-white w-20 h-20 rounded-full"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </>
                        )
                    }


                </form>


                <div className="w-full md:w-2/3 h-full  md:h-auto flex items-center justify-center bg-gray-300">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={10}
                    >

                        {coordinates.map((coordinate: google.maps.LatLng) => (
                            <Marker key={coordinate.lat()} position={coordinate} />
                        ))}

                    </GoogleMap>
                </div>
            </div>

            <ToastContainer />

            {isLoading && <div className='flex justify-center items-center'><Loading /></div>}
        </main>
    )
}

export default AplyCacambas
