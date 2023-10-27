import { useContext, useEffect, useState } from "react"
import { sisfirContext } from "../../context/sisfircontext"
import { MotivacaoComponent } from "./componentes/motivacao"
import { SegmentoComponent } from "./componentes/segmento"
import { TipoComponent } from "./componentes/tipo"
import { UnidadesComponent } from "./componentes/unidade"
import { AutocompleteComponent } from "./componentes/autocomplete"
import { LocalComponent } from "./componentes/local"
import { DataComponent } from "./componentes/data"
import { InicioComponent } from "./componentes/inicio"
import { FimComponent } from "./componentes/fim"
import { RelatorComponent } from "./componentes/relator"
import { AcaoComponent } from "./componentes/acao"
import { RecursosComponent } from "./componentes/recursos"
import { FiscaisComponent } from "./componentes/fiscais"
import { ToastContainer, toast } from "react-toastify"
import { formataData, notify, refreshPage } from "./componentes/util"
import { getLocalTimeInSaoPauloMilliseconds } from "../maps/utils/utils"
import { GetNumeroOrdem } from "../../services/servicesApi"
import { FirestoreOrdemService } from "./services/firestoreordemservice"
import { OrdemService } from "./interfaces/iordemservice"
import { CopiarComponent } from "./componentes/copiar"
import { IntegracaoComponent } from "./componentes/integracao"
import { EditarComponent } from "./componentes/editar"
import { faBullseye } from "@fortawesome/free-solid-svg-icons"
const _service = new FirestoreOrdemService()
const service = new OrdemService(_service)

const NewOrderPage: React.FC = () => {
    const { setOrdem, ordem, dataOS, setDataOS, setEquipes } = useContext(sisfirContext)
    const [isLoading, setIsLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showCopy, setShowCopy] = useState(false)
    const [showEdit, setShowEdit] = useState(false)


    const test = () => {
        let fields = ['tipo', 'segmento', 'unit', 'motivacao', 'local', 'inicio', 'fim', 'acao', 'integracao', 'recursos', 'equipe']

        for (const key in ordem) {
            if (ordem.hasOwnProperty(key)) {
                fields = fields.filter(x => x !== key)
            }
        }

        if (ordem.equipe?.length === 0) {
            notify('Escolha os fiscais da OS')
            return
        }


        if (!!fields.length) {
            const pop = fields.pop()
            let missing
            if (fields.length === 0) {
                missing = pop
            } else {
                missing = fields.join(', ').replace('unit', 'unidade').concat(' e ', pop!, ',')
            }

            const message = `${fields.length === 0 ? 'Campo' : 'Campos'} ${missing} sem preenchimento`
            notify(message)
            return
        }

        if (ordem.segmento?.length === 0) {
            notify('Escolha o segmento da OS')
            return
        }

        if (ordem.unit?.length === 0) {
            notify('Escolha a unidade da OS')
            return
        }

        if (ordem.motivacao?.length === 0) {
            notify('Escolha a motivação da OS')
            return
        }

        if (ordem.acao?.length === 0) {
            notify('Escolha a ação da OS')
            return
        }

        if (ordem.integracao?.length === 0) {
            notify('Escolha a integração da OS')
            return
        }

        if (ordem.recursos?.length === 0) {
            notify('Escolha os recursos da OS')
            return
        }
    }

    const handleSave = async () => {

        test()

        if (dataOS) {
            ordem['dataOrdem'] = dataOS
        }

        ordem['timestamp'] = getLocalTimeInSaoPauloMilliseconds()


        GetNumeroOrdem()
            .then(async (response: any) => {
                setIsLoading(false)
                if (response) {
                    await service.addOrdem(formataData(dataOS || ""), { ...ordem, key: response }, response)
                    //refreshPage()
                    setOrdem({})
                    setEquipes([])
                    setDataOS(null)
                    //setShowForm(false)
                }
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
            })


        console.log(ordem)


    }

    const handTypeOperation = (type: string) => {
        switch (type) {
            case 'criar':
                setOrdem({})
                setDataOS(null)
                setShowForm(true)
                setShowCopy(false)
                setShowEdit(false)
                break

            case 'copiar':
                setShowForm(false)
                setShowCopy(true)
                setShowEdit(false)
                break

            case 'editar':
                setShowForm(false)
                setShowCopy(false)
                setShowEdit(true)
                break

            default:
                break
        }
    }

    return (
        <main>

            <div className="flex flex-col px-8 mt-4">
                <label>Operação</label>
                <select
                    className="border h-10 rounded-lg p-2 outline-none"
                    defaultValue={"tipo"}
                    onChange={(item: any) => {
                        const { value } = item.target
                        handTypeOperation(value)
                    }}
                >
                    <option className='text-slate-100' value="tipo" disabled>selecione ...</option>
                    <option value={'criar'}>criar</option>
                    <option value={'editar'}>editar</option>
                    <option value={'copiar'}>copiar</option>
                </select>
            </div>

            {showCopy && <div className="flex flex-col px-8 mt-4">
                <CopiarComponent />
            </div>}

            {showEdit && <div className="flex flex-col px-8 mt-4">
                <EditarComponent setShowForm={setShowForm} />
            </div>}


            {showForm && <div className="flex flex-col p-8 w-full gap-y-4">

                <div className="flex flex-col w-full">
                    <TipoComponent />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4">
                    <div className="w-full flex flex-col">
                        <SegmentoComponent />
                    </div>
                    <div className="w-full flex flex-col">
                        <UnidadesComponent />
                    </div>
                    <div className="w-full flex flex-col">
                        <MotivacaoComponent />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <AutocompleteComponent />
                </div>

                <div className="w-full flex flex-col">
                    <LocalComponent />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                    <div className="w-full flex flex-col">
                        <DataComponent />
                    </div>

                    <div className="w-full flex flex-col">
                        <InicioComponent />
                    </div>

                    <div className="w-full flex flex-col">
                        <FimComponent />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <RelatorComponent />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                    <div className="w-full flex flex-col">
                        <AcaoComponent />
                    </div>

                    <div className="w-full flex flex-col">
                        <IntegracaoComponent />
                    </div>

                    <div className="w-full flex flex-col">
                        <RecursosComponent />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <FiscaisComponent />
                </div>

                <div className="w-full flex items-center justify-center mt-4 mb-[25rem]">
                    <button
                        className="h-20 w-20 rounded-full bg-blue-800 hover:bg-blue-600 text-white outline-none"
                        onClick={() => {
                            handleSave()
                        }}
                    >
                        Salvar
                    </button>
                </div>
            </div>}

            <ToastContainer />
        </main>
    )
}


export default NewOrderPage