# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 3.1.4
* Fix ES modules support regression.

## 3.1.3
* Fix peer dependency warning for React 17.

## 3.1.2
* Reduced size (by Alexander Zaytsev).

## 3.1.1
* Fixed store in third argument types.

## 3.1
* Added third argument to event handler with store (by @octav47).

## 3.0.7
* Fixed `package.types` path.

## 3.0.6
* Added `package.types`.

## 3.0.5
* Fixed `@change` handling if handler already removed (by @majo44).

## 3.0.4
* Fixed types for `undefined` state (by @majo44).

## 3.0.3
* Fix TypeScript definitions (by @irustm).

## 3.0.2
* Fix TypeScript definitions (by @ligser).

## 3.0.1
* Fix TypeScript definitions (by Phumrapee Limpianchop).

## 3.0
* Add `customContext()` (by Phumrapee Limpianchop).
* Remove Node.js 8 support.

## 2.0.2
* Fix `ref` in wrapped component (by Andrey Ivliev).
* Fix React Native support.
* Reduce package size.

## 2.0.1
* Mark package to be free from side effects.
* Fix Yarn 2 and pnpm support (by Mateusz Burzyński).

## 2.0
* Move to named exports.
* Rename types to `StoreonStore`, `StoreonModule`.
* Move logger into `storeon/devtools`.
* Reduce size.

## 1.0.1
* Better tree-shaking of React/Preact.
* Fix docs (by Johannes Kronmüller).

## 1.0
* Add ES modules support.
* Use ES2016 syntax.
* Use universal `devtools/logger` for Node and bundlers.
* Reduce size.

## 0.9.8
* Fix TypeScript definitions (by @majo44).

## 0.9.7
* Reduce package size.

## 0.9.6
* Show proper warning on usage outside of `Provider` (by Hadeeb Farhan).

## 0.9.5
* Fix DevTools in `<iframe>` with `same-origin` (by Hovhannes Babayan).

## 0.9.4
* Fix logger on `0` in event data.

## 0.9.3
* Improved TypeScript support for typed events and store (by @majo44).

## 0.9.2
* Fix passing options for Redux DevTools (by Hovhannes Babayan).

## 0.9.1
* Fix event types support for `useStoreon` (by Dmitriy Skrylnikov).

## 0.9
* Allow to define types for events (by Pawel Majewski).

## 0.8.7
* Reduce `devtools/logger` size (by WrinkleJ and Alexey Berezin).

## 0.8.6
* Fix `devtools/logger` on React Native.

## 0.8.5
* Fix TypeScript definitions (by Nikita Sivakov).

## 0.8.4
* Fix Preact `connect()` decorator (by Hadeeb Farhan).

## 0.8.3
* Fix Preact `useEffect` re-render issue (by Maksim Karelov).

## 0.8.2
* Fix React `useEffect` re-render issue (by @sHooKDT).

## 0.8.1
* Fix TypeScript definitions (by Eugeny Schibrikov).
* Reduce size (by Hyan Mandian).
* Add project logo (by Anton Lovchikov).
* Improve examples (by Nikolay Puzyrev and Alan H).
* Fix docs (by Theodore Diamantidis and Igor Kamyshev).

## 0.8
* Add `Symbol` support for store keys and event names (by Vlad Rindevich).
* Fix `async`/`await` support (by Vlad Rindevich).
* Fix TypeScript definitions (by Vlad Rindevich).
* Reduce size (by Vlad Rindevich).

## 0.7
* Move event typo check to `devtools`.
* Reduce size.

## 0.6
* Allow to pass DevTools options.
* Reduce size (by Hadeeb Farhan).
* Improve error messages.
* Fix documentation (by Vadim Boltach and Kyle Mills).

## 0.5
* Add `useStoreon` hook.
* Move `connect()` to `storeon/react/connect`.
* Move `logger` to `storeon/devtools/logger`.

## 0.4
* Add `storeon/devtools` with Redux DevTools integration (by Hadeeb Farhan).
* Fix state changes issue (by Hadeeb Farhan).
* Reduce size (by Hadeeb Farhan).

## 0.3
* Add TypeScript definitions (by Hadeeb Farhan).

## 0.2
* Re-render components only if related state keys were changed.
* Add state changes to `@changed` event.
* Add `storeon/logger`.
* Remove `mapStateToProps` function support from `connect()`.
* Reduce size.

## 0.1
* Initial release.
