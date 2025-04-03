function ksort(obj) {
  const keys = Object.keys(obj).sort()
  const sortedObj = {}
  for (let i = 0; i < keys.length; i++) {
    sortedObj[keys[i]] = obj[keys[i]]
  }
  return sortedObj
}

export default ksort
