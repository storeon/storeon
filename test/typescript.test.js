var ts = require('typescript')
var path = require('path')

it('Should fail on unsuitable declaration of events types', function () {
  var program = ts.createProgram(
      [path.join(__dirname, 'typescript', 'typedEventsErrors.ts')], {
    strict: true,
    noImplicitAny: true,
    allowSyntheticDefaultImports: true,
    noEmit: true,
    maxNodeModuleJsDepth: 1
  })

  // provided example contains 6 errors
  expect(ts.getPreEmitDiagnostics(program)).toHaveLength(6)
})
