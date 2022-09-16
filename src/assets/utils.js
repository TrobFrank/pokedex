
const FILTERS = {
    SORT_BY: {
        LOW: 'low',
        HIGH: 'high',
        AZ: 'az',
        ZA: 'za'
    }
}

const ENDPOINTS = {
    baseURL: 'https://pokeapi.co/api/v2/',
    pokemon: 'pokemon',
    species: 'pokemon-species',
    generation: 'generation',
    type: 'type'
}

const MAXCOUNT = 898;

const fnGetIdFromURL = function(str){
    var pathList = str.split('/');
    return pathList[pathList.length - 1] < 1 ? pathList[pathList.length - 2] : pathList[pathList.length - 1] ; //trailing slash or not
}

export { FILTERS, ENDPOINTS, MAXCOUNT }
export { fnGetIdFromURL }