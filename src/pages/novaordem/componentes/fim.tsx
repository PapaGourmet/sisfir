import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";

export const FimComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, fim: value })
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label>Fim</label>
            <input
                value={ordem.fim ? ordem.fim : ""}
                type="time"
                className="border rounded-lg p-2 outline-none"
                onChange={(item: any) => {
                    const { value } = item.target
                    handleChange(value)
                }}
            >
            </input>
        </div>
    )
}