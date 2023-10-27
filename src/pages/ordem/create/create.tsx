import { useEffect, useRef, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseConfig from '../../../util/firebase-config'
import { useDatabaseSnapshot } from "@react-query-firebase/database"
import { ref } from "firebase/database"
import { getDatabase } from 'firebase/database'
import Loading from "../../../bundles/loading/loading"
import IEmployee from '../../../interfaces/iemployee'
import IOrdem from '../../../interfaces/iordem'
import moment from "moment"
import { GetNumeroOrdem, GetOpcoes, InsertOrdem } from "../../../services/servicesApi"
import ILocation from "../../../interfaces/location"
import IOptions from "../../../interfaces/ioptions"
import { DocumentData } from "firebase/firestore"
import Segmento from "./components/segmento"
import Unidade from "./components/unidade"
import Motivacao from "./components/motivacao"
import OutraMotivacao from "./components/outramotivacao"
import SubTitle from "../../../bundles/subtitle"
import AlertMessage from "../../../bundles/alert"
import Tipo from "./components/tipo"
import AutocompleteOrdem from "./components/autocomplete"
import Local from "./components/local"
import Data from "./components/data"
import Relator from "./components/relator"
import FiscaisDisponivies from "./components/fiscais"
import AcaoIntegracaoRecursos from "./components/acao_integracao_recursos"
import Orientar from "./components/orientar"
import BotaoSalvar from "./components/botaoSalvar"
import { formataData } from "./util"
const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)

/**
 * Lista com os valores de bases possíveis para as operações de fiscalização
 */
const list = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']

function refreshPage() {
    window.location.reload()
}

type Relator = {
    grupo: string
    valor: number
    total?: number
}

