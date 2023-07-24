import { personaAsync } from '@/store/async'
import {
  Avatar,
  Badge,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Popover,
  Space,
  Tag,
  message
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import styles from './index.module.less'
import personaStore from '@/store/persona/slice'
import { EyeOutlined, PlusCircleOutlined, QuestionOutlined } from '@ant-design/icons'
import { PersonaInfo } from '@/types'
import {
  ModalForm,
  ProFormDependency,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components'
import { postPersona } from '@/request/api'
import { userStore } from '@/store'
import { getEmailPre } from '@/utils'
import AppCard from '../appCard'

type Props = {
  open: boolean
  onCreateChat: (item: PersonaInfo) => void
  onCancel: () => void
}

function PersonaModal(props: Props) {
  const { personas } = personaStore()
  const { token } = userStore()
  const [search, setSearch] = useState('')

  const [form] = Form.useForm<PersonaInfo>()
  const [edidInfoModal, setEditInfoModal] = useState<{
    open: boolean
    info: PersonaInfo | undefined
    disabled: boolean
  }>({
    open: false,
    info: undefined,
    disabled: false
  })

  useEffect(() => {
    personaAsync.fetchPersonas()
  }, [])

  const countPersonas = useMemo(() => {
    if (search) {
      const list = personas.filter((item) => item.title.includes(search))
      return [...list]
    }
    return [...personas]
  }, [personas, search])

  return (
    <div className={styles.persona}>
      <Modal title="AI角色" open={props.open} width={700} footer={null} onCancel={props.onCancel}>
        <Space size="small" direction="vertical" style={{ width: '100%' }}>
          <div className={styles.persona_operate}>
            <p>{personas.length}个预设角色定义信息</p>
            <Space wrap>
              <Button
                type="primary"
                disabled={!token}
                onClick={() => {
                  setEditInfoModal({
                    info: {
                      emoji: '1f970'
                    } as any,
                    open: true,
                    disabled: false
                  })
                }}
              >
                添加
              </Button>
              <Input
                placeholder="搜索关键词"
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
            </Space>
          </div>
          <div className={styles.persona_list}>
            {countPersonas.map((item) => {
              return (
                <AppCard
                  key={item.id}
                  {...item}
                  userInfo={item.user}
				  message={`包含 ${JSON.parse(item.context).length} 条预设对话`}
                  buttons={[
                    <p
                      key="duihua"
                      onClick={() => {
                        props.onCreateChat?.(item)
                      }}
                    >
                      <PlusCircleOutlined />
                      <span>对话</span>
                    </p>,
                    <p
                      key="chakan"
                      onClick={() => {
                        setEditInfoModal(() => {
                          form.setFieldsValue({
                            ...item,
                            context: JSON.parse(item.context)
                          })
                          return {
                            open: true,
                            info: item,
                            disabled: true
                          }
                        })
                      }}
                    >
                      <EyeOutlined />
                      <span>查看</span>
                    </p>
                  ]}
                />
              )
            })}
            <div className={styles.persona_list_empty}>
              {countPersonas.length <= 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
              )}
            </div>
          </div>
        </Space>
      </Modal>
      <ModalForm<PersonaInfo>
        title="角色信息"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1
        }}
        onOpenChange={(visible) => {
          if (!visible) {
            form.resetFields()
          }
          setEditInfoModal((info) => {
            return {
              ...info,
              open: visible
            }
          })
        }}
        onFinish={async (values) => {
          if (edidInfoModal.disabled) {
            message.warning('请勿操作')
            return false
          }
          const data = { ...values }
          if (!data.context || data.context.length <= 0) {
            message.warning('请填写对话数据')
            return
          }
          const context = JSON.stringify(data.context)
          const res = await postPersona({
            ...data,
            context
          })
          if (res.code) {
            message.error('提交失败')
            return false
          }
          message.success('提交成功,耐心等待审核!')
          return true
        }}
        size="large"
        modalProps={{
          cancelText: '取消',
          okText: '提交审核'
        }}
      >
        <ProFormList
          name="context"
          creatorButtonProps={{
            creatorButtonText: '添加一行对话'
          }}
        >
          <ProFormGroup key="group">
            <ProFormSelect
              label="角色"
              name="role"
              width="sm"
              valueEnum={{
                system: 'system',
                user: 'user',
                assistant: 'assistant'
              }}
              rules={[{ required: true }]}
            />
            <ProFormText width="lg" rules={[{ required: true }]} name="content" label="内容" />
          </ProFormGroup>
        </ProFormList>
        <ProFormGroup>
          <ProFormDependency name={['avatar']}>
            {({ avatar }) => {
              return (
                <div className={styles.emojiForm}>
                  <div className={styles.emojiForm_label}>
                    <label>头像</label>
                  </div>
                  <div className={styles.emojiForm_card}>
                    {avatar ? (
                      <img
                        src={avatar}
                        style={{
                          width: '100%'
                        }}
                      />
                    ) : (
                      <QuestionOutlined />
                    )}
                  </div>
                </div>
              )
            }}
          </ProFormDependency>
          <ProFormText
            width="md"
            name="avatar"
            label="头像地址"
            placeholder="请输入头像链接地址"
            rules={[{ required: true, message: '请输入头像链接地址' }]}
          />
          <ProFormText
            name="title"
            label="标题"
            placeholder="标题"
            rules={[{ required: true, message: '请输入角色标题' }]}
          />
        </ProFormGroup>
        <ProFormText name="description" label="描述" placeholder="描述" />
      </ModalForm>
    </div>
  )
}

export default PersonaModal
