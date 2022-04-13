import {gql} from '@apollo/client';


const GET_UNSPLASH_IMAGES = gql`
    query Query1($pageNum: Int) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const GET_BINNED_IMAGES = gql`
    query Query2 {
        binnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const GET_MY_POSTS = gql`
    query Query3 {
        userPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation Mutation1($url: String!, $description: String, $posterName: String) {
        uploadImage(url: $url, description: $description, posterName: $posterName) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`; 

const UPDATE_IMAGE = gql`
    mutation Mutataion2($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean, $numBinned: Int) {
        updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned, numBinned: $numBinned) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation Mutation3 ($id: ID!){
        deleteImage(id: $id) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;


const GET_TOP_BINNED = gql`
    query Query4{
        getTopTenBinnedPosts {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const queries = {
    GET_UNSPLASH_IMAGES,
    GET_BINNED_IMAGES,
    GET_MY_POSTS,
    UPLOAD_IMAGE,
    UPDATE_IMAGE,
    DELETE_IMAGE,
    GET_TOP_BINNED
}

export default queries