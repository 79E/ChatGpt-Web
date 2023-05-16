"use client";
import { chatStore, configStore } from "@/store";
import { useEffect } from "react";
import LoginModal from "../LoginModal";
import ConfigModal from "../ConfigModal";

type Props = {
  children?: React.ReactNode;
  dom?: React.ReactNode;
};

function Global(props: Props) {
  const { config, models, configModal, changeConfig, setConfigModal } =
    configStore();

  const { chats, addChat, changeSelectChatId } = chatStore();

  useEffect(() => {
    if (chats.length <= 0) {
      addChat();
    } else {
      const id = chats[0].id;
      changeSelectChatId(id);
    }
  }, []);

  return (
    <>
      {props?.dom}
      {/* <LoginModal
        open={loginModal}
        onCancel={() => {
          setLoginModal(false)
        }}
      /> */}
      <ConfigModal
        open={configModal}
        onCancel={() => {
          setConfigModal(false);
        }}
        models={models}
        onChange={changeConfig}
        data={config}
      />
    </>
  );
}
export default Global;
