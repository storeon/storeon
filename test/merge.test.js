var merge = require('../merge')

it('merges two object', function () {
  var a = { one: 'a', two: 'a' }
  var b = { two: 'b', three: 'b' }
  expect(merge(a, b)).toEqual({ one: 'a', two: 'b', three: 'b' })
})

it('merges objects immutably', function () {
  var a = { one: 'a' }
  var b = { two: 'b' }
  merge(a, b)
  expect(a).toEqual({ one: 'a' })
  expect(b).toEqual({ two: 'b' })
})
