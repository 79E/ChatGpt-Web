<div align="center">
<img src="./src/assets/vite.svg" style="width:60px;height:60px" alt="icon"/>
<img src="./src/assets/openai.svg" style="width:64px;height:64px;margin:0 32px" alt="icon"/>
<img src="./src/assets/react.svg" style="width:60px;height:60px" alt="icon"/>

<h1 align="center">ChatGPT Web</h1>


可部署商业化的 ChatGpt 网页应用。

[Demo](https://aizj.top/) / [Issues](https://github.com/79E/ChatGPT-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/beggar)

[演示](https://aizj.top/) / [反馈](https://github.com/79E/ChatGPT-Web/issues) 

![cover](https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1682393823691cover.png)

</div>


## 🤖 主要功能

- 用户系统可对使用进行相关限制
- 精心设计的 UI，响应式设计。
- 极快的首屏加载速度（~100kb）
- 海量的内置 prompt 列表，来自[中文](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)和[英文](https://github.com/f/awesome-chatgpt-prompts)
- 一键导出聊天记录，完整的 Markdown 支持
## 🎮 开始使用
**Node 环境**

`node` 需要 `^16 || ^18 || ^19` 版本（node >= 16），可以使用 nvm 管理本地多个 node 版本。

```
# 查看 node 版本
node -v

# 查看 npm 版本
npm -v

# 查看 yarn 版本
yarn -v

```

**1.先 `Fork` 本项目，然后克隆到本地。**
```
git clone https://github.com/79E/ChatGpt-Web.git
```

**2.安装依赖**
```
yarn install
```

**3.运行**
```
yarn dev
```

**4.打包**
```
yarn build
```


## ⛺️ 环境变量

> 本项目大多数配置项都通过环境变量来设置。

#### `VITE_APP_REQUEST_HOST` 

请求服务端的`Host`地址。

#### `VITE_APP_TITLE` 

Chat Web 标题名称。

#### `VITE_APP_LOGO` 

Chat Web Logo。

## 🚧 开发

> 强烈不建议在本地进行开发或者部署，由于一些技术原因，很难在本地配置好 OpenAI API 代理，除非你能保证可以直连 OpenAI 服务器。

#### 本地开发

1. 安装 nodejs 和 yarn，具体细节请询问 ChatGPT；
2. 执行 `yarn install && yarn dev` 即可。

## 🎯 部署
> 直接将打包好的 `dist` 目录上传到服务器即可。WEB项目暂时不直接访问 OpenAI API 所有不要求服务器地址。


#### 贡献者

[见项目贡献者列表](https://github.com/79E/ChatGPT-Web/graphs/contributors)

## 📋 开源协议

[License](https://github.com/79E/ChatGPT-Web/blob/main/LICENSE)
