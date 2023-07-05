import html2canvas from 'html2canvas'

export async function htmlToImage(html: string | HTMLElement, title?: string) {
  try {
	title = title ? title : 'ai-shot.png'
    const ele = typeof html === 'string' ? document.getElementById(html) : html;
    const canvas = await html2canvas(ele as HTMLDivElement, {
      useCORS: true
    })
    const imgUrl = canvas.toDataURL('image/png')
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = imgUrl
    tempLink.setAttribute('download', title)
    if (typeof tempLink.download === 'undefined') tempLink.setAttribute('target', '_blank')
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(imgUrl)
    Promise.resolve()
  } catch (error: any) {
    Promise.reject()
  }
}

