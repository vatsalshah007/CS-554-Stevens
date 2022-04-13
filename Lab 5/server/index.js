const { createApi } = require('unsplash-js');
const {ApolloServer, gql} = require('apollo-server');
const nodeFetch = require('node-fetch');
const { createClient } = require('redis');
const uuid = require('uuid');
const redisClient = createClient();


// Unsplash api
const unsplash = createApi({ 
    accessKey: '2e_8qw8M61fLU-ka6AHGRHJ8B7VtCMnD1feBUG9LlJQ',
    fetch: nodeFetch 
});

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
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]   
    }

    # All the types
    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    # All the mutations
    type Mutation{
        uploadImage(url: String!, description: String, posterName: String): ImagePost
        updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;
// End Defining the queries, mutations and types

// Start Resolvers
const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            if (!args.pageNum) {
                args.pageNum = 1
            }
            const data  = await unsplash.photos.list({page: args.pageNum, perPage: 20})
            if (data.response.results.length == 0) {
                return []
            }
            // console.log(data.response.results[0]);
            const images = data.response.results.map(async (x) => {
                let bin = await redisClient.hGet("myBin", x.id)
                let bool = false
                if (bin) {
                    bool = true
                }
                return {
                    id: x.id,
                    url: x.urls.small,
                    posterName: x.user.name,
                    description: x.description ? x.description : `No Description`,
                    userPosted: false,
                    binned: bool,
                    // numBinned: x.likes
                }
            })
            // console.log(images);            
            return images
        },
        binnedImages: async () => {
            const binList = await redisClient.lRange("myBinList", 0, 500)
            let binnedImages = []
            for (i in binList){
                let image = await redisClient.hGet("myBin", binList[i])
                binnedImages.push(JSON.parse(image))
            }
            return binnedImages
        },
        userPostedImages: async () => {
            const userPostedImagesList = await redisClient.lRange("listUserPostedImages", 0, 500)
            if(!userPostedImagesList){
                return []
            }
            let usersImages = []
            for (i in userPostedImagesList){
                let image = await redisClient.hGet("userPostedImages", userPostedImagesList[i])
                usersImages.push(JSON.parse(image))
            }
            return usersImages
        }
        // getTopTenBinnedPosts: async () => {
        //     const binList = await redisClient.lRange("myBinList", 0, 500)
        //     if (binList) {
        //         const topBinnedImages = []
        //         JSON.parse(binList).forEach(async x => {
        //             console.log(x);
        //             let mydata = JSON.stringify(x)
        //             await redisClient.zAdd("topTenBinnedImages", {
        //                 score: x.numBinned,
        //                 value: mydata,
        //             }); 
        //         })
                
        //     }
        // }
    },
    Mutation: {
        uploadImage: async (_, args) => {
            try {
                const url = args.url.trim()
                const description = args.description.trim()
                const posterName = args.posterName.trim()
                const id = uuid.v4()
                const newImage = {
                    id: id,
                    url: url,
                    posterName: posterName,
                    description: description,
                    userPosted: true,
                    binned: false,
                    // numBinned: 0
                }
                await redisClient.hSet("userPostedImages", id, JSON.stringify(newImage))
                await redisClient.lPush("listUserPostedImages", id)   
                return newImage
            } catch (e) {
                return e
            }
        },
        updateImage: async (_, args) => {
            try {
                const imageInBin = await redisClient.hExists("myBin", args.id.trim())
                // console.log(imageInBin);
                if (imageInBin) {
                    const updatedImage = {
                        id: args.id,
                        url: args.url,
                        posterName: args.posterName,
                        description: args.description,
                        userPosted: args.userPosted,
                        binned: false,
                        // numBinned: args.numBinned
                    }
                    await redisClient.hDel("myBin", args.id)
                    await redisClient.lRem("myBinList", 0, args.id)
                    if (args.userPosted) {
                        await redisClient.hSet("userPostedImages", args.id, JSON.stringify(updatedImage))
                    }
                    return updatedImage
                } else {
                    const updatedImage = {
                        id: args.id,
                        url: args.url,
                        posterName: args.posterName,
                        description: args.description,
                        userPosted: args.userPosted,
                        binned: true,
                        // numBinned: args.numBinned
                    }
                    await redisClient.hSet("myBin", args.id, JSON.stringify(updatedImage))
                    await redisClient.lPush("myBinList", args.id)
                    if (args.userPosted) {
                        await redisClient.hSet("userPostedImages", args.id, JSON.stringify(updatedImage))
                    }
                    return updatedImage
                }
            } catch (e) {
                return e
            }
        },
        deleteImage: async(_, args) => {
            try {
                const usersImage = await redisClient.hExists("userPostedImages", args.id)
                let image = null
                if (usersImage) {
                    image = await redisClient.hGet("userPostedImages", args.id)
                    await redisClient.hDel("userPostedImages", args.id)
                    await redisClient.lRem("listUserPostedImages", 0, args.id)
                    let imageInBin = await redisClient.hExists("myBin", args.id)
                    if (imageInBin) {
                        await redisClient.hDel("myBin", args.id)
                        await redisClient.lRem("myBinList", 0, args.id)
                    } 
                }
                return JSON.parse(image)
            } catch (e) {
                return e
            }
        }
    }
}
// End Resolvers

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});