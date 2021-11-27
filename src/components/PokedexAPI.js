async function PokedexAPI(searchType, name, number, limit, offset){
    let baseURL     = 'https://pokeapi.co/api/v2';
    switch(searchType) {
        case 'name':
        default:
            baseURL += '/pokemon/'+name;  
            break;
        case 'number':
            baseURL += '/pokemon-species/'+number;
            break;            
        case 'range':
            baseURL += '/pokemon?limit='+limit+'&offset='+offset;
            break;
    }
    //console.log('url from PokedexAPI: ', baseURL);
    let res     = await fetch(baseURL);
    let resData = await res.json();
    //console.log('resData from PokedexAPI: ', resData);
    return resData;
}

export default PokedexAPI;