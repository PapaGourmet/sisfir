import React from "react"

interface OrientarProps {
    orientacao: string
    setOrientacao: (value: string) => void
}


const Orientar: React.FC<OrientarProps> = ({ orientacao, setOrientacao }) => {
    return (
        <div className="flex grid-cols-1 items-center justify-center text-sm">
            <div className="w-full mx-8">
                <label htmlFor="orientar">Orientações</label>
                <textarea
                    className="form-control"
                    id="orientar"
                    rows={3}
                    value={orientacao}
                    onChange={(item) => {
                        setOrientacao(item.target.value)
                    }}
                ></textarea>
            </div>
        </div>
    )
}

export default Orientar