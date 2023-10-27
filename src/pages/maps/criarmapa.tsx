import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useState } from 'react'
import { getPolygonsByDate, getPolygonsByKey, ReverseGeocode, saveOrUpdatePolygonData } from '../../services/servicesApi'
import Loading from '../../bundles/loading/loading'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from "react-router"
import useWindowSize from '../../bundles/useWindowsSize'
import AddressGeocode from '../../bundles/AddressGeocode'
import { SliderPicker } from 'react-color'
import { Coordinate, IFirestoreEnvio } from '../../types/types'
import { coordinatesListToLineStrings, getLocalTimeInSaoPaulo, getLocalTimeInSaoPauloMilliseconds, getPolygonCentroid, polygonsToObject, somaQuantidades } from './utils/utils'
import { FormSchema, schema, FormSchemaImportMap, schemaImportMap, FormSchemaNovaQuantidade, schemaNovaQuantidade } from './zod/zod'
import IFiscais from '../../interfaces/ifiscais'
import ImportShape from './components/modals/import'
import Actions from './components/actions/actions'
import Enviar from './components/modals/send'
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete'
import { LatLng } from 'react-google-places-autocomplete/build/GooglePlacesAutocomplete.types'


const defaultProps = {
    center: {
        lat: -22.9205975,
        lng: -43.2355761
    },
    zoom: 10
}


