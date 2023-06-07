import { useLayoutEffect } from 'react'
import { ModalForm, ProFormSelect, ProFormSlider, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import FormItemCard from '../FormItemCard'
import { ChatGptConfig } from '@/types'

type Props = {
  open: boolean
  onCancel: () => void
  onChange: (config: ChatGptConfig) => void
  models: Array<{
    label: string
    value: string
  }>
  data: ChatGptConfig
}

function ConfigModal(props: Props) {
  const [chatGptConfigform] = Form.useForm<ChatGptConfig>()
  const onCancel = () => {
    props.onCancel()
    chatGptConfigform.resetFields()
  }

  useLayoutEffect(() => {
    if (props.open && chatGptConfigform) {
      chatGptConfigform.setFieldsValue({
        ...props.data
      })
    }
  }, [props.open, chatGptConfigform])

  return (
    <ModalForm<ChatGptConfig>
      title="Chat 配置"
      open={props.open}
      form={chatGptConfigform}
      onOpenChange={(visible) => {
        if (visible) return
        onCancel()
      }}
      onFinish={async (values) => {
        props.onChange(values)
        return true
      }}
      size="middle"
      width={600}
      modalProps={{
        cancelText: '取消',
        okText: '提交',
        maskClosable: false,
        destroyOnClose: true
      }}
    >
      <FormItemCard title="GPT模型" describe="根据OpenAI中给出的模型配置">
        <ProFormSelect
          name="model"
          style={{ minWidth: '180px' }}
          options={[...props.models]}
          fieldProps={{
            clearIcon: false
          }}
        />
      </FormItemCard>
      {/* {(
        <>
          <FormItemCard title="代理API" describe="代理地址可以是任何三方代理（ChatGpt）">
            <ProFormText
              allowClear={false}
              name="api"
              placeholder="请输入代理地址"
              rules={[{ required: true, message: '请填写代理API地址' }]}
            />
          </FormItemCard>
          <FormItemCard title="API Key" describe="使用自己的OpenApiKey 或者其他代理。">
            <ProFormText allowClear={false} name="api_key" placeholder="请输入key 密钥" />
          </FormItemCard>
        </>
      )} */}
      {/* <FormItemCard title="携带历史消息数" describe="每次请求携带的历史消息数">
        <ProFormSlider name="limit_message" max={10} min={0} step={1} />
      </FormItemCard> */}
      <FormItemCard title="随机性" describe="值越大，回复越随机，大于 1 的值可能会导致乱码">
        <ProFormSlider name="temperature" max={2} min={0} step={0.1} />
      </FormItemCard>
      <FormItemCard title="话题新鲜度" describe="值越大，越有可能扩展到新话题">
        <ProFormSlider name="presence_penalty" max={2} min={-2} step={0.1} />
      </FormItemCard>
      <FormItemCard title="重复性" describe="文本中重复单词和短语的频率，越大越不流畅">
        <ProFormSlider name="frequency_penalty" max={2} min={-2} step={0.1} />
      </FormItemCard>
      <FormItemCard title="单次回复限制" describe="单次交互所用的最大 Token 数">
        <ProFormSlider name="max_tokens" max={3666} min={100} step={1} />
      </FormItemCard>
    </ModalForm>
  )
}

export default ConfigModal
