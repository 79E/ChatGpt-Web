import { chatStore, configStore } from '@/store'
// import { fetchUserInfo } from '@/store/async'
import { useEffect } from 'react'
import LoginModal from '../LoginModal'
import ConfigModal from '../ConfigModal'
import { userStore } from '@/store'

type Props = {
  children: React.ReactElement
}

function Global(props: Props) {
  const { models, config, configModal, changeConfig, setConfigModal } = configStore()
  const { chats, addChat, changeSelectChatId } = chatStore()
  const { token, loginModal, setLoginModal } = userStore()

  useEffect(() => {
    if (chats.length <= 0) {
      addChat()
    } else {
      const id = chats[0].id
      changeSelectChatId(id)
    }
    // if (token) {
    //   fetchUserInfo()
    // }
  }, [])

  return (
    <>
      {props.children}
      <LoginModal
        open={loginModal}
        onCancel={() => {
          setLoginModal(false)
        }}
      />
      <ConfigModal
        open={configModal}
        onCancel={() => {
          setConfigModal(false)
        }}
        models={models}
        onChange={changeConfig}
        data={config}
      />
    </>
  )
}
export default Global
