import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { copyToClipboard, joinTrim } from '@/utils'
import styles from './index.module.less'
import OpenAiLogo from '@/components/OpenAiLogo'
import { Space, Popconfirm, message, Dropdown } from 'antd'

import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { CopyOutlined, DeleteOutlined, MoreOutlined, RedoOutlined } from '@ant-design/icons'

import ai3Logo from '@/assets/openai/ai3.svg'
import ai4Logo from '@/assets/openai/ai4.svg'
import avatarIcon from '@/assets/avatar.png'
import { PluginInfo } from '@/types'
import PluginCard from '@/components/PluginCard'

const dropdownItems = [
  {
    icon: <CopyOutlined />,
    label: '复制',
    key: 'copyout'
  },
  {
    icon: <RedoOutlined />,
    label: '重试',
    key: 'refurbish'
  },
  {
    icon: <DeleteOutlined />,
    label: '删除',
    key: 'delete'
  }
]

function screenDropdownItems(status: string, position: 'left' | 'right') {
  const newList = dropdownItems.filter((item) => {
    if (status !== 'error' && item.key === 'delete') {
      return false
    }

    if (position !== 'left' && item.key === 'refurbish') {
      return false
    }
    return true
  })

  return [...newList]
}

function ChatMessage({
  position,
  content,
  status,
  time,
  model,
  onDelChatMessage,
  onRefurbishChatMessage,
  pluginInfo
}: {
  position: 'left' | 'right'
  content?: string
  status: 'pass' | 'loading' | 'error' | string
  time: string
  model?: string
  onDelChatMessage?: () => void
  onRefurbishChatMessage?: () => void
  pluginInfo?: PluginInfo
}) {
  const copyMessageKey = 'copyMessageKey'
  const markdownBodyRef = useRef<HTMLDivElement>(null)

  function onCopyOut(text: string) {
    copyToClipboard(text)
      .then(() => {
        message.open({
          key: copyMessageKey,
          type: 'success',
          content: '复制成功'
        })
      })
      .catch(() => {
        message.open({
          key: copyMessageKey,
          type: 'error',
          content: '复制失败'
        })
      })
  }

  function addCopyEvents() {
    if (markdownBodyRef.current) {
      const copyBtn = markdownBodyRef.current.querySelectorAll('.code-block-header__copy')
      copyBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          const code = btn.parentElement?.nextElementSibling?.textContent
          if (code) {
            onCopyOut(code)
          }
        })
      })
    }
  }

  function removeCopyEvents() {
    if (markdownBodyRef.current) {
      const copyBtn = markdownBodyRef.current.querySelectorAll('.code-block-header__copy')
      copyBtn.forEach((btn) => {
        btn.removeEventListener('click', () => {
          // ==== 无需操作 ====
        })
      })
    }
  }

  function highlightBlock(str: string, lang: string, code: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
  }

  const mdi = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language))
      if (validLang) {
        const lang = language ?? ''
        return highlightBlock(hljs.highlight(code, { language: lang }).value, lang, code)
      }
      return highlightBlock(hljs.highlightAuto(code).value, '', code)
    }
  })

  mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
  mdi.use(mdKatex, { blockClass: 'katex-block', errorColor: ' #cc0000', output: 'mathml' })

  const renderText = useMemo(() => {
    const value = content || ''
    if (position === 'right') {
      return (
        <div ref={markdownBodyRef} className="markdown-body">
          {value}
        </div>
      )
    }
    const renderMdHtml = mdi.render(value)
    return (
      <div
        ref={markdownBodyRef}
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: renderMdHtml
        }}
      />
    )
  }, [content, position])

  useLayoutEffect(() => {
    addCopyEvents()
    return () => {
      removeCopyEvents()
    }
  }, [markdownBodyRef.current, content])

  function chatAvatar({
    isShow,
    icon,
    style
  }: {
    isShow: boolean
    icon: string
    style?: React.CSSProperties
  }) {
    if (!isShow) return null
    return (
      <div
        className={styles.chatMessage_avatarCard}
        style={{
          ...style
        }}
      >
        <img src={icon} alt="" />
      </div>
    )
  }

  return (
    <div
      className={styles.chatMessage}
      style={{
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      {useMemo(() => {
        return chatAvatar({
          style: { marginRight: 8 },
          isShow: position === 'left',
          icon: model && model.indexOf('gpt-4') !== -1 ? ai4Logo : ai3Logo
        })
      }, [])}
      <div className={styles.chatMessage_content}>
        <span
          className={styles.chatMessage_content_time}
          style={{
            textAlign: position === 'right' ? 'right' : 'left'
          }}
        >
          {time}
        </span>
        {pluginInfo && <PluginCard {...pluginInfo} />}
        <div
          className={joinTrim([
            styles.chatMessage_content_text,
            position === 'right' ? styles.right : styles.left
          ])}
        >
          {status === 'loading' ? <OpenAiLogo rotate /> : renderText}
          <div
            className={styles.chatMessage_content_operate}
            style={{
              left: position === 'right' ? -20 : 'none',
              right: position === 'left' ? -20 : 'none'
            }}
          >
            <Dropdown
              placement="topRight"
              arrow={{
                pointAtCenter: true
              }}
              destroyPopupOnHide
              trigger={['click', 'hover']}
              menu={{
                items: [...screenDropdownItems(status, position)],
                onClick: ({ key }) => {
                  console.log(key)
                  if (key === 'delete') {
                    onDelChatMessage?.()
                  }

                  if (key === 'refurbish') {
                    onRefurbishChatMessage?.()
                  }

                  if (key === 'copyout' && content) {
                    onCopyOut(content)
                  }
                }
              }}
            >
              <div className={styles.chatMessage_content_operate_icon}>
                <MoreOutlined />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      {useMemo(() => {
        return chatAvatar({
          style: { marginLeft: 8 },
          isShow: position === 'right',
          icon: avatarIcon
        })
      }, [])}
    </div>
  )
}

export default ChatMessage
