interface RelatorProps {
    responsavel: string;
}

const Relator: React.FC<RelatorProps> = ({ responsavel }) => {
    return (
        <div className="flex grid-cols-1 items-center justify-center mx-8">
            <div className="w-full">
                <label htmlFor="responsavel">Relatório</label>
                <input
                    type="text"
                    value={responsavel ? responsavel : ''}
                    className="form-control disabled:bg-blue-50"
                    id="responsavel"
                    disabled
                ></input>
            </div>
        </div>
    );
}

export default Relator