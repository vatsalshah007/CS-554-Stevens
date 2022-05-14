const {ApolloServer, gql} = require('apollo-server');
const axios = require('axios');
const { createClient } = require('redis');
const redisClient = createClient();

// Start redis client
(async () => {
    redisClient.on('error', (err) => console.log('Redis CLient Error', err))
    await redisClient.connect();
})();
// End redis client

// Start Defining the queries, mutations and types
const typeDefs = gql`
    # All the queries
    type Query {
        pokemons(pageNum: Int!): PokemonList
        getPokemon(id: Int, searchTerm: String): Pokemons
    }

    # All the types
    type PokemonList {
        next: String
        prev: String
        result: [Pokemons]
    }

    type Pokemons {
        id: Int!
        name: String!
        url: String!
        imageUrl: String!
        height: Int
        weight: Int
        types: [Types] 
        stats: [Stats]
        caught: Boolean!
    }

    type Types {
        name: String!
    }

    type Stats {
        name: String!
        value: Int!
    }
`;
// End Defining the queries, mutations and types

// Start Resolvers
const resolvers = {
    Query: {
        pokemons: async (_, args) => {
            if(!args.pageNum) {
                args.pageNum = 0
            }
            const pageExistsInCache = await redisClient.hExists("pokemonList", Number(args.pageNum))
            if (pageExistsInCache) {
                const pageInCache = await redisClient.hGet("pokemonList", Number(args.pageNum))
                return JSON.parse(pageInCache)
            } else {
                try {
                    let offset = Number(args.pageNum) * 20
                    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
                    const result = data.results.map( x => {
                        let id = x.url.split('/')[6]
                        
                        let pokemon = {
                            id: id,
                            name: x.name,
                            url: x.url,
                            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                            caught: false
                        } 
                        return pokemon
                    })
                    let pokemonList = {
                        next: data.next,
                        prev: data.previous,
                        result: result
                    }
                    await redisClient.hSet("pokemonList", Number(args.pageNum), JSON.stringify(pokemonList))
                    return pokemonList
                } catch (e) {
                    throw e
                }
            }
        },
        getPokemon: async (_,args) => {
            try {
                if (!args.id && args.searchTerm) {
                    throw `Please provide at least an id or a searchTerm`
                }
                
                let pokemonExistsInCache
                
                if (args.id) {
                    pokemonExistsInCache = await redisClient.hExists("pokemons", Number(args.id))
                } else {
                    pokemonExistsInCache = await redisClient.hExists("pokemons", args.searchTerm)
                }

                if (pokemonExistsInCache && args.id) {
                    const pokemonInCache = await redisClient.hGet("pokemons", Number(args.id))
                    return JSON.parse(pokemonInCache)
                } else if (pokemonExistsInCache && args.searchTerm) {
                    const pokemonInCache = await redisClient.hGet("pokemons", args.searchTerm)
                    return JSON.parse(pokemonInCache)
                } else {
                    let dataFromApi
                    if (args.id) {    
                        dataFromApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${args.id}`)        
                    } else {
                        dataFromApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${args.searchTerm}`)        
                    }
                    const {data} = dataFromApi
                    const pokeData = {
                        id: data.id,
                        name: data.name,
                        url: `https://pokeapi.co/api/v2/pokemon/${data.id}`,
                        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
                        types: data.types.map(x => {
                            let type = {
                                name: x.type.name
                            }
                            return type
                        }),
                        stats: data.stats.map(x => {
                            let stat = {
                                name: x.stat.name,
                                value: x.base_stat
                            }
                            return stat
                        }),
                        height: data.height,
                        weight: data.weight,
                        caught: false,
                    }
                    if (args.id) {
                        await redisClient.hSet("pokemons", Number(args.id), JSON.stringify(pokeData))
                        await redisClient.hSet("pokemons", data.name, JSON.stringify(pokeData))
                    } else {
                        await redisClient.hSet("pokemons", Number(data.id), JSON.stringify(pokeData))
                        await redisClient.hSet("pokemons", args.searchTerm, JSON.stringify(pokeData))                
                    }
                    return pokeData
                }
            } catch (e) {
                throw e   
            }
        }
    }
}
// End Resolvers

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});