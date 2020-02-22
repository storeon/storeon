module.exports = store => {
  store.on('@dispatch', (state, data) => {
    if (data[0] === '@changed') {
      let keys = Object.keys(data[1]).join(', ')
      console.log('changed ' + keys, state)
    } else if (typeof data[1] !== 'undefined') {
      console.log('action ' + String(data[0]), data[1])
    } else {
      console.log('action ' + String(data[0]))
    }
  })
}
