export function handleChatData(text: string) {
  const lines = text.split('\n\n')
  const data = []
  const parseErrors = []

  const isValidData = (data: any) => {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.dateTime === 'string' &&
      data.dateTime.trim() !== ''
    )
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line !== '') {
      try {
        const parsedData = JSON.parse(line)

        if (isValidData(parsedData)) {
          const { dateTime, ...otherProps } = parsedData
          data.push({ dateTime, ...otherProps })
        } else {
          parseErrors.push(line)
        }
      } catch (error) {
        parseErrors.push(line)
      }
    }
  }

  return data
}
