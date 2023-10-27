import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";


export const LocalComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, local: value })
        }
    }

    const handleClear = () => {
        const { local, ...rest } = ordem!
        setOrdem(rest)
    }

    return (
        <div className="flex flex-row w-full gap-x-8">
            <div className="flex flex-col w-11/12">
                <label>Local</label>
                <textarea
                    value={ordem?.local ? ordem.local : ""}
                    className="border rounded-lg p-2 outline-none"
                    rows={3}
                    disabled
                    onChange={(item: any) => {
                        const { value } = item.target
                        handleChange(value)
                    }}
                >
                </textarea>
            </div>
            <div className="flex flex-col w-1/12 items-center justify-center">
                <label className="text-white">.</label>
                <button
                    className="border p-3 rounded-lg hover:bg-blue-400 bg-blue-800 text-white font-bold outline-none"
                    onClick={() => handleClear()}
                >limpar</button>
            </div>
        </div>
    )
}