const CriarMapa = () => {

    const defaultBounds = useMemo(() => {
        return new google.maps.LatLngBounds(
            new google.maps.LatLng(-23.0823, -43.7953),
            new google.maps.LatLng(-22.7461, -43.0999)
        )
    }, [])

    const { width, height } = useWindowSize({ margem: 160 })

    const containerStyle = {
        width: `${width! / 2}`,
        height
    }

    const eventZoom = useRef(defaultProps.zoom)
    const eventCenter = useRef(defaultProps.center)
    const [position, setPosition] = useState(defaultProps.center)
    const [selectedMarker, setSelectedMarker] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [listaPoligonosImport, setListaPoligonosImport] = useState<IFirestoreEnvio[]>([])
    /**
     *Guarda o estado da lista de marcadores posicionais dos fiscais 
     */
    const [lista, setLista] = useState<any[]>([])
    const [cor, setCor] = useState<any>({ background: '#f69' })
    const [titulo, setTitulo] = useState<any>()
    const [pontoCentral, setPontoCentral] = useState<Coordinate>()
    const [showMessage, setShowMessage] = useState(false)
    const [eye, setEye] = useState(false)
    const [id, setId] = useState<any>()
    const [dia, setDia] = useState<any>()
    const [center, setCenter] = useState<google.maps.LatLng | null>(new google.maps.LatLng(defaultProps.center.lat, defaultProps.center.lng))
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSendOpen, setIsSendlOpen] = useState(false)
    const [zoom, setZoom] = useState<number>(15)
    const [local, setLocal] = useState<LatLng | undefined>({ lat: 0, lng: 0 })
    const refAutocomplete = useRef()
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const {
        register: register1,
        handleSubmit: handleSubmit1,
        formState: { errors: errors1 },
        reset: reset1
    } = useForm<FormSchema>({
        resolver: zodResolver(schema)
    })

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        reset: reset2
    } = useForm<FormSchemaImportMap>({
        resolver: zodResolver(schemaImportMap),
        mode: "all"
    })

    const {
        register: register3,
        handleSubmit: handleSubmit3,
        formState: { errors: errors3 },
        reset: reset3
    } = useForm<FormSchemaNovaQuantidade>({
        resolver: zodResolver(schemaNovaQuantidade)
    })

    const ref = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null)
    const refZoom = useRef<number | undefined>()



    //#region Poligonos

    // Estado para controlar o modo de desenho de polígonos
    const [drawingPolygonMode, setDrawingPolygonMode] = useState(false)

    /**
     * Alterna o estado `drawingPolygonMode`, usado para habilitar ou desabilitar o modo de desenho de polígonos no mapa.
     * Não recebe argumentos e não retorna nada.
     */
    const toggleDrawingPolygonMode = useCallback(() => {
        setDrawingPolygonMode((prevMode) => !prevMode)
    }, [])

    // Estado para armazenar a lista de polígonos desenhados
    const [polygons, setPolygons] = useState<google.maps.Polygon[]>([])

    // Estado para armazenar o polígono selecionado
    const [selectedPolygon, setSelectedPolygon] = useState<any | null>(null)

    /**
     * Função chamada quando um novo polígono é desenhado e concluído no mapa.
     *
     * @param {Object} newPolygon - O objeto do polígono desenhado.
     * Atualiza o estado `polygons` adicionando o novo polígono à lista e seleciona o polígono recém-criado.
     */
    const onPolygonComplete = (newPolygon: google.maps.Polygon, colored: string) => {
        // Atualiza as opções do polígono com a cor fornecida.
        newPolygon.setOptions({
            fillColor: colored,
            fillOpacity: 0.6,
            strokeColor: colored,
            strokeOpacity: 0.8,
            strokeWeight: 2,
        })

        setPontoCentral(getPolygonCentroid(newPolygon))
        setId(getLocalTimeInSaoPauloMilliseconds().toString())

        // Atualiza o estado dos polígonos com o novo polígono.
        setPolygons((prevPolygons) => [...prevPolygons, newPolygon])

        const len = polygons.length;

        google.maps.event.addListener(newPolygon.getPath(), 'set_at', function (vertexIndex: any) {
            setId(getLocalTimeInSaoPauloMilliseconds().toString())
            setPolygons((pre) => [...pre.slice(0, len - 1), newPolygon, ...pre.slice(len)])

        })

        google.maps.event.addListener(newPolygon.getPath(), 'insert_at', function (vertexIndex: any) {
            setId(getLocalTimeInSaoPauloMilliseconds().toString())
            setPolygons((pre) => [...pre.slice(0, len - 1), newPolygon, ...pre.slice(len)])

        })

        newPolygon.setMap(mapRef.current)

    }

    /**
     * Remove o polígono selecionado (armazenado no estado `selectedPolygon`) do mapa e da lista de polígonos (estado `polygons`).
     * Não recebe argumentos e não retorna nada.
     */
    const removeSelectedPolygon = () => {
        // if (selectedPolygon !== null) {
        //     selectedPolygon.setMap(null)
        //     setPolygons(polygons.filter((polygon) => polygon !== selectedPolygon))
        //     setSelectedPolygon(null)
        // }
        setPolygons([])
    }

    /**
 * Transforma uma lista de objetos LineString no formato GeoJSON em uma lista de objetos do tipo google.maps.Polygon.
 *
 * @param {object[]} lineStrings - Uma lista de objetos LineString no formato GeoJSON.
 * @param {string} fillColor - A cor de preenchimento dos polígonos. (opcional)
 * @param {string} strokeColor - A cor da linha dos polígonos. (opcional)
 */
    function lineStringsToPolygons(
        lineStrings: object[],
        fillColor: string,
        strokeColor: string
    ) {

        const polygons = lineStrings.map((lineString: any) => {
            const coordinates = lineString.coordinates.map(
                (coord: [number, number]) => new google.maps.LatLng(coord[1], coord[0])
            );

            const polygonOptions: google.maps.PolygonOptions = {
                paths: coordinates,
                fillColor: fillColor,
                fillOpacity: 0.6,
                strokeColor: strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                editable: true
            };

            const polygon = new google.maps.Polygon(polygonOptions)
            onPolygonComplete(polygon, fillColor)

        });

    }

    //#endregion Poligonos

    //#region Funções

    /**
    * Limpa todos os campos de estados do mapa
    */
    const clearAll = () => {

        const removeSelectedPolygon = (p: google.maps.Polygon) => {
            if (p !== null) {
                p.setMap(null)
                setPolygons(polygons.filter((polygon) => polygon !== p))
                setSelectedPolygon(null)
            }
        }

        polygons.forEach(p => {
            removeSelectedPolygon(p)
        })

        setLista([])
        setTitulo(null)
        setPontoCentral(undefined)
        reset2()
        setId(null)
        setListaPoligonosImport([])
        setDia(null)
        setDrawingPolygonMode(false)
        setZoom(15)
    }

    /**
    * Função insertFiscal que busca o endereço a partir das coordenadas geográficas
    * e insere as informações fiscais na lista, atualizando o estado.
    *
    * @param data - Um objeto contendo informações fiscais, como quantidade.
    */
    const insertFiscal = (data: any) => {
        AddressGeocode(position.lat, position.lng)
            .then(result => {
                const { address } = result
                const { quantidade } = data
                const { lat, lng } = position
                reset1()
                setLista((pre) => [...pre, { address, quantidade, lat, lng }])
            })
    }

    /**
     * Atualiza e estdo da cor no evento do memo nome do react-color
     * @param color 
     */
    const handleChangeComplete = (color: any) => {
        setCor({ background: color.hex })
    }

    /**
     * Verifica se os dados de envio estão presetnes e salva na coleção poligonos no firestore
     * @returns 
     */
    const formataDadoDeEnvio = async () => {
        setShowMessage(false)

        console.log(lista, titulo, pontoCentral, polygons, id)



        if (
            lista.length === 0 ||
            !titulo ||
            !pontoCentral ||
            polygons.length === 0 ||
            !id
        ) {

            setShowMessage(true)
            return
        }

        const send: IFirestoreEnvio = {
            color: cor,
            key: id,
            list: lista,
            title: titulo,
            date: getLocalTimeInSaoPaulo(),
            CentralPoint: pontoCentral,
            polys: coordinatesListToLineStrings(polygonsToObject(polygons)),
            fiscais: somaQuantidades(lista)
        }

        try {
            setIsLoading(true)
            await saveOrUpdatePolygonData(send, id)
            clearAll()
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }

    }


    /**
     * Atualiza a view Mode com os dados do shape selecionado na importação
     * @param response
     */
    const UpdateViewMode = (response: IFirestoreEnvio) => {
        const {
            color,
            list,
            CentralPoint,
            title
        } = response

        eventCenter.current = CentralPoint
        setCor(color)
        setId(getLocalTimeInSaoPauloMilliseconds().toString())
        setLista(list)
        setPontoCentral(CentralPoint)
        setTitulo(title)
        response.polys = JSON.parse(response.polys)
        lineStringsToPolygons(response.polys, color.background, color.background)

    }

    /**
     * Recebe uma posição e extrai o shape correspondente e atualiza oe stado com os dados desse shape
     * @param value index (posição) do Shape
     */
    const MapasSelectOnChange = (value: any) => {
        setDia(value)
        const index = parseInt(value)
        const response = listaPoligonosImport[index]
        UpdateViewMode(response)
    }


    /**
     * Mostra ou esconde a aba com as informações e formatações e botões do mapa
     */
    const toggleOlho = () => {
        setEye(true)
        setTimeout(() => {
            window.print()
        }, 250)
    }

    /**
     * Move o centro delicadamente para alterar o estado do mapa
     */
    const moverCentro = () => {
        const { lat, lng } = eventCenter.current
        //para fazer o mapa se mover e tirar o infobox que fica congelado na tela
        eventCenter.current = { lat, lng }
    }

    //#endregion Funções

    //#region Modal Import

    const handleConfirmImportClick = () => {

        setIsModalOpen(false)
    }

    const handleCancelImportClick = () => {
        setIsModalOpen(false)
        clearAll()
    }
    //#endregion Modal

    //#region Modal Send


    const handleCancelSendClick = () => {
        setIsSendlOpen(false)
        clearAll()
    }

    //#endregion Modal

    useEffect(() => {
        const key = queryParams.get('key')
        if (key) {
            getPolygonsByKey(key)
                .then(data => {
                    UpdateViewMode(data[0])
                })
                .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        let gEventOverlayComplete: google.maps.MapsEventListener
        const polygonListeners: google.maps.MapsEventListener[] = []


        if (ref.current) {
            mapRef.current = new window.google.maps.Map(ref.current, {
                center,
                zoom,
                disableDoubleClickZoom: true,
                gestureHandling: 'cooperative'
            })

            const CreateDrawingManager = () => {
                drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                            google.maps.drawing.OverlayType.POLYGON,
                        ],
                    },

                    polygonOptions: {
                        fillColor: cor.background,
                        fillOpacity: 0.2,
                        strokeWeight: 1,
                        strokeColor: cor.background,
                        clickable: false,
                        editable: true,
                        zIndex: 1,
                    }
                })

                drawingManagerRef.current.setMap(mapRef.current)

                gEventOverlayComplete = google.maps.event.addListener(drawingManagerRef.current, 'overlaycomplete', (event: any) => {
                    if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                        setPolygons(pre => [...pre, event.overlay as google.maps.Polygon])
                        const { lat, lng } = getPolygonCentroid(event.overlay as google.maps.Polygon)
                        setCenter(new google.maps.LatLng(lat, lng))
                        setPontoCentral({ lat, lng })
                        setId(getLocalTimeInSaoPauloMilliseconds().toString())
                    }
                })
            }

            CreateDrawingManager()

            // Configura a remoção do polígono ao pressionar a tecla ESC
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    if (drawingManagerRef.current) {
                        drawingManagerRef.current.setMap(null)
                        CreateDrawingManager()
                    }
                }
            })

            interface ILista {
                address: string,
                lat: number,
                lng: number,
                quantidade: number
            }

            const eventDoubleClick = mapRef.current.addListener('dblclick', (event: google.maps.MapMouseEvent) => {
                const len = lista.length
                if (event.latLng) {
                    const lat = event.latLng.lat()
                    const lng = event.latLng.lng()

                    const _lista: ILista = {
                        address: 'lista' + len,
                        lat,
                        lng,
                        quantidade: 2
                    }

                    AddressGeocode(lat, lng)
                        .then(result => {
                            const { address } = result
                            _lista.address = address || ""
                            setLista(pre => [...pre, _lista])
                            setCenter(event.latLng)
                        })

                }
            })


            const eventZoomChanged = mapRef.current.addListener('zoom_changed', () => {
                refZoom.current = mapRef.current?.getZoom()
            })

            if (polygons) {
                polygons.forEach((poly: google.maps.Polygon, index: number, obj: google.maps.Polygon[]) => {

                    if (poly) {

                        poly.setOptions(
                            {
                                fillColor: cor.background,
                                fillOpacity: 0.2,
                                strokeOpacity: 0.5,
                                strokeWeight: 1,
                                strokeColor: cor.background,
                                clickable: true,
                                editable: true,
                                zIndex: 1,
                            }
                        )

                        const setAtListener = google.maps.event.addListener(poly.getPath(), 'set_at', function (vertexIndex: any) {
                            setId(getLocalTimeInSaoPauloMilliseconds().toString())
                            setPolygons((pre) => [...pre.slice(0, index), poly, ...pre.slice(index + 1)])

                        })

                        const PADDING = 0.005; // Quantidade de padding (em graus) para determinar a borda do mapa


                        const insertAtListener = google.maps.event.addListener(poly.getPath(), 'insert_at', function (vertexIndex: any) {
                            setId(getLocalTimeInSaoPauloMilliseconds().toString())
                            setPolygons((pre) => [...pre.slice(0, index), poly, ...pre.slice(index + 1)])

                        })

                        const deleteVertex = google.maps.event.addListener(poly, 'dblclick', (event: google.maps.PolyMouseEvent) => {
                            if (event.vertex !== undefined) {
                                const path = poly.getPath();
                                path.removeAt(event.vertex);
                            }
                        })

                        poly.setMap(mapRef.current)
                        polygonListeners.push(setAtListener)
                        polygonListeners.push(insertAtListener)
                        polygonListeners.push(deleteVertex)
                    }
                })
            }

            if (lista) {
                lista.forEach((item: ILista, i: number) => {
                    const marker = new window.google.maps.Marker({
                        position: { lat: item.lat, lng: item.lng },
                        map: mapRef.current,
                        title: `${item.quantidade} ${item.quantidade > 1 ? 'fiscais' : 'fiscal'}`,
                        icon: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=${i + 1}|FFFFFF|CD5C5C`,
                        draggable: true
                    })

                    marker.addListener('dragend', (event: any) => {
                        const lat = event.latLng.lat()
                        const lng = event.latLng.lng()

                        AddressGeocode(lat, lng)
                            .then(result => {
                                const { address } = result
                                item.address = address || ""
                                item.lat = lat
                                item.lng = lng
                                setLista((pre) => [...pre.slice(0, i), item, ...pre.slice(i + 1)])
                            })
                    })

                    marker.addListener('dblclick', (event: any) => {
                        const lat = event.latLng.lat()
                        const lng = event.latLng.lng()
                        setLista((pre) => [...pre.slice(0, i), ...pre.slice(i + 1)])

                    })
                })
            }

            return () => {
                if (ref.current && mapRef.current) {
                    eventDoubleClick.remove()
                    eventZoomChanged.remove()
                    gEventOverlayComplete.remove()
                    polygonListeners.forEach(x => {
                        x.remove()
                    })
                }

            }
        }
    }, [cor, polygons, lista, center, zoom])


    useEffect(() => {
        geocodeByPlaceId('ChIJW6AIkVXemwARTtIvZ2xC3FA') // Place ID do Rio de Janeiro
            .then(results => {
                const { lat, lng } = results[0].geometry.location;
                setLocal({ lat: lat(), lng: lng() });
            })
            .catch(error => console.error(error));
    }, []);

    return (

        <main>
            <Enviar
                isOpen={isSendOpen}
                onCancel={handleCancelSendClick}
            ></Enviar>

            <ImportShape
                isModalOpen={isModalOpen}
                dia={dia}
                handleSubmit2={handleSubmit2}
                handleConfirmImportClick={handleConfirmImportClick}
                register2={register2}
                getPolygonsByDate={getPolygonsByDate}
                setListaPoligonosImport={setListaPoligonosImport}
                errors2={errors2}
                handleCancelImportClick={handleCancelImportClick}
                listaPoligonosImport={listaPoligonosImport}
                MapasSelectOnChange={MapasSelectOnChange}
            ></ImportShape>


            <Actions
                eye={eye}
                setEye={setEye}
                clearAll={clearAll}
                setIsModalOpen={setIsModalOpen}
                removeSelectedPolygon={removeSelectedPolygon}
                setIsSendlOpen={setIsSendlOpen}
            ></Actions>

            {!eye &&
                <div className='w-full h-12 mr-5 pr-3 pl-3 pt-2 z-0'>
                    <GooglePlacesAutocomplete

                        autocompletionRequest={{
                            location: local,
                            radius: 20000, // em metros
                        }}

                        apiKey="AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY"
                        selectProps={{
                            placeholder: "Procure um local...",
                            onChange: (item: any) => {
                                const { label } = item
                                console.log(label)
                                ReverseGeocode(label)
                                    .then(response => {

                                        setZoom(15)

                                        if (response.data.status === 'OK') {
                                            const { lat, lng } = response.data.results[0].geometry.location
                                            setCenter(new google.maps.LatLng(lat, lng))
                                        }
                                    })
                            },
                        }}
                    />
                </div>
            }


            <div className='m-4'>
                <div className='grid grid-cols-12 print:grid-cols-1 gap-4'>
                    {!eye && <div className='col-span-2'>


                        <label>Título do Mapa</label>
                        <input
                            value={titulo ? titulo : ""}
                            className='w-full h-8 border outline-none rounded-md p-2 mb-2'
                            onChange={(item) => {
                                item.target.value = item.target.value.toString().toUpperCase()
                                item && setTitulo(item.target.value)
                            }}
                        ></input>

                        <label>ID do Mapa</label>
                        <input
                            className='w-full h-8 border outline-none rounded-md p-2 mb-2'
                            value={id ? id : ""}
                            onChange={() => { }}
                            disabled
                        ></input>

                        <div className='print:hiden'>
                            <label className='mt-3 first-letter:'>Cor do Polígono</label>
                            <SliderPicker
                                color={cor}
                                onChangeComplete={handleChangeComplete}
                                onChange={(data) => {
                                    const { hex } = data
                                    if (hex != '#000000') {
                                        setCor(hex)
                                    }
                                }}
                            />
                        </div>


                        <div className='text-center mt-10'>
                            <label >Fiscais empregados</label>
                            <input
                                disabled
                                className='w-full h-8 border outline-none rounded-md p-2 text-center'
                                value={somaQuantidades(lista)}
                            ></input>
                        </div>

                        <div className='flex justify-center items-center mt-20'>
                            <button
                                className='w-16 h-16 mb-2 bg-green-700 rounded-full hover:bg-green-300 hover:text-red-900 text-white '
                                onClick={() => {
                                    formataDadoDeEnvio()
                                }}
                            >salvar</button>
                        </div>
                        {showMessage && <span className='text-red-700 text-center'>Dados incompletos</span>
                        }

                    </div>}

                    <div ref={ref} className={`${!eye ? 'col-span-10' : 'col-span-12'} w-full h-full`} style={{ height: '70vh', width: '100%' }} />
                </div>


                {isLoading && <div className='flex justify-center items-center'><Loading /></div>}
            </div>

            <main>
                <div className='flex justify-center'>
                    <table className='m-4 border w-full'>
                        <thead>
                            <tr className='flex flex-row border'>
                                <th className='w-40 flex justify-center boder'>Ponto</th>
                                <th className='w-full text-center border'>Local</th>
                                <th className='w-40 flex justify-center boder'>Fiscais</th>
                                <th className='w-40 flex justify-center border print:hidden'>@</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map((x: IFiscais, key: number) => (
                                <tr key={`${x.address + 'tr'}`} className='flex flex-row'>
                                    <td key={`${x.address + 'key'}`} className='w-40 flex justify-center items-center border'>{`${key + 1}`}</td>
                                    <td key={`${x.address}`} className='w-full flex justify-start border'>{x.address}</td>

                                    <td key={`${x.address + x.quantidade.toString()}`} className='w-40 flex justify-center items-center border'>
                                        <input
                                            type="number"
                                            className='w-full text-center'
                                            defaultValue={x.quantidade}
                                            onChange={(item) => {
                                                const newValue = Number(item.target.value)
                                                lista[key].quantidade = newValue
                                                const list = lista[key]
                                                setLista(pre => [...pre.slice(0, key), list, ...pre.slice(key + 1)])
                                            }}
                                        ></input>
                                    </td>

                                    <td key={x.address + 'td'} className='w-40 flex justify-center items-center border print:hidden'>
                                        <span
                                            key={x.address + 'span'}
                                            className='text-cyan-800 hover:text-red-700 underline'
                                            onClick={() => {
                                                const novalista = lista.filter(k => k.address !== x.address)
                                                setLista(novalista)
                                            }}
                                        >remover</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </main >
    )
}

export default CriarMapa