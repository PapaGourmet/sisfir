interface OutraMotivacaoProps {
    setMotivacao: (value: React.SetStateAction<string | undefined>) => void
}

const OutraMotivacao: React.FC<OutraMotivacaoProps> = ({ setMotivacao }) => {
    return (
        <div className="flex grid-cols-1 items-center justify-center">
            <div className="w-full mx-8">
                <label htmlFor="motivacao-outros">Outra motivação</label>
                <input
                    type="text"
                    className="form-control"
                    id="motivacao-outros"
                    placeholder="Informe a motivação"
                    onChange={(item) => {
                        const response = item.target.value.toString()
                        setMotivacao(response)
                    }}
                ></input>
            </div>
        </div>

    )
}


export default OutraMotivacao








