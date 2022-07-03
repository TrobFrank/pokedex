async function PokedexAPI(searchBy, endpoint, name, number, limit, offset){
    let fetchURL     = `https://pokeapi.co/api/v2/${endpoint}`;
    switch(searchBy) {
        case 'name':
        default:
            fetchURL += `/${name}`;
            break;
        case 'number':
            fetchURL += `/${number}`;
            break;            
        case 'range':
            fetchURL += `?limit=${limit}&offset=${offset}`;
            break;
        case 'generation':
            fetchURL += `/${number}`;
            break;
        case 'speciesData':
            fetchURL += `?offset=${offset}&limit=${limit}`;
            break;  
        case 'typeList':
        case 'generationList':
            fetchURL += `/`; //by default api returns a list
            break;                                 
    }
    //console.log('url from PokedexAPI: ', fetchURL);
    let res     = await fetch(fetchURL);
    let resData = await res.json();
    //console.log('resData from PokedexAPI: ', resData);
    return resData;
}

export default PokedexAPI;