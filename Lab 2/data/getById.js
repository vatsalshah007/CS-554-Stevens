let axios = require("axios")

async function getData(){
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2')
    return data 
}


const idCheck = async (id) => {
    if(!id) throw {code: 401, error: `ID cannot be null or undefined`}
    if(!Number(id)) throw {code: 401, error: `ID not a number`}
}

const getById = async function getById(id) {
    await idCheck(id)
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            let Data = await getData()
            
            Data.forEach(x => {
                if(x.id == id){
                    resolve(x)
                }
            });
        
            reject({
                code: 404,
                error: `No user with found with the specified ID.`
            })
        }, 5000)
    })
}

module.exports = {
    getById
}