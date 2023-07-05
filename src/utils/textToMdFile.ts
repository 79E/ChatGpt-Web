export async function textToMdFile(text: string) {
  try {
    // 创建一个Blob对象
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    // 创建一个下载链接
    const link = document.createElement('a')
    link.download = 'aiFile.md'
    link.href = URL.createObjectURL(blob)
    // 将链接添加到页面上，并触发点击事件
    document.body.appendChild(link)
    link.click()
    // 释放URL对象
    URL.revokeObjectURL(link.href)
    Promise.resolve()
  } catch (error) {
    Promise.reject()
  }
}
