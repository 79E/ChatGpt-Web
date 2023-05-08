import useStore from '@/store'
import { fetchUserInfo } from '@/store/async'
import { useEffect } from 'react'
import LoginModal from '../LoginModal'
import ConfigModal from '../ConfigModal'

type Props = {
  children: React.ReactElement
}

function Global(props: Props) {
  const {
    config,
    models,
    token,
    chats,
    configModal,
    changeConfig,
    setConfigModal,
    addChat,
    changeSelectChatId,
    loginModal,
    setLoginModal
  } = useStore()

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
