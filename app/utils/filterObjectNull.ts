export function filterObjectNull(obj: { [key: string]: any }): any {
  const params = Object.keys(obj)
    .filter((key) => obj[key] !== '' && obj[key] !== null && obj[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {})
  return { ...params }
}