export default function Ordem() {

    /**
     * Retorna todos os empregados cadastrados
     */
    const reference = useRef<any[]>([])
    const [segmento, setSegmentos] = useState<string[]>([])

    /**
     * Retorna a lista de todos os funcionários da FCZ
     */
    const [employeees, setEmployees] = useState<IEmployee[]>([])

    /**
     * Retorna a lista dos fiscais escolhidos
     */
    const [equipe, setEquipe] = useState<IEmployee[]>([])

    /**
     * Referente ao fisacal escolhido para a ordem de serviço
     */
    const [msg, setMsg] = useState("Fiscal já escalado para a OS")
    const [style, setStyle] = useState("alert-danger")
    const [showMsg, setShowMsg] = useState(false)
    const [dataOrdem, setDataOrdem] = useState("")
    const [inicio, setInicio] = useState("")
    const [fim, setFim] = useState("")
    const [motivacao, setMotivacao] = useState<string>()
    const [unidade, setUnidade] = useState<string[]>([])
    const [acao, setAcao] = useState<string[]>([])
    const [integracao, setIntegracao] = useState<string[]>([])
    const [recursos, setRecursos] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const center = { lat: -22.9120476, lng: -43.493637 }
    const [value, setValue] = useState<any>()
    const [geocode, setGeocode] = useState<ILocation>(center)
    const [local, setLocal] = useState<any>()
    const [showOrientar, setShowOrientar] = useState(false)
    const [orientacao, setOrientacao] = useState("")
    let json
    if (localStorage.getItem('options')) {
        json = localStorage.getItem('options')
    } else {
        json = localStorage.setItem('options', JSON.stringify([]))
    }
    const [options, setOptions] = useState<IOptions | DocumentData | undefined>(JSON.parse(json!))
    const [showMotivacao, setShowMotivacao] = useState(false)
    const [tipo, setTipo] = useState<any>()
    const [responsavel, setRelator] = useState<any>()
    // Coordenadas do Rio de Janeiro
    const refEquipe = useRef()
    const refData = useRef()
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([])
    const opcoesSelecionadasAntigas = useRef([])
    const [optSegmento, setOptSegmnto] = useState(JSON.parse(json || "").segmento)
    const [optMotivacao, setOptMotivacao] = useState(JSON.parse(json || "").motivacao)
    const [optAcao, setOptAcao] = useState(JSON.parse(json || "").acao)
    const [optIntegracao, setOptIntegracao] = useState(JSON.parse(json || "").integracao)
    const [optRecursos, setOptRecursos] = useState(JSON.parse(json || "").recursos)


    useEffect(() => {
        setIsLoading(true)
        GetOpcoes()
            .then(response => {
                setIsLoading(false)
                setOptions(response)
                localStorage.setItem('options', JSON.stringify(response))
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [])


    //#region Funções
    const save = () => {
        setShowMsg(false)
        let error = false

        const veriry = [

            dataOrdem,
            inicio,
            fim,
            local,
            tipo,
            responsavel
        ]

        const veriryArrays = [
            acao,
            recursos,
            unidade,
            segmento,
            motivacao
        ]

        veriry.forEach(c => {
            if (!c) {
                setMsg("Preencha todos os campos da OS")
                setShowMsg(true)
                error = true
            }
        })

        veriryArrays.forEach(c => {
            if (!c) {
                error = true
            } else {
                if (c!.length === 0) {

                    setMsg("Preencha todos os campos da OS")
                    setShowMsg(true)
                    error = true
                }
            }
        })

        if (error) {
            return
        }

        if (equipe.length === 0) {
            setMsg("É necessário escalar ao menos um fiscal")
            setShowMsg(true)
            return
        }

        const aux: IEmployee[] = []

        equipe.forEach((x: IEmployee) => {
            //@ts-ignore
            aux.push({ name: x.name, registry: x.registry, type: x.type, unit: x.unit, role: x.role })
        })

        const timestamp = moment()
            .utcOffset('03:00')
            .valueOf()

        const ordem: IOrdem = {
            acao,
            integracao: integracao ? integracao : [""],
            motivacao,
            segmento,
            recursos,
            dataOrdem,
            inicio,
            fim,
            equipe: aux,
            timestamp,
            status: true,
            unit: unidade,
            uid: localStorage.getItem('user'),
            email: localStorage.getItem('email'),
            local,
            orientacao,
            geocode: geocode ? geocode : { lat: -22.8773119, lng: -43.2305387 },
            tipo,
            responsavel
        }

        console.log(ordem)

        setIsLoading(true)

        GetNumeroOrdem()
            .then(response => {
                setIsLoading(false)
                if (response) {
                    //@ts-ignore
                    InsertOrdem(formataData(dataOrdem), { ...ordem, key: response }, response)
                        .then(() => {
                            refreshPage()
                        })
                }
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
    }
    //#endregion

    //#region Firestore 
    const dbRef = ref(database, "employees")
    const employees = useDatabaseSnapshot(["employees"], dbRef)
    const unitRef = useRef<any[]>([])

    if (employees.isLoading) {
        return <div className='flex items-center justify-center'>
            <Loading />
        </div>
    }

    const snapshot = employees.data
    unitRef.current = [{ label: "Omega", value: "Omega" }]
    reference.current = []

    snapshot!.forEach((childSnapshot) => {
        reference.current.push(
            { ...childSnapshot.val(), label: `${childSnapshot.val().name} (${childSnapshot.val().role}) (${childSnapshot.val().unit}) (${childSnapshot.val().type})`, value: childSnapshot.val().name }
        )

        if (unitRef.current.findIndex(x => x.label === childSnapshot.val().unit) === -1) {


            if (list.indexOf(childSnapshot.val().unit) !== -1) {
                unitRef.current.push({ label: childSnapshot.val().unit, value: childSnapshot.val().unit })
            }

        }
    })
    //#endregion

    return (
        <main className="flex flex-col gap-3">
            <SubTitle title="CRIAR ORDEM DE SERVIÇO" />

            {showMsg && <AlertMessage
                msg={msg}
                style={style}
            />}

            <Tipo
                setTipo={setTipo}
                tipo={tipo}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 items-center justify-center mx-8">

                <Segmento
                    optSegmento={optSegmento}
                    setEmployees={setEmployees}
                    setSegmentos={setSegmentos}
                    setShowMsg={setShowMsg}
                    setOptSegmnto={setOptSegmnto}
                    setIsLoading={setIsLoading}
                    refEquipe={refEquipe}
                    refData={refData}
                />

                <Unidade
                    opcoesSelecionadas={opcoesSelecionadas}
                    opcoesSelecionadasAntigas={opcoesSelecionadasAntigas}
                    setEmployees={setEmployees}
                    setOpcoesSelecionadas={setOpcoesSelecionadas}
                    setRelator={setRelator}
                    setShowMsg={setShowMsg}
                    setUnidade={setUnidade}
                    unitRef={unitRef}
                    refEquipe={refEquipe}
                    refData={refData}
                />

                <Motivacao
                    optMotivacao={optMotivacao}
                    setIsLoading={setIsLoading}
                    setMotivacao={setMotivacao}
                    setOptMotivacao={setOptMotivacao}
                    setShowMotivacao={setShowMotivacao}
                />

            </div>

            {showMotivacao && <OutraMotivacao setMotivacao={setMotivacao} />}

            <AutocompleteOrdem
                local={local}
                setGeocode={setGeocode}
                setLocal={setLocal}
                value={value}
            />

            <Local
                local={local}
                setLocal={setLocal}
                setOrientacao={setOrientacao}
            />

            <Data
                refData={refData}
                refEquipe={refEquipe}
                reference={reference}
                segmento={segmento}
                setDataOrdem={setDataOrdem}
                setEmployees={setEmployees}
                setFim={setFim}
                setInicio={setInicio}
                setIsLoading={setIsLoading}
                setMsg={setMsg}
                setRelator={setRelator}
                setShowMsg={setShowMsg}
                unidade={unidade}
            />

            <Relator responsavel={responsavel} />

            <AcaoIntegracaoRecursos
                optAcao={optAcao}
                optIntegracao={optIntegracao}
                optRecursos={optRecursos}
                setAcao={setAcao}
                setIntegracao={setIntegracao}
                setRecursos={setRecursos}
                setIsLoading={setIsLoading}
                setOptAcao={setOptAcao}
                setOptIntegracao={setOptIntegracao}
                setOptRecursos={setOptRecursos}
            />

            <FiscaisDisponivies
                employeees={employeees}
                setEquipe={setEquipe}
                setShowOrientar={setShowOrientar}
                showOrientar={showOrientar}
                refData={refData}
                refEquipe={refEquipe}
            />

            {/* orientações */}
            {showOrientar && <Orientar orientacao={orientacao} setOrientacao={setOrientacao} />}

            {/* botão salvar */}
            <BotaoSalvar save={save} />

            {isLoading && <div className="flex items-center justify-center">
                <Loading />
            </div>}
        </main>
    )
}