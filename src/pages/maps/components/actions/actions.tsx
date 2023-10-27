import { faDrawPolygon, faTrash, faEye, faEyeSlash, faPrint, faRotate, faUpload, faCheck, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../../../../bundles/toolstip/toolstip'

interface IActionsProps {
    eye: boolean,
    setEye: React.Dispatch<React.SetStateAction<boolean>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setIsSendlOpen: React.Dispatch<React.SetStateAction<boolean>>,
    clearAll: () => void,
    removeSelectedPolygon: () => void
}

const Actions: React.FC<IActionsProps> = ({ eye, setEye, clearAll, setIsModalOpen, setIsSendlOpen, removeSelectedPolygon }) => {
    return (
        <div className='grid grid-cols-12'>
            <div className="col-span- flex items-center justify-center bg-blue-950 text-white font-bold p-2">

                <div className='flex items-center justify-center col-span-1  bg-blue-950 text-white font-bold p-2 print:hidden'>
                    <Tooltip content={`${eye ? 'mostrar menu' : 'ocultar menu'}`}>
                        <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={eye ? faEye : faEyeSlash} size={'lg'} onClick={() => setEye(eye => !eye)} />
                    </Tooltip>
                </div>

            </div>
            <div className="col-span-1 flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <div className='flex items-center justify-center col-span-1  bg-blue-950 text-white font-bold p-2 print:hidden'>
                    <Tooltip content='importar'>
                        <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faCloudArrowDown} size={'lg'} onClick={() => {
                            clearAll()
                            setIsModalOpen(true)
                        }} />
                    </Tooltip>
                </div>
            </div>
            <div className="col-span-1 flex items-center justify-center bg-blue-950 text-white font-bold p-2 print:hidden">
                <Tooltip content='remover polígonos'>
                    <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faTrash} size={'lg'} onClick={() => {
                        removeSelectedPolygon()
                    }} />
                </Tooltip>
            </div>
            <div className="col-span-6 flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>PLANEJAR OPERAÇÕES</h1>
            </div>

            <div className='flex items-center justify-center col-span-1  bg-blue-950 text-white font-bold p-2 print:hidden'>
                <Tooltip content='resetar'>
                    <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faRotate} size={'lg'} onClick={() => clearAll()} />
                </Tooltip>
            </div>
            <div className='flex items-center justify-center col-span-1  bg-blue-950 text-white font-bold p-2 print:hidden'>
                <Tooltip content='imprimir'>
                    <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faPrint} size={'lg'} onClick={() => {
                        setEye(true)
                        setTimeout(() => {
                            window.print()
                        }, 200)
                    }} />
                </Tooltip>
            </div>
            <div className='flex items-center justify-center col-span-1  bg-blue-950 text-white font-bold p-2 print:hidden'>
                <Tooltip content='enviar'>
                    <FontAwesomeIcon className='text-cyan-400 hover:text-cyan-100' icon={faUpload} size={'lg'} onClick={async () => {
                        setIsSendlOpen(true)
                    }} />
                </Tooltip>
            </div>
        </div>
    )
}


export default Actions