import fetch from 'node-fetch'
import FormData from 'form-data'

async function decodeUrlToText (url: string){
    if(!url) return ''
    const formData = new FormData()
    formData.append('data', url)
    const response = await fetch('https://cli.im/Api/Browser/deqr', {
        method: 'POST',
        body: formData
    })
    const data = await response.json();
    return data
}

export default {
    decodeUrlToText
}