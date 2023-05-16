import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatGptConfig } from "@/types";

export interface ConfigState {
  // 配置信息
  config: ChatGptConfig;
  // 模型
  models: Array<{
    label: string;
    value: string;
  }>;
  // 配置弹窗开关
  configModal: boolean;
  // 修改配置弹窗
  setConfigModal: (value: boolean) => void;
  // 修改配置
  changeConfig: (config: ChatGptConfig) => void;
}

const configStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      configModal: false,
      models: [
        {
          label: "GPT-3.5",
          value: "gpt-3.5-turbo",
        },
        {
          label: "GPT-4",
          value: "gpt-4",
        },
        // {
        //   label: 'GPT-4-0314',
        //   value: 'gpt-4-0314'
        // },
        // {
        //   label: 'GPT-4-32k',
        //   value: 'gpt-4-32k'
        // },
        // {
        //   label: 'TEXT-002',
        //   value: 'text-davinci-002'
        // },
        // {
        //   label: 'TEXT-003',
        //   value: 'text-davinci-003'
        // },
        // {
        //   label: 'CODE-002',
        //   value: 'code-davinci-002'
        // }
      ],
      config: {
        model: "gpt-3.5-turbo",
        temperature: 0,
        presence_penalty: 0,
        frequency_penalty: 0,
        limit_message: 4,
        max_tokens: 2000,
        api: "https://api.openai.com",
        api_key: "",
      },
      setConfigModal: (value) => set({ configModal: value }),
      changeConfig: (config) =>
        set((state: ConfigState) => ({
          config: { ...state.config, ...config },
        })),
    }),
    {
      name: "config_storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    }
  )
);

export default configStore;
