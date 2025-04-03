import fetch from 'node-fetch'
import { httpBody } from '../../utils'

type Props = {
    prompt: string,
    n?: number,
    size?: string,
    response_format?: string,
    image?: Buffer
    aikeyInfo: {
        host: string,
        key: string
    }
}

export async function openAi(params:Props) {
    return openAiTextToImage({...params});
}

export async function openAiTextToImage(props: Props) {
    const { n = 1, size = '256x256', response_format = 'b64_json', aikeyInfo } = props
    const generations = await fetch(`${aikeyInfo.host}/v1/images/generations`, {
        method: 'POST',
        body: JSON.stringify({
            prompt: props.prompt,
            n: Number(n),
            size,
            response_format
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${aikeyInfo.key}`
        }
    })
    if(generations.status !== 200){
        return httpBody(-1, [], '生成失败')
    }
    const json = await generations.json()
    const list = json.data.map((item) => {
        return {
			...item,
            base64: 'data:image/png;base64,' + item.b64_json,
            url: 'data:image/png;base64,' + item.b64_json,
        }
    })

    return httpBody<Array<{url: string}>>(0, [...list], '生成成功')
}
