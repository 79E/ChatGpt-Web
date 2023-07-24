import styles from './index.module.less'
import {
  Button,
  Empty,
  Input,
  Image,
  Radio,
  Slider,
  Space,
  Popconfirm,
  notification,
  message,
  Segmented,
  Select,
  Upload
} from 'antd'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { drawStore, userStore } from '@/store'
import OpenAiLogo from '@/components/OpenAiLogo'
import { postChatCompletion, postImagesGenerations } from '@/request/api'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleFilled,
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { formatTime, generateUUID, handleChatData } from '@/utils'
import { ResponseData } from '@/request'
import Layout from '@/components/Layout'

const drawSize = [
  {
    label: '256px',
    value: 256
  },
  {
    label: '320px',
    value: 320
  },
  {
    label: '356px',
    value: 356
  },
  {
    label: '468px',
    value: 468
  },
  {
    label: '512px',
    value: 512
  },
  {
    label: '640px',
    value: 640
  },
  {
    label: '704px',
    value: 704
  },
  {
    label: '768px',
    value: 768
  },
  {
    label: '832px',
    value: 832
  },
  {
    label: '896px',
    value: 896
  },
  {
    label: '960px',
    value: 960
  },
  {
    label: '1024px',
    value: 1024
  }
]

const stylePresets = [
  { label: '无风格', value: '' },
  { label: '3D模型', value: '3d-model' },
  { label: '模拟胶片', value: 'analog-film' },
  { label: '动漫', value: 'anime' },
  { label: '电影', value: 'cinematic' },
  { label: '漫画', value: 'comic-book' },
  { label: '数字艺术', value: 'digital-art' },
  { label: '增强现实', value: 'enhance' },
  { label: '奇幻艺术', value: 'fantasy-art' },
  { label: '等距投影', value: 'isometric' },
  { label: '线条艺术', value: 'line-art' },
  { label: '低多边形', value: 'low-poly' },
  { label: '建模粘土', value: 'modeling-compound' },
  { label: '霓虹朋克', value: 'neon-punk' },
  { label: '折纸艺术', value: 'origami' },
  { label: '摄影', value: 'photographic' },
  { label: '像素艺术', value: 'pixel-art' },
  { label: '瓷砖纹理', value: 'tile-texture' }
]

