import React from "react"

// Crie a interface
interface BotaoSalvarProps {
    save: () => void
}

// Crie o componente "BotaoSalvar"
const BotaoSalvar: React.FC<BotaoSalvarProps> = ({ save }) => {
    return (
        <div className="flex grid-cols-1 items-center justify-center">
            <div className="w-full mx-8 flex items-center justify-center mb-20 mt-3">
                <button
                    type="button"
                    className="bg-teal-900 hover:bg-teal-600 text-white w-20 h-20 rounded-full"
                    onClick={() => save()}
                >
                    Salvar
                </button>
            </div>
        </div>
    )
}


export default BotaoSalvar