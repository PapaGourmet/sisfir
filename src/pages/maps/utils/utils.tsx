import moment from 'moment-timezone'
import { Coordinate } from '../../../types/types'
import IEmployee from '../../../interfaces/iemployee'

/**
 * Calcula o centroide de um polígono irregular usando um objeto google.maps.Polygon.
 * Esta função assume que os pontos estão ordenados em sentido horário ou anti-horário.
 *
 * @param {google.maps.Polygon} polygon - Um objeto google.maps.Polygon representando o polígono desenhado.
 * @returns {Coordinate} Um objeto Coordinate representando o ponto central (centroide) do polígono.
 *
 * @example
 * const onPolygonComplete = (newPolygon) => {
 *   // ... Outras ações ...
 *
 *   // Calcula e imprime o centroide do polígono no console
 *   const polygonCentroid = getPolygonCentroid(newPolygon)
 *   console.log("Centroide do polígono:", polygonCentroid)
 * }
 */
export function getPolygonCentroid(polygon: google.maps.Polygon): Coordinate {
    const coordinates = polygon.getPath().getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
    }))

    let area = 0
    let latitudeTimesAreaSum = 0
    let longitudeTimesAreaSum = 0
    const totalPoints = coordinates.length

    for (let i = 0; i < totalPoints; i++) {

        const coord1 = coordinates[i]
        const coord2 = coordinates[(i + 1) % totalPoints]

        const partialArea = (coord1.lng * coord2.lat) - (coord1.lat * coord2.lng)
        area += partialArea

        latitudeTimesAreaSum += (coord1.lat + coord2.lat) * partialArea
        longitudeTimesAreaSum += (coord1.lng + coord2.lng) * partialArea
    }

    area /= 2

    const centroidLatitude = latitudeTimesAreaSum / (6 * area)
    const centroidLongitude = longitudeTimesAreaSum / (6 * area)

    return { lat: centroidLatitude, lng: centroidLongitude }
}

type ILista = {
    address: string
    quantidade: number
    lat: number
    lng: number
}

/**
 * Retorna a soma dos atributos `quantidade` dos objetos de uma lista do tipo ILista.
 * @function somaQuantidades
 * @param {ILista[]} lista - Lista de objetos do tipo ILista.
 * @returns {number} A soma dos atributos `quantidade` da lista fornecida.
 */
export function somaQuantidades(lista: ILista[]): number {
    return lista.reduce((total, item) => total + parseInt(item.quantidade.toString()), 0)
}

type FirestorePolygon = {
    coordinates: Coordinate[]
}

type FirestoreCoordinate = {
    lat: number
    lng: number
}

/**
 * Converte um google.maps.Polygon em um objeto que pode ser armazenado no Firestore.
 * 
 * @param {google.maps.Polygon} polygon - Um objeto google.maps.Polygon representando o polígono desenhado.
 * @returns {FirestorePolygon} Um objeto que representa o polígono e pode ser armazenado no Firestore.
 */
export function polygonToObject(polygon: google.maps.Polygon): FirestorePolygon {
    const path = polygon.getPath().getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
    }))

    return {
        coordinates: path,
    }
}

/**
 * Converte uma lista de google.maps.Polygon em uma lista de listas de objetos que podem ser armazenados no Firestore.
 * 
 * @param {google.maps.Polygon[]} polygons - Uma lista de objetos google.maps.Polygon representando os polígonos desenhados.
 * @returns {FirestoreCoordinate[][]} Uma lista de listas de objetos que representam as coordenadas dos polígonos e podem ser armazenados no Firestore.
 */
export function polygonsToObject(polygons: google.maps.Polygon[]): FirestoreCoordinate[][] {
    return polygons.map((polygon) => {
        return polygon.getPath().getArray().map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
        }))
    })
}

/**
 * Retorna a hora atual no formato 'yyyy-MM-dd', considerando a timezone de São Paulo, Brasil.
 *
 * @function getLocalTimeInSaoPaulo
 * @returns {string} A hora atual no formato 'yyyy-MM-dd'.
 * @example
 * // Obtém a hora local em São Paulo
 * const localTime = getLocalTimeInSaoPaulo()
 * console.log(localTime) // Exemplo de saída: "2023-05-01"
 */
export function getLocalTimeInSaoPaulo(): string {
    return moment().tz('America/Sao_Paulo').format('YYYY-MM-DD')
}

