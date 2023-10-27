import { useCallback, useState } from "react"

interface ChecksOrdensComponenteProps {
    setStatus: React.Dispatch<React.SetStateAction<boolean>>,
    status: boolean,
}

const ChecksCacambasComponente: React.FC<ChecksOrdensComponenteProps> = ({
    status,
    setStatus
}) => {

    /**
     * Faz o toggle do estado do checkbox status
     */
    const handleClick = useCallback(() => {
        setStatus(pre => !pre)
    }, [])



    return (
        <div className="flex items-center justify-center">
            <div className="col-span-2 flex items-center justify-center">
                <input
                    checked={status}
                    type="checkbox"
                    className="h-4 w-4 rounded-full"
                    onChange={handleClick}
                ></input>
                <label className="ml-1 mt-2">Encerrados</label>
            </div>
        </div>
    )
}

export default ChecksCacambasComponente