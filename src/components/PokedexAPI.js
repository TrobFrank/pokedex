async function PokedexAPI(searchType, name, number, limit, offset){
    let fetchURL     = 'https://pokeapi.co/api/v2';
    switch(searchType) {
        case 'name':
        default:
            fetchURL += `/pokemon/${name}`;
            break;
        case 'number':
            fetchURL += `/pokemon-species/${name}`;
            break;            
        case 'range':
            fetchURL += `/pokemon?limit=${limit}&offset=${offset}`;
            break;
        case 'generation':
            fetchURL += `/generation/${number}`;
            break;
        case 'generationList':
            fetchURL += `/generation/`;
            break;
    }
    //console.log('url from PokedexAPI: ', fetchURL);
    let res     = await fetch(fetchURL);
    let resData = await res.json();
    //console.log('resData from PokedexAPI: ', resData);
    return resData;
}

export default PokedexAPI;