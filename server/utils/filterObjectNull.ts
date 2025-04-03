function filterObjectNull(obj: { [key: string]: any }) {
  const params = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== 'undefined')
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
  return { ...params }
}

export default filterObjectNull
