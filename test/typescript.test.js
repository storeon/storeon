var ts = require('typescript')
var path = require('path')
var fs = require('fs')

var tsdir = path.dirname(require.resolve('typescript'))

it('fails on unsuitable declaration of events types', function () {
  var program = ts.createProgram(
    [path.join(__dirname, 'typescript', 'typedEventsErrors.ts')], {
      strict: true,
      noImplicitAny: true,
      allowSyntheticDefaultImports: true,
      noEmit: true,
      maxNodeModuleJsDepth: 1
    })

  expect(ts.getPreEmitDiagnostics(program)).toHaveLength(10)
})

it('typescript successfully compiles faultless source code', function () {
  var files = findSrcFiles(path.join(__dirname, '..'))
    .filter(function (f) { return f.indexOf('typedEventsErrors') < 0 })
  files.push(path.join(tsdir, 'lib.dom.d.ts'))
  files.push(path.join(tsdir, 'lib.es2018.d.ts'))

  var program = ts.createProgram(files, {
    allowSyntheticDefaultImports: true,
    jsx: 'react',
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    module: 'esnext',
    noImplicitAny: false,
    noImplicitReturns: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    strict: true,
    strictFunctionTypes: false,
    stripInternal: true,
    noEmit: true
  })

  expect(ts.getPreEmitDiagnostics(program)).toHaveLength(0)
})

function findSrcFiles (startPath) {
  if (!fs.existsSync(startPath)) {
    return []
  }
  var res = []
  var files = fs.readdirSync(startPath)
  for (var i = 0; i < files.length; i++) {
    if (files[i] !== 'node_modules') {
      var filename = path.join(startPath, files[i])
      if (fs.lstatSync(filename).isDirectory()) {
        res = [].concat(res, findSrcFiles(filename))
      } else if (filename.indexOf('.ts') > 0 || filename.indexOf('.tsx') > 0) {
        res.push(filename)
      }
    }
  }
  return res
}
