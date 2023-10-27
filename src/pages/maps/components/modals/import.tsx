import Modal from "react-modal"
import { IFirestoreEnvio } from "../../../../types/types"
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

interface ImportShapeProps {
    isModalOpen: boolean,
    handleSubmit2: UseFormHandleSubmit<{
        data: string;
        mapa: string;
    }>,
    handleConfirmImportClick: () => void,
    register2: UseFormRegister<{
        data: string;
        mapa: string;
    }>,
    getPolygonsByDate: (data: string) => Promise<IFirestoreEnvio[]>,
    setListaPoligonosImport: React.Dispatch<React.SetStateAction<IFirestoreEnvio[]>>,
    errors2: FieldErrors<{
        data: string;
        mapa: string;
    }>,
    dia: any,
    MapasSelectOnChange: (value: any) => void,
    listaPoligonosImport: IFirestoreEnvio[],
    handleCancelImportClick: () => void
}

const ImportShape: React.FC<ImportShapeProps> = (
    {
        isModalOpen,
        errors2,
        dia,
        listaPoligonosImport,
        handleSubmit2,
        handleConfirmImportClick,
        register2,
        getPolygonsByDate,
        setListaPoligonosImport,
        MapasSelectOnChange,
        handleCancelImportClick
    }
) => {

    return (

        <Modal
            isOpen={isModalOpen}
            ariaHideApp={false}
            className="flex w-full h-screen items-center justify-center bg-slate-500"
        >
            <form className="flex flex-col" onSubmit={handleSubmit2(handleConfirmImportClick)}>
                <label className='text-white '>Data</label>
                <input
                    type={"date"}
                    {...register2('data')}
                    className='border h-8 rounded-md text-center outline-none'
                    onChange={async (item) => {
                        if (item) {
                            const { value } = item.target
                            const response = await getPolygonsByDate(value)
                            setListaPoligonosImport(response)
                        }
                    }}

                ></input>
                {errors2.data && <span className='text-red-700'>{errors2.data.message}</span>}

                <label className='text-white mt-2'>Mapas</label>
                <select
                    value={dia ? dia : ""}
                    {...register2('mapa')}
                    className='border h-8 rounded-md outline-none'
                    onChange={(item) => {
                        if (item) {
                            const { value } = item.target
                            if (value) {
                                MapasSelectOnChange(value)
                            }
                        }
                    }}

                >
                    <option></option>
                    {listaPoligonosImport.map((data: IFirestoreEnvio, key: number) => (
                        <option key={`${data.key}`} value={key}>{data.title}</option>
                    ))}
                </select>
                {errors2.mapa && <span className='text-red-700'>{errors2.mapa.message}</span>}

                <div className="grid grid-cols-12 mt-6">
                    <div className="col-span-5">
                        <button
                            type="submit"
                            className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                            style={{
                                width: "6rem"
                            }}
                        >Sim</button>
                    </div>
                    <div className="col-span-2"></div>
                    <div className="col-span-5">
                        <button
                            type="submit"
                            className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                            style={{
                                width: "6rem"
                            }}
                            onClick={handleCancelImportClick}
                        >Cancelar</button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default ImportShape