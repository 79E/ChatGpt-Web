import jimp from 'jimp'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { filterObjectNull, httpBody } from '../../utils'

type Props = {
  request: {
    prompt: string
    cfg_scale?: string | number
    samples?: string | number
    width?: string | number
    height?: string | number
    steps?: string | number
    style_preset?: string
    init_image?: Buffer | string
    init_image_mode?: string
	model: string
    image_strength?: number
  }
  aikeyInfo: {
    host: string
    key: string
  }
}

// const engineId = 'stable-diffusion-v1-5'
const textToImageUrl = (engineId: string) => `/v1/generation/${engineId}/text-to-image`
const ImageToImageUrl = (engineId: string) => `/v1/generation/${engineId}/image-to-image`

export async function stability(params: Props) {
  if (params.request.init_image) {
    return stabilityImageToImage({
      ...params
    })
  } else {
    return stabilityTextToImage({
      ...params
    })
  }
}

export async function stabilityTextToImage(props: Props) {
  const {
    prompt,
    cfg_scale = 7,
    style_preset,
    steps = 30,
    samples = 1,
    height = 512,
    width = 512,
	model
  } = props.request
  const data = filterObjectNull({
    text_prompts: [
      {
        text: prompt
      }
    ],
    cfg_scale: Number(cfg_scale),
    clip_guidance_preset: 'FAST_BLUE',
    height: Number(height),
    width: Number(width),
    samples: Number(samples),
    steps: Number(steps),
	style_preset: style_preset ? style_preset : null,
  })

  const { key, host } = props.aikeyInfo

  const generations = await fetch(host + textToImageUrl(model), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    }
  })

  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const json = await generations.json()
  const list = json.artifacts.map((item) => {
    return {
      ...item,
      url: 'data:image/png;base64,' + item.base64
    }
  })

  return httpBody(0, [...list], '生成成功')
}

export async function stabilityImageToImage(props: Props) {
  const {
    init_image_mode = 'IMAGE_STRENGTH',
    image_strength = 0.35,
    prompt,
    cfg_scale = 7,
    style_preset,
    steps = 30,
    samples = 1,
    height = 512,
    width = 512,
	model,
    init_image = ''
  } = props.request

  const formData = new FormData()

  const image = await jimp.read(init_image as string).then((image) => {
    return image.resize(Number(width), Number(height)).getBufferAsync(jimp.MIME_PNG)
  })

  formData.append('init_image', image)

  const data = filterObjectNull({
    cfg_scale: Number(cfg_scale),
    clip_guidance_preset: 'FAST_BLUE',
    samples: Number(samples),
    steps: Number(steps),
    style_preset: style_preset ? style_preset : null,
    init_image_mode,
    image_strength
  })

  formData.append('text_prompts[0][text]', prompt)
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  const { key, host } = props.aikeyInfo

  const generations = await fetch(host + ImageToImageUrl(model), {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${key}`
    }
  })
  const json = await generations.json()
  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const list = json.artifacts.map((item) => {
    return {
      // base64: 'data:image/png;base64,' + item.base64,
	  ...item,
      url: 'data:image/png;base64,' + item.base64
    }
  })

  return httpBody(0, [...list], '生成成功')
}
