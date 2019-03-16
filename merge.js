module.exports = function (a, b) {
  var result = { }
  var i
  for (i in a) result[i] = a[i]
  for (i in b) result[i] = b[i]
  return result
}
