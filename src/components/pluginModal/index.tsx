import { Button, Empty, Modal, Tabs } from 'antd'
import styles from './index.module.less'
import { pluginStore } from '@/store'
import { PluginInfo } from '@/types'
import AppCard from '../appCard'
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { putInstalledPlugin, putUninstallPlugin } from '@/request/api'
import { useMemo } from 'react'

type Props = {
  open: boolean
  onCancel: () => void
}

function PluginModal(props: Props) {
  const { plugins, changeIsInstalled } = pluginStore()

  const installPlugins = useMemo(() => {
    return plugins.filter(item => item.installed)
  }, [plugins])

  function PluginListCard({ data }: { data: Array<PluginInfo> }) {
    return (
      <div key={Date.now().toString()}>
        {
          data.length > 0 ? (
            <div className={styles.pluginList}>
              {data.map((item) => {
                return (
                  <AppCard
                    key={item.id}
                    title={item.name}
                    buttons={[
                      <>
                        {
                          item.installed ? (
                            <p key="anzhuang"
                              style={{
                                color: 'red'
                              }}
                              onClick={() => {
                                putUninstallPlugin(item.id).then(() => {
                                  changeIsInstalled({
                                    id: item.id,
                                    type: 'uninstall'
                                  })
                                })
                              }}
                            >
                              <CloseCircleOutlined /> 卸载
                            </p>
                          ) : (
                            <p key="anzhuang" onClick={
                              () => {
                                putInstalledPlugin(item.id).then(() => {
                                  changeIsInstalled({
                                    id: item.id,
                                    type: 'install'
                                  })
                                })
                              }}
                            >
                              <PlusCircleOutlined /> 安装
                            </p>
                          )
                        }

                      </>
                    ]
                    }
                    message={item.update_time}
                    userInfo={item.user}
                    {...item}
                  />
                )
              })}
            </div>
          ) : (
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            >
              {data.length <= 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
              )}
            </div>
          )
        }

      </div>
    )
  }


  return (
    <Modal title="AI智能插件" open={props.open} width={700} footer={null} onCancel={props.onCancel}>
      <Tabs
        // tabBarExtraContent={<Button>创建插件</Button>}
        items={[
          {
            label: '市场',
            key: 'shichang',
            children: <PluginListCard key="shichang" data={plugins} />
          },
          {
            label: '已安装',
            key: 'yianzhuang',
            children: <PluginListCard key="yianzhuang" data={installPlugins} />
          }
        ]}
      />
    </Modal>
  )
}

export default PluginModal
