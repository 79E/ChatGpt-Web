function buildQueryString(params) {
  return Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key]
    })
    .join('&')
}

export default buildQueryString
