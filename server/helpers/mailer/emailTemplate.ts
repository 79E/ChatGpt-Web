function code(code: string, title?: string) {
  return `<div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="opacity: 1;">
	<style>
		.qmbox body {
			font-family: Arial, sans-serif;
			background-color: #f2f2f2;
		}

		.qmbox .container {
			box-sizing: border-box;
			max-width: 700px;
			margin: 0 auto;
			padding: 40px;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
		}

		.qmbox h1 {
			display: flex;
			align-items: center;
			font-size: 24px;
			color: #333;
		}

		.qmbox p {
			font-size: 16px;
			color: #666;
			margin-bottom: 10px;
		}

		.qmbox .code {
			font-size: 40px;
			color: #333;
			text-align: center;
			letter-spacing: 12px;
			font-weight: bold;
			padding: 20px 0 60px 0 ;
		}

		.qmbox .footer {
			font-size: 14px;
			text-align: center;
			margin-top: 20px;
			line-height: 0.4;
		}

		.qmbox .icon {
			display: inline-block;
			width: 35px;
			height: 35px;
			background-image: url('https://cdn.oocuo.com/assets/images/logo.svg');
			background-size: cover;
			margin-right: 10px;
		}
	</style>

	<div class="container">
		<h1><span class="icon"></span>${title} 验证码</h1>
		<p>以下是您本次请求的验证码，验证码有效期为6分钟，请勿透露给他人！</p>
		<p class="code animation">${code}</p>
		<div class="footer">
			<p>👋期待与您保持联系</p>
		</div>
	</div>
</div>`
}

export default {
  code
}
