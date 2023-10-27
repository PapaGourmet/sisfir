export function createOption(label: string) {
    return ({
        label,
        value: label.toLowerCase().replace(/\W/g, ''),
    })
}


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