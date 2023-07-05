import React, { useState, useRef, useEffect } from 'react'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'
import Layout from '@/components/Layout'
import styles from './index.module.less'
import { Button, Input, Space, message } from 'antd'
import { postChatCompletion } from '@/request/api'
import { handleChatData, htmlToImage, textToMdFile } from '@/utils'
import { FileImageOutlined, FileMarkdownOutlined } from '@ant-design/icons'

const initValue = `# ChatGptWeb系统
## 基础功能
- 支持AI聊天
- 支持GPT4
- 支持DLLAE2
- 支持Midjourney
- 支持mind思维导图生成
- 更多功能等你探索......

## 更多内容
-  在上面输入您想要生成的内容
- 点击生成即可
`

function MappingPage() {
  const transformer = new Transformer()
  const [value, setValue] = useState(initValue)
  const refSvg = useRef<SVGSVGElement>(null)
  const refMm = useRef<Markmap>()

  const [inputOptions, setInputOptions] = useState({
    value: '',
    loading: false
  })

  useEffect(() => {
    if (refSvg && refSvg.current && !refMm.current) {
      const mm = Markmap.create(refSvg.current)
      refMm.current = mm
    }
  }, [refSvg.current])

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current
    if (mm) {
      const { root } = transformer.transform(value)
      mm.setData(root)
      mm.fit()
    }
  }, [refMm.current, value])

  async function onFetchChat() {
    setInputOptions((i) => ({ ...i, loading: true }))
    const response = await postChatCompletion({
      prompt: inputOptions.value,
      type: 'mapping'
    })
      .then((res) => {
        return res
      })
      .catch((error) => {
        setInputOptions((i) => ({ ...i, loading: false }))
        return error
      })

    const reader = response.body?.getReader?.()
    let allContent = ''
    while (true) {
      const { done = true, value } = (await reader?.read()) || {}
      if (done) {
        setInputOptions((i) => ({ ...i, loading: false }))
        break
      }
      // 将获取到的数据片段显示在屏幕上
      const text = new TextDecoder('utf-8').decode(value)
      console.log(text)
      const texts = handleChatData(text)
      for (let i = 0; i < texts.length; i++) {
        const { content, segment } = texts[i]
        allContent += content ? content : ''
        if (segment === 'stop') {
          setInputOptions((i) => ({ ...i, loading: false }))
          break
        }

        if (segment === 'start') {
          setValue(allContent)
        }
        if (segment === 'text') {
          setValue(allContent)
        }
      }
    }
  }

  function onExportImage() {
    htmlToImage('mind-mapping-wrapper')
      .then(() => {
        message.success('下载成功')
      })
      .catch(() => {
        message.error('下载失败')
      })
  }

  function onExportMd() {
    if (!value) {
      message.warning('暂无数据导出')
      return
    }
    textToMdFile(value)
      .then(() => {
        message.success('下载成功')
      })
      .catch(() => {
        message.error('下载失败')
      })
  }

  return (
    <div className={styles.mapping}>
      <Layout>
        <div className={styles.mapping_content}>
          <div id="mind-mapping-wrapper">
            <svg className={styles.mapping_svg} ref={refSvg} />
          </div>
          <div className={styles.mapping_input}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input.TextArea
                autoSize={{
                  minRows: 6,
                  maxRows: 6
                }}
                placeholder="请输入你想要生成的内容描述，AI会为你生成一份思维导图！"
                onChange={(e) => {
                  setInputOptions((i) => ({ ...i, value: e.target.value }))
                }}
              />

              <div className={styles.mapping_exports}>
                <div onClick={onExportMd}>
                  <FileMarkdownOutlined /> 导出MD
                </div>
                <div onClick={onExportImage}>
                  <FileImageOutlined /> 导出图片
                </div>
                <Button
                  block
                  type="primary"
                  size="large"
                  disabled={!inputOptions.value}
                  loading={inputOptions.loading}
                  onClick={onFetchChat}
                >
                  智能生成生成思维导图
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default MappingPage
