<div align="center">
<img src="./src/assets/openai.svg" style="width:64px;height:64px;margin:0 32px" alt="icon"/>

<h1 align="center">ChatGPT Web</h1>

A commercially-viable ChatGpt web application built with React.

可部署商业化的 ChatGpt 网页应用。

[Issues](https://github.com/79E/ChatGPT-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/beggar) / [赞助我](https://files.catbox.moe/o0znrg.JPG)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

</div>

## 交流&赞助
<h2 align="center"><a href='https://github.com/79E/ChatGpt-Web/issues/71' target='_blank'>服务端代码下载（点我）</a></h2>
<a href='https://t.me/+zMADkTgyzWMyYTk1' target='_blank'>
<img width='46%' style="border-radius: 12px;" src='https://files.catbox.moe/vkkst9.png' />
</a>
<a href='https://t.me/+zMADkTgyzWMyYTk1' target='_blank'>
<img width='46%' style="border-radius: 12px;" src='https://www.helloimg.com/images/2023/06/20/otDPwM.png' />
</a>


## 🐶 演示
### 页面链接

[Web 演示: https://www.aizj.top/](https://www.aizj.top/)

```
演示地址：https://www.aizj.top
后台地址：https://www.aizj.top/admin
管理账号：admin@c.om
管理密码：admin123
```

如需帮助请提交 [Issues](https://github.com/79E/ChatGPT-Web/issues) 或赞赏时留下联系方式。

### 页面截图

![cover](https://files.catbox.moe/tp963e.png)
![cover](https://files.catbox.moe/y5avbx.png)
![cover](https://files.catbox.moe/k16jsz.png)
![cover](https://files.catbox.moe/8o5oja.png)

## 🤖 主要功能

- 后台管理系统,可对用户,Token,商品,卡密等进行管理
- 精心设计的 UI，响应式设计
- 极快的首屏加载速度（~100kb）
- 支持Midjourney绘画和DALL·E模型绘画,GPT4等应用
- 海量的内置 prompt 列表，来自[中文](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)和[英文](https://github.com/f/awesome-chatgpt-prompts)
- 一键导出聊天记录，完整的 Markdown 支持
- 支持自定义API地址（如：[openAI](https://api.openai.com) / [API2D](https://api2d.com/r/192767)）

## 🎮 开始使用
**Node 环境**

`node` 需要 `^16 || ^18 || ^19` 版本（node >= 16.19.0），可以使用 nvm 管理本地多个 node 版本。

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
# web项目启动
yarn dev:web
```

**4.打包**
```
yarn build
```

## ⛺️ 环境变量

> 如果是前后端分离模式部署项目则需要填以下配置

#### `VITE_APP_REQUEST_HOST` 

请求服务端的`Host`地址。

## 🚧 开发

> 强烈不建议在本地进行开发或者部署，由于一些技术原因，很难在本地配置好 OpenAI API 代理，除非你能保证可以直连 OpenAI 服务器。

#### 本地开发

1. 安装 nodejs 和 yarn具体细节请询问 ChatGPT
2. 执行 `yarn install` 即可
3. web项目开发 `yarn dev:web`
4. 服务端项目开发 `yarn dev`
5. 打包项目 `yarn build`

#### 服务端

1. 前端请求服务端的 [接口文档](https://console-docs.apipost.cn/preview/38826c52f656ef05/044846bd536b67bb) 你们可以按照这个接口文档进行开发
2. 如需帮助请提交 [Issues](https://github.com/79E/ChatGPT-Web/issues) 或赞赏时留下联系方式。

## 🎯 部署
> 直接将`WEB`项目打包好的 `dist` 目录上传到服务器即可。注意服务器IP地址位置！

### Vercel
如果你将其托管在自己的 Vercel 服务器上，可点击 deploy 按钮来开始你的部署！

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/79E/ChatGpt-Web)

如需帮助请提交 [Issues](https://github.com/79E/ChatGPT-Web/issues) 或赞赏时留下联系方式。

## 💰 赞助方
<a href='https://www.asiayun.com/aff/BMLOQGTD' target='_blank'>
<img width='50%' style="border-radius: 12px;"  src='https://imgcache.yyyisp.com/img/asiaxcimg.png' />
</a>


## 🧘 贡献者

[见项目贡献者列表](https://github.com/79E/ChatGPT-Web/graphs/contributors)

## 📋 开源协议

[![License MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/79E/ChatGpt-Web/blob/master/license)
