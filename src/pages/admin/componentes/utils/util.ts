/**
 * Função que concatena os atributos label de uma lista do tipo IListProps.
 * @param {IListProps[]} lista - A lista de objetos do tipo IListProps.
 * @returns {string} - A string com os atributos label concatenados.
 */
export function concatenarLabels(lista: any): string {
    return lista.map((item: any) => item.label).join(", ");
}

/**
 * Formata um nome próprio, colocando a primeira letra de cada sentença em caixa alta.
 * @param {string} name - O nome próprio a ser formatado.
 * @returns {string} O nome formatado com a primeira letra de cada sentença em caixa alta.
 */
export function formatName(name: string): string {
    const sentences = name.toLowerCase().split(" ");
    const formattedSentences = sentences.map((sentence) => {
        const firstLetter = sentence.charAt(0).toUpperCase();
        const restOfSentence = sentence.slice(1);
        return firstLetter + restOfSentence;
    });
    return formattedSentences.join(" ");
}
