import { toast } from "react-toastify";

export function createOption(label: string) {
    return ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    })
}


export const notify = (message: string) => toast(message,
    {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    })


/**
 * Formata uma data no formato "yyyy-mm-dd" para o formato "dd-mm-yyyy".
 *
 * @param {string} data - A data no formato "yyyy-mm-dd".
 * @returns {string} A data formatada no formato "dd-mm-yyyy".
 */
export function formataData(data: string): string {
    const yy = data.substring(0, 4);
    const mm = data.substring(5, 7);
    const dd = data.substring(8);
    return `${dd}-${mm}-${yy}`;
};

export function refreshPage() {
    window.location.reload()
}


export const relatoresGroup = [
    { grupo: 'Alpha', valor: 0 },
    { grupo: 'Bravo', valor: 1 },
    { grupo: 'Charlie', valor: 2 },
    { grupo: 'Delta', valor: 3 },
    { grupo: 'Echo', valor: 4 },
    { grupo: 'Omega', valor: 5 }
]

export function ordenaListaRelatoresGroup(lista: string[]): string[] {
    return lista.sort((a, b) => {
        const aIndex = relatoresGroup.findIndex(obj => obj.grupo === a)
        const bIndex = relatoresGroup.findIndex(obj => obj.grupo === b)
        return aIndex - bIndex
    })
}


export function removerElementosRepetidos(lista: string[]): string[] {
    const conjunto = new Set<string>(lista);
    return [...conjunto];
}

