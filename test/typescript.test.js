const ts = require('typescript');
const path = require('path');

it('Should fail on unsuitable declaration of events types', function () {
  let program = ts.createProgram([path.join(__dirname, 'typescript', 'typedEventsErrors.ts')], {
    strict: true,
    noImplicitAny: true,
    allowSyntheticDefaultImports: true,
    noEmit: true,
    maxNodeModuleJsDepth: 1
  });
  let allDiagnostics = ts.getPreEmitDiagnostics(program);
  // provided example contains 6 errors
  expect(allDiagnostics.length).toEqual(6);
});
