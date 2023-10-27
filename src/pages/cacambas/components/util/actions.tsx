import moment from 'moment-timezone'
import 'moment-timezone';

/**
 * Calcula a diferença em horas entre um tempo em milissegundos e a hora atual do sistema,
 * retornando códigos de cores específicos com base na diferença.
 * @param {number} tempoMilissegundos - O valor de tempo em milissegundos.
 * @returns {string} O código de cor correspondente à diferença em horas.
 */
export function calcularDiferencaHoras(tempoMilissegundos: number): string {
    const fusoHorario = 'America/Sao_Paulo';

    const tempoMoment = moment(tempoMilissegundos).tz(fusoHorario);
    const horaAtual = moment().tz(fusoHorario);

    const diferencaHoras = horaAtual.diff(tempoMoment, 'hours');

    if (diferencaHoras < 24) {
        return '008000'; // Verde escuro
    } else if (diferencaHoras >= 20 && diferencaHoras < 48) {
        return 'FFD700'; // Dourado
    } else {
        return '8B0000'; // Vermelho escuro
    }
}


/**
 * Converte uma data e hora em milissegundos, considerando o fuso horário de São Paulo.
 * @param {string} data - A data no formato 'yyyy-mm-dd'.
 * @param {string} hora - A hora no formato 'HHmm'.
 * @returns {number} O valor em milissegundos.
 */
export function converterParaMilissegundos(data: string, hora: string): number {
    const dataHora = `${data} ${hora}`;
    const formato = 'YYYY-MM-DD HHmm';
    const fusoHorario = 'America/Sao_Paulo';

    const dataHoraMoment = moment.tz(dataHora, formato, fusoHorario);
    const milissegundos = dataHoraMoment.valueOf();

    return milissegundos;
}

/**
 * Converte um tempo em milissegundos para o formato 'DD/MM/YYYY [as] HH:mm' considerando o fuso horário de São Paulo.
 * @param {number} tempoMilissegundos - O valor de tempo em milissegundos.
 * @returns {string} O tempo formatado no formato 'DD/MM/YYYY [as] HH:mm'.
 */
export function converterTempoMilissegundosParaFormato(tempoMilissegundos: number): string {
    const fusoHorario = 'America/Sao_Paulo';
    const formato = 'DD/MM/YYYY [as] HH:mm';

    const tempoMoment = moment(tempoMilissegundos).tz(fusoHorario);
    const tempoFormatado = tempoMoment.format(formato);

    return tempoFormatado;
}

/**
 * Calcula a diferença em horas entre um tempo em milissegundos e a data do sistema, considerando a timezone de São Paulo.
 * @param {number} tempoMilissegundos - O valor de tempo em milissegundos.
 * @returns {string} A diferença em horas entre o tempo e a data do sistema no formato `${resultado} horas`.
 */
export function calcularDiferenca(tempoMilissegundos: number): string {
    const fusoHorario = 'America/Sao_Paulo';

    const tempoMoment = moment(tempoMilissegundos).tz(fusoHorario);
    const dataAtual = moment().tz(fusoHorario);

    const diferencaHoras = dataAtual.diff(tempoMoment, 'hours');

    return `${diferencaHoras} horas`;
}

/**
 * Formata um nome próprio com sobrenome, colocando a primeira letra de cada sentença em caixa alta.
 * @param {string} nomeCompleto - O nome próprio com sobrenome.
 * @returns {string} O nome formatado.
 */
export function formatarNome(nomeCompleto: string): string {
    const palavras: string[] = nomeCompleto.split(' ');
    const nomeFormatado: string = palavras
        .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(' ');
    return nomeFormatado;
}