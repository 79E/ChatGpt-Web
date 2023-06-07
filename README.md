<div align="center">
<img src="./src/assets/openai.svg" style="width:64px;height:64px;margin:0 32px" alt="icon"/>

<h1 align="center">ChatGPT Web</h1>

English / [简体中文](https://github.com/79E/ChatGpt-Web/blob/master/README-CN.md)

A commercially-viable ChatGpt web application built with React.

可部署商业化的 ChatGpt 网页应用。

[Issues](https://github.com/79E/ChatGPT-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/beggar) / [赞助我](https://files.catbox.moe/o0znrg.JPG)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

</div>

## 🐶 Demo
### Link

[Web Demo: https://www.aizj.top/](https://www.aizj.top/)

[Web 演示: https://www.aizj.top/](https://www.aizj.top/)

[Admin Demo: https://www.aizj.top/admin](https://www.aizj.top/admin)

[Admin 演示: https://www.aizj.top/admin](https://www.aizj.top/admin)

If you need help, please submit [Issues](https://github.com/79E/ChatGPT-Web/issues) Or leave contact information when appreciating.
### Snapshot

![cover](https://files.catbox.moe/tp963e.png)
![cover](https://files.catbox.moe/y5avbx.png)
![cover](https://files.catbox.moe/k16jsz.png)
![cover](https://files.catbox.moe/8o5oja.png)

![赞赏](https://files.catbox.moe/wgi8v5.png)

## 🤖 Major Function

- The backend management system can manage users, tokens, products, card passwords, etc
- Carefully designed UI, responsive design
- Extremely fast first screen loading speed (~100kb)
- Supports Midjournal painting, DALL · E model painting, GPT4 and other applications
- Massive built-in prompt list from [Chinese](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)And [English](https://github.com/f/awesome-chatgpt-prompts)
- One click export of chat records, complete Markdown support
- Support for custom API addresses ([openAI](https://api.openai.com) / [API2D]( https://api2d.com/r/192767 ))

## 🎮 Start Using
**Node**

Node requires version `^ 16 | | ^ 18 | | ^ 19 `(node >= 16.19.0), and NVM can be used to manage multiple local node versions.

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
# run web
yarn dev:web
```

**4.Build**
```
yarn build
```


## ⛺️ Environment Variable

> If it is a front-end and back-end separation mode deployment project, the following configuration needs to be filled in

#### `VITE_APP_REQUEST_HOST` 

Request the `Host` address of the server.

## 🚧 Develop

> It is strongly not recommended to develop or deploy locally. Due to technical reasons, it is difficult to configure OpenAI API proxies locally, unless you can guarantee direct connection to the OpenAI server.

#### Local development

1. Please consult ChatGPT for specific details on installing `Nodejs` and `Yarn`
2. Just execute `yarn install`
3. Web Project Development `yarn dev:web`
4. Server side project development `yarn dev`
5. Package Project `yarn build`

#### Server side

1. Front end request server's [interface document](https://console-docs.apipost.cn/preview/38826c52f656ef05/044846bd536b67bb) You can develop according to this interface document.
2. If you need help, please submit [Issues](https://github.com/79E/ChatGPT-Web/issues) Or leave contact information when appreciating. 

## 🎯 Arrange
> Simply upload the packaged `dist` directory of the `WEB` project to the server. Pay attention to the server IP address location!

### Vercel
If you host it on your own Vercel server, you can click the deploy button to start your deployment!

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

If you need help, please submit [Issues](https://github.com/79E/ChatGPT-Web/issues) Or leave contact information when appreciating. 

## 🧘 Contributor

[See project contributor list](https://github.com/79E/ChatGPT-Web/graphs/contributors)

## 📋 License

[![License MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/79E/ChatGpt-Web/blob/master/license)
