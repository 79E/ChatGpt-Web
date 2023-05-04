import { ProLayout } from '@ant-design/pro-components'
import styles from './index.module.less'
import HeaderRender from '@/components/HeaderRender'
import { Input, Radio, Slider } from 'antd'
import { useState } from 'react'

function DrawPage() {
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
          <div className={styles.drawPage_container_one} />
          <div className={styles.drawPage_container_two}>
            <div className={styles.drawPage_config}>
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
              <Slider
                defaultValue={drawConfig.n}
                value={drawConfig.n}
                min={1}
                max={10}
                onChange={(e) => {
                  setDrawConfig((c) => ({ ...c, n: e }))
                }}
              />
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
