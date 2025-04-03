import fetch from 'node-fetch'
import { filterObjectNull, httpBody } from '../../utils'

type Props = {
  request: {
    prompt: string
    samples?: string | number
    width?: string | number
    height?: string | number
    num_inference_steps?: string | number
    style_preset?: string
    init_image?: Buffer | string
    guidance_scale?: number
    model: string
  }
  aikeyInfo: {
    host: string
    key: string
  }
}

const textToImageUrl = '/api/v3/text2img'
const imageToImageUrl = '/api/v3/img2img'

const communityTextToImageUrl = '/api/v4/dreambooth'
const communityImageToImageUrl = '/api/v4/dreambooth/img2img'

async function urlToBase64(url) {
  const response = await fetch(url)
  const buffer = await response.buffer()
  const base64Data = buffer.toString('base64')
  return base64Data
}

export async function stablediffusion(params: Props) {
  if (params.request.model === 'stablediffusion' && params.request.init_image) {
    return imageToImage({
      ...params
    })
  } else if (params.request.model === 'stablediffusion') {
    return textToImage({
      ...params
    })
  } else if (params.request.model !== 'stablediffusion' && params.request.init_image) {
    return communityImageToImage({
      ...params
    })
  } else {
    return communityTextToImage({
      ...params
    })
  }
}

export async function textToImage(props: Props) {
  const {
    prompt,
    num_inference_steps = 20,
    samples = 1,
    height = 512,
    width = 512,
    guidance_scale = 7
  } = props.request

  const { key, host } = props.aikeyInfo

  const data = filterObjectNull({
    key,
    prompt,
    height: Number(height),
    width: Number(width),
    samples: Number(samples),
    guidance_scale: Number(guidance_scale),
    num_inference_steps: Number(num_inference_steps),
    base64: 'yes'
  })

  const generations = await fetch(host + textToImageUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const json = await generations.json()

  const list = await Promise.all(
    json.output.map(async (url) => {
      const base64 = await urlToBase64(url)
      return {
        ...json?.meta,
        url: 'data:image/png;base64,' + base64
      }
    })
  )

  return httpBody(0, [...list], '生成成功')
}

export async function imageToImage(props: Props) {
  const {
    prompt,
    num_inference_steps = 20,
    samples = 1,
    height = 512,
    width = 512,
    guidance_scale = 7,
    init_image
  } = props.request

  const { key, host } = props.aikeyInfo

  const data = filterObjectNull({
    key,
    prompt,
    height: Number(height),
    width: Number(width),
    samples: Number(samples),
    guidance_scale: Number(guidance_scale),
    num_inference_steps: Number(num_inference_steps),
    init_image,
    base64: 'yes'
  })

  const generations = await fetch(host + imageToImageUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const json = await generations.json()

  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const list = await Promise.all(
    json.output.map(async (url) => {
      const base64 = await urlToBase64(url)
      return {
        ...json?.meta,
        url: 'data:image/png;base64,' + base64
      }
    })
  )

  return httpBody(0, [...list], '生成成功')
}

export async function communityTextToImage(props: Props) {
  const {
    prompt,
    num_inference_steps = 20,
    samples = 1,
    height = 512,
    width = 512,
    guidance_scale = 7,
    model
  } = props.request

  const { key, host } = props.aikeyInfo

  const data = filterObjectNull({
    key,
    prompt,
    model_id: model,
    height: Number(height),
    width: Number(width),
    samples: Number(samples),
    guidance_scale: Number(guidance_scale),
    num_inference_steps: Number(num_inference_steps),
    base64: 'yes'
  })

  const generations = await fetch(host + communityTextToImageUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const json = await generations.json()

  const list = await Promise.all(
    json.output.map(async (url) => {
      const base64 = await urlToBase64(url)
      return {
        ...json?.meta,
        url: 'data:image/png;base64,' + base64
      }
    })
  )

  return httpBody(0, [...list], '生成成功')
}

export async function communityImageToImage(props: Props) {
  const {
    prompt,
    num_inference_steps = 20,
    samples = 1,
    height = 512,
    width = 512,
    guidance_scale = 7,
    init_image,
	model
  } = props.request

  const { key, host } = props.aikeyInfo

  const data = filterObjectNull({
    key,
    prompt,
	model_id: model,
    height: Number(height),
    width: Number(width),
    samples: Number(samples),
    guidance_scale: Number(guidance_scale),
    num_inference_steps: Number(num_inference_steps),
    init_image,
    base64: 'yes'
  })

  const generations = await fetch(host + communityImageToImageUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const json = await generations.json()

  if (generations.status !== 200) {
    return httpBody(-1, [], '生成失败')
  }

  const list = await Promise.all(
    json.output.map(async (url) => {
      const base64 = await urlToBase64(url)
      return {
        ...json?.meta,
        url: 'data:image/png;base64,' + base64
      }
    })
  )

  return httpBody(0, [...list], '生成成功')
}
