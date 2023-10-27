import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"


interface menuProps {
    setTitle: React.Dispatch<React.SetStateAction<string | null>>
}


const Menu: React.FC<menuProps> = ({ setTitle }) => {
    const selectRefCliente = useRef<HTMLSelectElement>(null)
    const selectRefCacamba = useRef<HTMLSelectElement>(null)
    const selectRefManejo = useRef<HTMLSelectElement>(null)
    const navigate = useNavigate()
    const handleSelectClickCliente = (item: any) => {
        if (selectRefCliente) {
            if (item) {
                const { value } = item.target
                switch (value) {
                    case 'a':
                        setTitle("CADASTRAR CLIENTE")
                        localStorage.setItem("menu", "CADASTRAR CLIENTE")
                        navigate('/cacambas/clientes')
                        break
                    case 'd':
                        setTitle("ATUALIZAR CLIENTE")
                        localStorage.setItem("menu", "ATUALIZAR CLIENTE")
                        navigate('/cacambas/clientes/atualizar')
                        break
                    case 'e':
                        setTitle("INATIVAR CLIENTE")
                        localStorage.setItem("menu", "INATIVAR CLIENTE")
                        navigate('/cacambas/clientes/remover')
                        break
                    case 'j':
                        setTitle("REATIVAR CLIENTE")
                        localStorage.setItem("menu", "REATIVAR CLIENTE")
                        navigate('/cacambas/clientes/reativar')
                        break
                    default:
                        break
                }

            }

            selectRefCliente.current!.selectedIndex = 0 // Redefine o valor selecionado para o primeiro item

        }
    }

    const handleSelectClickCacamba = (item: any) => {
        if (selectRefCacamba) {
            if (item) {
                const { value } = item.target
                switch (value) {
                    case 'b':
                        setTitle("POSICIONAR CACAMBA")
                        localStorage.setItem("menu", "POSICIONAR CACAMBA")
                        navigate('/cacambas/cadastro')
                        break
                    case 'f':
                        setTitle("CAÇAMBAS POSICIONADAS")
                        localStorage.setItem("menu", "CAÇAMBAS POSICIONADAS")
                        navigate('/cacambas/listar')
                        break
                    case 'g':
                        setTitle("REGISTRAR CAÇAMBAS")
                        localStorage.setItem("menu", "REGISTRAR CAÇAMBAS")
                        navigate('/cacambas/modulo/registrar')
                        break
                    case 'h':
                        setTitle("INATIVAR CAÇAMBAS")
                        localStorage.setItem("menu", "INATIVAR CAÇAMBAS")
                        navigate('/cacambas/modulo/remover')
                        break
                    case 'i':
                        setTitle("REATIVAR CAÇAMBAS")
                        localStorage.setItem("menu", "REATIVAR CAÇAMBAS")
                        navigate('/cacambas/modulo/reativar')
                        break
                    default:
                        break
                }

            }

            selectRefCacamba.current!.selectedIndex = 0 // Redefine o valor selecionado para o primeiro item

        }
    }

    const handleSelectClickManejo = (item: any) => {
        if (selectRefManejo) {
            if (item) {
                const { value } = item.target
                switch (value) {
                    case 'c':
                        setTitle("MANEJAR CAÇAMBAS")
                        localStorage.setItem("menu", "MANEJAR CAÇAMBAS")
                        navigate('/cacambas/modulo/manejar')
                        break

                    default:
                        break
                }

            }

            selectRefManejo.current!.selectedIndex = 0 // Redefine o valor selecionado para o primeiro item

        }
    }


    return (
        <div className="flex flex-col w-full gap-y-2 md:flex-row md:gap-x-24">
            <select
                ref={selectRefCliente}
                className="text-white bg-blue-950 px-4 py-2 rounded outline-none w-full md:w-52 space-y-2"
                onClick={handleSelectClickCliente}>
                <option hidden>Clientes</option>
                <option value="a">cadastrar cliente</option>
                <option value="d">atualizar cliente</option>
                <option value="e">inativar cliente</option>
                <option value="j">reativar cliente</option>
            </select>

            <select
                ref={selectRefCacamba}
                className="text-white bg-blue-950 px-4 py-2 rounded outline-none w-full md:w-52 space-y-2"
                onClick={handleSelectClickCacamba}>
                <option hidden>Caçambas</option>
                <option value="g">registrar caçambas</option>
                <option value="h">inativar caçambas</option>
                <option value="i">reativar caçambas</option>
                <option value="b">posicionar caçamba</option>
                <option value="f">caçambas posicionadas</option>
            </select>


            <select
                ref={selectRefManejo}
                className="text-white bg-blue-950 px-4 py-2 rounded outline-none w-full md:w-52 space-y-2"
                onClick={handleSelectClickManejo}>
                <option hidden>Operação</option>
                <option value="c">manejar caçambas</option>
            </select>

        </div>)

}

export default Menu