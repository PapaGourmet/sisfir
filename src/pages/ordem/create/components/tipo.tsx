interface TipoProps {
    tipo: string,
    setTipo: (value: any) => void
}

const Tipo: React.FC<TipoProps> = ({
    tipo,
    setTipo
}) => {
    return (
        <div className="flex mt-4 grid-cols-1 items-center justify-center">
            <div className="w-full mx-8">
                <label htmlFor="tipo">TIPO</label>
                <select
                    className="form-control"
                    id="tipo"
                    value={tipo ? tipo : ""}
                    onChange={(item) => {
                        item && setTipo(item.target.value)
                    }}
                >
                    <option></option>
                    <option value={'ORDINÁRIA'}>{'ORDINÁRIA'}</option>
                    <option value={'EXTRAORDINÁRIA'}>{'EXTRAORDINÁRIA'}</option>
                </select>
            </div>
        </div>
    )
}

export default Tipo