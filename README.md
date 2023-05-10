<div align="center">
<img src="./src/assets/openai.svg" style="width:64px;height:64px;margin:0 32px" alt="icon"/>

<h1 align="center">ChatGPT Web</h1>

English / [简体中文](https://github.com/79E/ChatGpt-Web/blob/master/README-CN.md)

A commercially-viable ChatGpt web application built with React.

可部署商业化的 ChatGpt 网页应用。

[Proxy Demo]() / [Business Demo](https://chatgpt79.vercel.app/) / [Issues](https://github.com/79E/ChatGPT-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/beggar)

[代理（proxy）演示](https://chatgpt79.vercel.app/) / [商业（business）演示](https://aizj.top/) / [反馈](https://github.com/79E/ChatGPT-Web/issues) / [赞助我](https://www.imageoss.com/images/2023/05/06/e38f4a42046a1909773b955c56468d6b83fcd9b5d593c449.jpg)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

![cover](https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1683604333996c1.png)
![cover](https://cdn.jsdelivr.net/gh/duogongneng/testuitc/1683604333960c2.png)

![群组](https://files.catbox.moe/hqwrq4.png)
</div>


## 🤖 Major Function

- The user system can impose relevant restrictions on usage
- Carefully designed UI, responsive design.
- Extremely fast first screen loading speed（~100kb）
- Massive built-in prompt list from[Chinese](https://github.com/PlexPt/awesome-chatgpt-prompts-zh) AND [English](https://github.com/f/awesome-chatgpt-prompts)
- One click export of chat records, complete Markdown support.
- Support for custom API addresses（example：[openAI](https://api.openai.com) / [API2D](https://api2d.com/r/192767)）
## 🎮 Start Using
**Node**

Node requires version `^ 16 | | ^ 18 | | ^ 19 `(node>=16), and NVM can be used to manage multiple local node versions.

```
# View node version
node -v

# View npm version
npm -v

# View yarn version
yarn -v

```

**1.First `Fork` this project, then clone it locally.**
```
git clone https://github.com/79E/ChatGpt-Web.git
```

**2.Installation dependencies**
```
yarn install
```

**3.Run**
```
yarn dev
```

**4.Build**
```
yarn build
```


## ⛺️ Environment Variable

> Most configuration items in this project are set through environment variables.

#### `VITE_APP_REQUEST_HOST` 

Request the `Host` address of the server.

#### `VITE_APP_TITLE` 

Chat Web title.

#### `VITE_APP_LOGO` 

Chat Web Logo。

#### `VITE_APP_MODE` 

Optional application mode: business mode proxy pattern mixed mode.

#### `VITE_APP_AI_BASE_URL`

Built in request address and KEY settings

#### `VITE_APP_AI_KEYS`

The key used by Api requests, supporting multiple keys separated by commas (,)

## 🚧 Develop

> It is strongly not recommended to develop or deploy locally. Due to technical reasons, it is difficult to configure OpenAI API proxies locally, unless you can guarantee direct connection to the OpenAI server.

#### Local development

1. Install `Nodejs` and `Yarn`, please consult ChatGPT for specific details;
2. Execute `yarn install && yarn dev`.

#### Server side

1. Currently, the server is not yet fully developed, so it is currently not open source.
2. Front end request server's [interface document](https://console-docs.apipost.cn/preview/dcf9a900ac5a1154/00eeb0b3f589d8e6) You can develop according to this interface document.

## 🎯 Arrange
> Simply upload the packaged `dist` directory to the server. The WEB project temporarily does not directly access the OpenAI API and does not require a server address.

### Vercel
If you host it on your own Vercel server, you can click the deploy button to start your deployment!

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

## 🧘 Contributor

[See project contributor list](https://github.com/79E/ChatGPT-Web/graphs/contributors)

## 📋 License

[![License MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/79E/ChatGpt-Web/blob/master/license)
