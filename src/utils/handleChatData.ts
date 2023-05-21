export function handleChatData(text: string) {
  const data = text
    .split('\n\n')
    .filter((item) => item !== undefined && item !== null && item.trim() !== '')
    .map((d) => {
      return JSON.parse(d)
    })
  return data
}
