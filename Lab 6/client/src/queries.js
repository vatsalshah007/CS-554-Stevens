import {gql} from '@apollo/client';


const GET_POKEMON_LIST = gql `
    query Query1($pageNum: Int!) {
        pokemons(pageNum: $pageNum) {
            next
            prev
            result {
                id
                name
                url
                imageUrl
            }
        }
    }
`;

const GET_POKEMON = gql`
    query Query2($id: Int, $searchTerm: String){
        getPokemon(id: $id, searchTerm:  $searchTerm) {
            id
            name
            url
            imageUrl
            weight
            height
            types {
                name
            }
            stats {
                name
                value
            }
        }
    }
`;

const queries = {
    GET_POKEMON,
    GET_POKEMON_LIST
}

export default queries