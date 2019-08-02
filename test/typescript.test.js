let { join, dirname, extname } = require('path')
let { readdirSync, lstatSync } = require('fs')
let ts = require('typescript')

function findTsFiles (dir = join(__dirname, '..')) {
  let result = []
  for (let i of readdirSync(dir)) {
    if (i === 'node_modules') continue
    let path = join(dir, i)
    if (lstatSync(path).isDirectory()) {
      result = result.concat(findTsFiles(path))
    } else if (extname(i) === '.ts' || extname(i) === '.tsx') {
      result.push(path)
    }
  }
  return result
}

it('supports TypeScript', () => {
  let files = findTsFiles().filter(i => !i.includes('test/typescript/error.ts'))
  let tsPackage = dirname(require.resolve('typescript'))
  files.push(join(tsPackage, 'lib.dom.d.ts'))
  files.push(join(tsPackage, 'lib.es2018.d.ts'))

  let program = ts.createProgram(files, {
    allowSyntheticDefaultImports: true,
    strictFunctionTypes: false,
    noUnusedParameters: true,
    noImplicitReturns: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noUnusedLocals: true,
    noImplicitAny: false,
    stripInternal: true,
    module: 'esnext',
    strict: true,
    noEmit: true,
    jsx: 'react'
  })
  expect(ts.getPreEmitDiagnostics(program)).toHaveLength(0)
})

it('fails on wrong types', () => {
  let program = ts.createProgram([join(__dirname, 'typescript', 'error.ts')], {
    allowSyntheticDefaultImports: true,
    maxNodeModuleJsDepth: 1,
    noImplicitAny: true,
    strict: true,
    noEmit: true
  })
  expect(ts.getPreEmitDiagnostics(program)).toHaveLength(6)
})
