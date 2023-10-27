import { useCallback, useState } from "react"

interface ChecksOrdensComponenteProps {
    setIsLixo: React.Dispatch<React.SetStateAction<boolean>>,
    setIsGerador: React.Dispatch<React.SetStateAction<boolean>>,
    isLixo: boolean,
    isGerador: boolean
}

const ChecksOrdensComponente: React.FC<ChecksOrdensComponenteProps> = ({
    setIsLixo,
    setIsGerador,
    isLixo,
    isGerador
}) => {

    /**
     * Faz o toggle do estado do checkbox lixo zero
     */
    const handleClickLixo = useCallback(() => {
        setIsLixo(pre => !pre)
    }, [])

    /**
     * Faz o toggle do estado do checkbox grande gerador
     */
    const handleClickGerador = useCallback(() => {
        setIsGerador(pre => !pre)
    }, [])

    return (
        <div className="grid w-full grid-cols-12">
            <div className="col-span-3"></div>
            <div className="col-span-2 flex items-center justify-center">
                <input
                    checked={isLixo}
                    type="checkbox"
                    className="h-4 w-4 rounded-full"
                    onChange={handleClickLixo}
                ></input>
                <label className="ml-1 mt-2">Lixo Zero</label>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-2 flex items-center justify-center">
                <input
                    checked={isGerador}
                    type="checkbox"
                    className="h-4 w-4 rounded-full"
                    onChange={handleClickGerador}
                ></input>


                <label className="ml-1 mt-2">Grande Gerador</label>
            </div>
            <div className="col-span-3 "></div>
        </div>
    )
}

export default ChecksOrdensComponente