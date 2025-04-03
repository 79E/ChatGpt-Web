import fetch from 'node-fetch'
import { NodeVM } from 'vm2'

async function safeRunScript(options: {
  script: string
  scriptName: string
  params?: { [key: string]: any } | string
  env: { [key: string]: string }
}) {
  const vm2 = new NodeVM({
    console: 'inherit',
    sandbox: { fetch, URLSearchParams },
    eval: false,
    wasm: false,
    require: {
      external: true,
      builtin: ['fs', 'path', 'crypto']
    },
    env: options.env,
    wrapper: 'commonjs'
  })

  const scriptWithExports = `
	  ${options.script}
	  module.exports = { ${options.scriptName} };
	`
  const func = vm2.run(scriptWithExports)
  const result = await func[options.scriptName](options.params)
  return result
}

export default {
  safeRunScript
}
