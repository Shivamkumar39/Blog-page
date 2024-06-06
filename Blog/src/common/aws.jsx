import axios from "axios"




export const uploadImage = async(img) =>{
    let imgUrl = null

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then( async({data: {uploadURL}})=>{


        await  axios({ method:'PUT', url:uploadURL, header: {'content-Type': 'multipart/form-data'}, data:img}).then(()=>{
            imgUrl = uploadURL.split('?')[0]
        })
    })
    return imgUrl;
}