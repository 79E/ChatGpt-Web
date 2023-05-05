import { ProLayout } from '@ant-design/pro-components'
import styles from './index.module.less'
import HeaderRender from '@/components/HeaderRender'
import { Button, Empty, Input, Radio, Slider, Space } from 'antd'
import { useState } from 'react'
import useStore from '@/store'
import OpenAiLogo from '@/components/OpenAiLogo'

function DrawPage() {
  const { setConfigModal } = useStore()

  const [drawConfig, setDrawConfig] = useState({
    prompt: '',
    n: 1,
    size: '256x256',
    response_format: 'url'
  })

  return (
    <div className={styles.drawPage}>
      <ProLayout
        title={import.meta.env.VITE_APP_TITLE}
        logo={import.meta.env.VITE_APP_LOGO}
        layout="mix"
        splitMenus={false}
        contentWidth="Fluid"
        fixedHeader
        fixSiderbar
        headerRender={HeaderRender}
        contentStyle={{
          height: 'calc(100vh - 56px)',
          background: '#fff'
        }}
        siderMenuType="group"
        style={{
          background: '#fff'
        }}
        menu={{
          hideMenuWhenCollapsed: true,
          locale: false,
          collapsedShowGroupTitle: false
        }}
        suppressSiderWhenMenuEmpty
        siderWidth={300}
        avatarProps={{
          src: 'https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
          size: 'small',
          render: (props, dom) => <>{dom}</>
        }}
      >
        <div className={styles.drawPage_container}>
          <div className={styles.drawPage_container_one}>
            <div className={styles.drawPage_header}>
              <img
                src="https://www.imageoss.com/images/2023/05/05/Midjourneybf2f31b4a2ac2dc9.png"
                alt="Midjourney"
              />
              <h2>AI 一下，妙笔生画</h2>
              <h4>只需一句话，让你的文字变成画作</h4>
            </div>
            <div className={styles.drawPage_create} style={{ height: 0 }}>
              <OpenAiLogo rotate width="3em" height="3em" />
            </div>
            <div className={styles.drawPage_mydraw}>
              <h4>我的绘画</h4>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无生成记录" />
              <div className={styles.drawPage_mydraw_list}>{/*  */}</div>
            </div>
          </div>
          <div className={styles.drawPage_container_two}>
            <div className={styles.drawPage_config}>
              <Space direction="vertical">
                <p>图片尺寸({drawConfig.size})</p>
                <Radio.Group
                  buttonStyle="solid"
                  defaultValue={drawConfig.size}
                  value={drawConfig.size}
                  onChange={(e) => {
                    setDrawConfig((c) => ({ ...c, size: e.target.value }))
                  }}
                >
                  <Radio.Button value={'256x256'}>256x256</Radio.Button>
                  <Radio.Button value={'512x512'}>512x512</Radio.Button>
                  <Radio.Button value={'1024x1024'}>1024x1024</Radio.Button>
                </Radio.Group>
                <p>图片数量({drawConfig.n}张)</p>
              </Space>
              <Slider
                defaultValue={drawConfig.n}
                value={drawConfig.n}
                min={1}
                max={10}
                onChange={(e) => {
                  setDrawConfig((c) => ({ ...c, n: e }))
                }}
              />
              <Button
                block
                type="dashed"
                style={{
                  background: 'transparent'
                }}
                onClick={() => {
                  setConfigModal(true)
                }}
              >
                系统配置
              </Button>
            </div>
            <Input.Search
              value={drawConfig.prompt}
              placeholder="请输入修饰词"
              allowClear
              enterButton="开始绘制"
              size="large"
              onSearch={() => {
                console.log('开始1', drawConfig)
              }}
              onChange={(e) => {
                setDrawConfig((c) => ({ ...c, prompt: e.target.value }))
              }}
            />
          </div>
        </div>
      </ProLayout>
    </div>
  )
}

export default DrawPage