function DrawPage() {
  const { token, setLoginModal } = userStore()
  const { historyDrawImages, clearhistoryDrawImages, addDrawImage } = drawStore()

  const containerOneRef = useRef<HTMLDivElement>(null)
  const containerTwoRef = useRef<HTMLDivElement>(null)
  const [bottom, setBottom] = useState(0)

  const [collapse, setCollapse] = useState(true)
  const [gptLoading, setGptLoading] = useState(false)

  const [drawConfig, setDrawConfig] = useState<{
    prompt: string
    quantity: number
    width: number
    height: number
    quality?: number
    steps?: number
    style?: string
    image?: File | string
  }>({
    prompt: '',
    quantity: 1,
    width: 512,
    height: 512,
    quality: 7,
    steps: 50,
    style: '',
    image: ''
  })

  const [showImage, setShowImage] = useState<string | ArrayBuffer | null>('')
  const [drawType, setDrawType] = useState('openai')
  const [drawResultData, setDrawResultData] = useState<{
    loading: boolean
    list: Array<{ url: string }>
  }>({
    loading: false,
    list: []
  })
  const handleDraw = (res: ResponseData<Array<{ url: string }>>) => {
    if (res.code || res.data.length <= 0) {
      message.error('请求错误 🙅')
      return
    }
    setDrawResultData({
      loading: false,
      list: res.data
    })
    const addImagesData = res.data.map((item) => {
      return {
        ...item,
        ...drawConfig,
        draw_type: drawType,
        id: generateUUID(),
        dateTime: formatTime()
      }
    })
    addDrawImage(addImagesData)
  }

  const onStartDraw = async () => {
    if (gptLoading) {
      message.warning('请等待提示词优化完毕')
      return
    }
    if (!drawConfig.prompt) {
      message.warning('请输入提示词')
      return
    }
    if (!token) {
      setLoginModal(true)
      return
    }
    setDrawResultData({
      loading: true,
      list: []
    })

    await postImagesGenerations(
      {
        ...drawConfig,
        draw_type: drawType,
      },
      {},
      { timeout: 0 }
    )
      .then(handleDraw)
      .finally(() => {
        setDrawResultData((dr) => ({ ...dr, loading: false }))
      })
  }

  async function optimizePrompt() {
    setGptLoading(true)
    const response = await postChatCompletion({
      prompt: drawConfig.prompt,
      type: 'draw'
    }).then((res) => {
      return res
    }).catch((error) => {
      setGptLoading(false)
      return error
    })

    const reader = response.body?.getReader?.()
    let allContent = ''
    while (true) {
      const { done = true, value } = (await reader?.read()) || {}
      if (done) {
        setGptLoading(false)
        break
      }
      // 将获取到的数据片段显示在屏幕上
      const text = new TextDecoder('utf-8').decode(value)
      const texts = handleChatData(text)
      for (let i = 0; i < texts.length; i++) {
        const { content, segment } = texts[i]
        allContent += content ? content : ''
        if (segment === 'stop') {
          setGptLoading(false)
          break
        }

        if (segment === 'start') {
          setDrawConfig((config) => ({ ...config, prompt: allContent }))
        }
        if (segment === 'text') {
          setDrawConfig((config) => ({ ...config, prompt: allContent }))
        }
      }
    }
  }

  const handleScroll = () => {
    const twoClientHeight = containerTwoRef.current?.clientHeight || 0
    const oneScrollTop = containerOneRef.current?.scrollTop || 0
    if (oneScrollTop > 100) {
      setBottom(-(twoClientHeight + 100))
    } else {
      setBottom(0)
    }
  }

  useLayoutEffect(() => {
    containerOneRef.current?.addEventListener('scroll', handleScroll)
    return () => {
      containerOneRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function SegmentedLabel({ icon, title }: { icon: string; title: string }) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img style={{ width: 24, marginRight: 4 }} src={icon} alt={title} />
        <span style={{ fontWeight: 500 }}>{title}</span>
      </div>
    )
  }

  const showFile = async (file: any) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setShowImage(reader.result)
    }
  }

  return (
    <div className={styles.drawPage}>
      <Layout>
        <div className={styles.drawPage_container}>
          <div className={styles.drawPage_container_one} ref={containerOneRef}>
            <div className={styles.drawPage_header}>
              <img src="https://u1.dl0.cn/icon/Midjourneybf2f31b4a2ac2dc9.png" alt="Midjourney" />
              <h2>AI 一下，妙笔生画</h2>
              <h4>只需一句话，让你的文字变成画作</h4>
            </div>
            <div
              className={styles.drawPage_create}
              style={{
                minHeight: drawResultData.loading || drawResultData.list.length > 0 ? '' : 0
              }}
            >
              {drawResultData.loading && <OpenAiLogo rotate width="3em" height="3em" />}
              <Image.PreviewGroup>
                {drawResultData.list.map((item) => {
                  return (
                    <Image
                      className={styles.drawPage_image}
                      key={item.url}
                      width={160}
                      src={item.url}
                    />
                  )
                })}
              </Image.PreviewGroup>
            </div>
            <div className={styles.drawPage_mydraw}>
              <div className={styles.drawPage_mydraw_header}>
                <div>
                  <h4>我的绘画</h4>
                  <p>请及时保存绘画图片，链接可能会失效</p>
                </div>
                <Popconfirm
                  title="清除历史绘画"
                  description="确定清除所有绘画数据吗？"
                  onConfirm={() => {
                    clearhistoryDrawImages()
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <ClearOutlined className={styles.drawPage_mydraw_header_icon} />
                </Popconfirm>
              </div>
              {historyDrawImages.length <= 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无生成记录" />
              )}
              <Image.PreviewGroup>
                <div className={styles.drawPage_mydraw_list}>
                  {historyDrawImages.map((item) => {
                    return (
                      <div key={item.id} className={styles.drawPage_mydraw_list_item}>
                        <Image className={styles.drawPage_image} src={item.url} />
                        <p>{item.prompt}</p>
                      </div>
                    )
                  })}
                </div>
              </Image.PreviewGroup>
            </div>
          </div>
          <div
            className={styles.drawPage_container_two}
            style={{
              bottom: bottom
            }}
            ref={containerTwoRef}
          >
            <div className={styles.drawPage_config}>
              <div
                style={{
                  paddingLeft: 20,
                  paddingRight: 20
                }}
              >
                <div
                  className={styles.drawPage_config_collapse}
                  onClick={() => {
                    setCollapse((c) => {
                      return !c
                    })
                  }}
                >
                  {' '}
                  {collapse ? (
                    <p>
                      <CaretUpOutlined /> <span style={{ fontSize: 12 }}>展开配置</span>
                    </p>
                  ) : (
                    <p>
                      <CaretDownOutlined /> <span style={{ fontSize: 12 }}>收缩配置</span>
                    </p>
                  )}{' '}
                </div>
                <Segmented
                  block
                  value={drawType}
                  style={{
                    backgroundImage: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)'
                  }}
                  onChange={(e) => {
                    setDrawType(e.toString())
                  }}
                  options={[
                    {
                      label: useMemo(
                        () => (
                          <SegmentedLabel
                            icon="https://u1.dl0.cn/icon/openai_draw_icon.png"
                            title="OpenAI"
                          />
                        ),
                        []
                      ),
                      value: 'openai'
                    },
                    {
                      label: useMemo(
                        () => (
                          <SegmentedLabel
                            icon="https://u1.dl0.cn/icon/sd_draw_icon.png"
                            title="StableDiffusion"
                          />
                        ),
                        []
                      ),
                      value: 'stablediffusion'
                    }
                  ]}
                />
                <div
                  className={styles.drawPage_config_options}
                  style={{
                    maxHeight: collapse ? 0 : '300px'
                  }}
                >
                  <div className={styles.drawPage_config_group}>
                    <div className={styles.drawPage_config_item}>
                      <p>图片宽度：</p>
                      <Select
                        defaultValue={drawConfig.width}
                        value={drawConfig.width}
                        options={drawSize}
                        onChange={(e) => {
                          setDrawConfig((c) => ({ ...c, width: e }))
                        }}
                      />
                    </div>
                    <div className={styles.drawPage_config_item}>
                      <p>图片高度：</p>
                      <Select
                        defaultValue={drawConfig.height}
                        value={drawConfig.height}
                        options={drawSize}
                        onChange={(e) => {
                          setDrawConfig((c) => ({ ...c, height: e }))
                        }}
                      />
                    </div>
                    <div className={styles.drawPage_config_item}>
                      <p>生成数量({drawConfig.quantity}张)：</p>
                      <Slider
                        defaultValue={drawConfig.quantity}
                        value={drawConfig.quantity}
                        min={1}
                        max={10}
                        onChange={(e) => {
                          setDrawConfig((c) => ({ ...c, quantity: e }))
                        }}
                      />
                    </div>
                  </div>
                  {drawType === 'stablediffusion' && (
                    <div className={styles.drawPage_config_group}>
                      <div className={styles.drawPage_config_item}>
                        <p>优化次数({drawConfig.steps})：</p>
                        <Slider
                          defaultValue={drawConfig.steps}
                          value={drawConfig.steps}
                          min={10}
                          max={150}
                          onChange={(e) => {
                            setDrawConfig((c) => ({ ...c, steps: e }))
                          }}
                        />
                      </div>
                      <div className={styles.drawPage_config_item}>
                        <p>图像质量({drawConfig.quality})：</p>
                        <Slider
                          defaultValue={drawConfig.quality}
                          value={drawConfig.quality}
                          min={1}
                          max={37}
                          onChange={(e) => {
                            setDrawConfig((c) => ({ ...c, quality: e }))
                          }}
                        />
                      </div>
                      <div className={styles.drawPage_config_item}>
                        <p>图像风格：</p>
                        <Select
                          defaultValue={drawConfig.style}
                          value={drawConfig.style}
                          options={stylePresets}
                          clearIcon
                          onChange={(e) => {
                            setDrawConfig((c) => ({ ...c, style: e }))
                          }}
                        />
                        {/* <Radio.Group onChange={(e) => {
                      const { value } = e.target;
                      if (value === drawConfig.style) {
                        setDrawConfig((c) => ({ ...c, style: '' }))
                        return
                      }
                      setDrawConfig((c) => ({ ...c, style: value }))
                    }} defaultValue={drawConfig.style} value={drawConfig.style}
                    >
                      <div className={styles.drawPage_config_stylePresets}>
                        {stylePresets.map((item) => {
                          const stylePresetsClassName = drawConfig.style === item.value ?
                            `${styles.drawPage_config_stylePresets_item} ${styles.drawPage_config_stylePresets_select}` : styles.drawPage_config_stylePresets_item
                          return (
                            <div className={stylePresetsClassName} key={item.value}>
                              <Radio value={item.value}><span className={styles.drawPage_config_stylePresets_item_text}>{item.label}</span></Radio>
                            </div>
                          )
                        })}
                      </div>
                    </Radio.Group> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.drawPage_config_input}>
                <Upload
                  maxCount={1}
                  accept="image/*"
                  disabled={drawType === 'openai'}
                  showUploadList={false}
                  customRequest={(options) => {
                    showFile(options.file)
                    setDrawConfig((config) => ({ ...config, image: options.file as File }))
                  }}
                >
                  <div
                    className={styles.drawPage_config_input_image}
                    style={{
                      opacity: drawType === 'stablediffusion' ? 1 : 0.6,
                      cursor: drawType === 'stablediffusion' ? 'pointer' : 'not-allowed',
                      backgroundImage: drawConfig.image && showImage ? `url(${showImage})` : ''
                    }}
                  >
                    上传图片
                    {drawConfig.image && (
                      <div
                        className={styles.drawPage_config_input_image_close}
                        onClick={(e) => {
                          setDrawConfig((config) => ({ ...config, image: '' }))
                          setShowImage('')
                          e.stopPropagation()
                        }}
                      >
                        <CloseCircleOutlined />
                      </div>
                    )}
                  </div>
                </Upload>
                <Input.TextArea
                  autoSize={{
                    minRows: 3,
                    maxRows: 3
                  }}
                  defaultValue={drawConfig.prompt}
                  value={drawConfig.prompt}
                  onChange={(e) => {
                    setDrawConfig((config) => ({ ...config, prompt: e.target.value }))
                  }}
                  style={{
                    borderRadius: 0
                  }}
                  placeholder="请输入绘画提示次，可勾选优化文案功能对提示词进行优化效果会更好哦！"
                />
                <div className={styles.drawPage_config_input_buttons}>
                  <div onClick={optimizePrompt}>{gptLoading && <LoadingOutlined />} 优化文案</div>
                  <div onClick={onStartDraw}>
                    {drawResultData.loading && <LoadingOutlined />} 生成图像
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default DrawPage
