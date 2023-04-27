/* eslint-disable no-async-promise-executor */
export function copyToClipboard(text: string) {
  return new Promise(async (resolve, reject) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text)
        resolve(text)
      } catch (err) {
        // 无操作
      }
    }

    if (typeof document.execCommand === 'function') {
      try {
        const input = document.createElement('textarea')
        input.setAttribute('readonly', 'readonly')
        input.value = text
        document.body.appendChild(input)
        input.select()
        if (document.execCommand('copy')) {
          document.execCommand('copy')
        }
        document.body.removeChild(input)
        resolve(text)
      } catch (error) {
        reject(error)
      }
    } else {
      reject(new Error(undefined))
    }
  })
}
