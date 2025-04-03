import fetch from 'node-fetch';

async function tuputech(key: string, content: string){
	const api = 'https://tupu.apistd.com/v3/recognition/text/text-moderation'
	const res = await fetch(`${api}?key=${key}`,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text: [
				{
					content
				}
			]
		})
    });
	if(res.status !== 200){
		return {
			action: 'block'
		}
	}
	const json = await res.json();
	if(json.code || json.data.texts.length <= 0){
		return {
			action: 'block'
		}
	}
	const [ data ] = json.data.texts;
	return {
		...data
	}
}

export default {
	tuputech
}
