var preact = require('../preact')

it('exports bindings for Preact', function () {
  expect(Object.keys(preact)).toEqual(['StoreContext', 'connect'])
})
