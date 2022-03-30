import axios from 'axios';
const md5 = require('md5');
const publickey = 'f1dacbc2170b534c292d600eba6d24ef';
const privatekey = '71c5e8b014df2a10d45231233e8d379618a42dc7';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';


export async function axiosLists(type, offset) {
    const { data } = await axios.get(`${baseUrl}${type}?limit=20&offset=${offset}&apikey=${publickey}&ts=${ts}&hash=${hash}`)
    return data 
}

export async function axiosID(type, id) {
    const { data } = await axios.get(`${baseUrl}${type}/${id}?apikey=${publickey}&ts=${ts}&hash=${hash}`)
    return data
}

export async function axiosSearch(type, searchTerm) {
    const { data } = await axios.get(`${baseUrl}${type}?nameStartsWith=${searchTerm}&apikey=${publickey}&ts=${ts}&hash=${hash}`)
    return data
}

export async function axiosSearchComicNSeries(type, searchTerm) {
    const { data } = await axios.get(`${baseUrl}${type}?titleStartsWith=${searchTerm}&apikey=${publickey}&ts=${ts}&hash=${hash}`)
    return data
}

 