/**
 * Retorna o tempo atual em milissegundos, considerando a timezone de São Paulo, Brasil.
 *
 * @function getLocalTimeInSaoPauloMilliseconds
 * @returns {number} O tempo atual em milissegundos.
 * @example
 * // Obtém a hora local em São Paulo em milissegundos
 * const localTimeMilliseconds = getLocalTimeInSaoPauloMilliseconds()
 * console.log(localTimeMilliseconds) // Exemplo de saída: 1667257924532
 */
export function getLocalTimeInSaoPauloMilliseconds(): number {
    return moment().tz('America/Sao_Paulo').valueOf()
}

/**
 * Formata o tempo em milissegundos fornecido para uma string de data no timezone de São Paulo, Brasil.
 *
 * @param {number} milliseconds - Tempo em milissegundos.
 * @returns {string} Data formatada no timezone de São Paulo, Brasil.
 * @example
 * // Formata o tempo em milissegundos como uma string de data
 * const formattedDate = formatMillisecondsToDate(-22.783110202400376)
 * console.log(formattedDate) // Exemplo de saída: "Último salvamento realizado em 29-04-2023 10:34:52"
 */
export function formatMillisecondsToDate(milliseconds: number): string {
    const date = moment(milliseconds).tz('America/Sao_Paulo').format('DD-MM-YYYY HH:mm:ss')
    return `Último salvamento realizado em ${date}`
}

/**
 * Transforma uma lista de listas de objetos do tipo Coordinate em uma lista de objetos LineString no formato GeoJSON.
 *
 * @param {Coordinate[][]} coordinatesList - Uma lista de listas de objetos do tipo Coordinate.
 * @returns {object[]} Retorna uma lista de objetos LineString no formato GeoJSON.
 */
export function coordinatesListToLineStrings(coordinatesList: Coordinate[][]): object[] {
    const lineStrings = coordinatesList.map(coordinates => {
        const lineString = {
            type: "LineString",
            coordinates: coordinates.map((coord) => [coord.lng, coord.lat]),
        }

        return lineString
    })

    return lineStrings
}

/**
 * Gera uma string de parâmetros de consulta a partir de um array.
 *
 * @param paramName - O nome do parâmetro de consulta.
 * @param array - O array que você deseja converter em parâmetros de consulta.
 * @returns Uma string de parâmetros de consulta com os valores do array.
 */
export function arrayToUrl(paramName: string, array: string[]): string {
    const queryParams = array
        .map(
            (value) => `${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`
        )
        .join('&')
    return queryParams
}

/**
 * Converte uma data no formato "yyyy-mm-dd" para o formato "dd-mm-yyyy".
 *
 * @param {string} dateString - A data no formato "yyyy-mm-dd" como string.
 * @returns {string} A data convertida no formato "dd-mm-yyyy".
 */
export function convertDateFormat(dateString: string | undefined): string {
    const dateParts = dateString!.split("-")

    const year = dateParts[0]
    const month = dateParts[1]
    const day = dateParts[2]

    return `${day}-${month}-${year}`
}

/**
 * Retorna um número aleatório entre 1/10.000 e 4/10.000 e soma a 5/100.000
 * 
 * @returns {number} Um número aleatório entre 1/100.000 e 9/100.000.
 */
export function randomFraction(): number {
    const minFraction = 1 / 10000
    const maxFraction = 4 / 10000

    const randomNumber = Math.random() * (maxFraction - minFraction) + minFraction
    return randomNumber + 5 / 10000
}

/**
 * Concatena os elementos de uma lista de strings em uma única string,
 * separados por vírgulas.
 *
 * @param {string[]} stringList - Uma lista de strings.
 * @returns {string} Uma única string com os elementos da lista concatenados e separados por vírgulas.
 */
export function concatenateStrings(stringList: string[] | undefined): string {
    return stringList!.join(',');
}

/**
 * Concatena os nomes dos funcionários de uma lista de objetos do tipo IEmployee,
 * separados por vírgulas.
 *
 * @param {IEmployee[]} employeeList - Uma lista de objetos do tipo IEmployee.
 * @returns {string} Uma única string com os nomes dos funcionários concatenados e separados por vírgulas.
 */
export function concatenateEmployeeNames(employeeList: IEmployee[] | undefined): string {
    // Mapear a lista de objetos para extrair a propriedade 'name'
    const nameList = employeeList!.map(employee => employee.name);

    // Usar o método 'join()' para concatenar os nomes
    return nameList.join(', ');
}


/**
 * Reverte a data fornecida no formato "dd-mm-yyyy" para o formato "yyyy-mm-dd".
 *
 * @param {string} date - A data no formato "dd-mm-yyyy".
 * @returns {string} A data invertida no formato "yyyy-mm-dd".
 */
export function reverseDate(date: string): string {
    const dateParts = date.split('-');

    if (dateParts.length !== 3) {
        throw new Error('A data fornecida não está no formato "dd-mm-yyyy".');
    }

    const [day, month, year] = dateParts;
    return `${year}-${month}-${day}`;
}

/**
 * Incrementa uma data específica pelo número de dias fornecidos.
 * 
 * @param {number} days - O número de dias a serem adicionados à data.
 * @returns {string} Uma string que representa a data incrementada no formato ISO 8601.
 */
export function addDays(days: number): string {
    const date = moment.tz("2023-03-18", "YYYY-MM-DD", "America/Sao_Paulo")
    date.add(days, 'days')
    return date.format("DD-MM-YYYY")
}


/**
 * Calcula a diferença em dias entre a data de 18-03-2023 e a data atual na zona horária de São Paulo.
 *
 * @returns {number} A diferença em dias.
 */
export function calculateDaysDifference(): number {
    const targetDate = moment.tz('2023-03-18', 'YYYY-MM-DD', 'America/Sao_Paulo');
    const currentDate = moment.tz(new Date(), 'America/Sao_Paulo');

    return currentDate.diff(targetDate, 'days');
}

/**
 * Decrementa uma data específica pelo número de dias fornecidos.
 * 
 * @param {number} days - O número de dias a serem subtraídos da data.
 * @returns {string} Uma string que representa a data decrementada no formato ISO 8601.
 */
export function subtractDays(days: number): string {
    const date = moment.tz(new Date(), "America/Sao_Paulo")
    date.subtract(calculateDaysDifference() - days, 'days')
    return date.format("DD-MM-YYYY")
}

/**
 * Converte duas datas no formato "DD-MM-YYYY" para milissegundos na zona horária de São Paulo, Brasil.
 * 
 * @param {string} date1 - A primeira data no formato "DD-MM-YYYY".
 * @param {string} date2 - A segunda data no formato "DD-MM-YYYY".
 * @returns {number[]} Um array contendo os valores das datas convertidas para milissegundos.
 */
export function convertDatesToMilliseconds(date1: string, date2: string): number[] {
    const format = "DD-MM-YYYY";

    const moment1 = moment.tz(date1, format, "America/Sao_Paulo");
    const moment2 = moment.tz(date2, format, "America/Sao_Paulo");

    return [moment1.valueOf(), moment2.valueOf()];
}

/**
 * Gera uma lista de strings de datas no formato "YYYY-MM-DD" para cada dia entre as duas datas fornecidas.
 * 
 * @param {number[]} dateRange - Um array contendo duas datas em milissegundos.
 * @returns {string[]} Um array de strings, cada uma representando uma data no formato "YYYY-MM-DD".
 */
export function generateDateList(dateRange: number[]): string[] {
    const startDate = moment(dateRange[0]);
    const endDate = moment(dateRange[1]);

    const dateList: string[] = [];

    for (let date = startDate; date.isSameOrBefore(endDate); date.add(1, 'days')) {
        dateList.push(date.format('YYYY-MM-DD'));
    }

    return dateList;
}


/**
 * Retorna a data atual na zona horária de São Paulo formatada como "DD-MM-YYYY".
 *
 * @returns {string} A data atual formatada.
 */
export function getCurrentDateSaoPauloCluster(): string {
    const currentDate = moment.tz(new Date(), 'America/Sao_Paulo');

    return currentDate.format('DD-MM-YYYY');
}


/**
* Transforma uma lista de objetos LineString no formato GeoJSON em uma lista de objetos do tipo google.maps.Polygon.
*
* @param {object[]} lineStrings - Uma lista de objetos LineString no formato GeoJSON.
* @param {string} fillColor - A cor de preenchimento dos polígonos. (opcional)
* @param {string} strokeColor - A cor da linha dos polígonos. (opcional)
*/
export function lineStringsToPolygons(
    lineStrings: object[],
    fillColor: string,
    strokeColor: string
): google.maps.Polygon[] {

    const response: google.maps.Polygon[] = []


    return response

}

/**
 * Converte um número de milissegundos em uma data no formato 'yyyy-mm-dd'.
 * @param {number} milissegundos - O número de milissegundos a ser convertido.
 * @returns {string} A data no formato 'yyyy-mm-dd'.
 */
export function converterMilissegundosParaData(milissegundos: number): string {
    const saoPaulo = moment.tz(milissegundos, 'America/Sao_Paulo');
    const data = saoPaulo.format('YYYY-MM-DD');
    return data;
}


