# DynamicImport

Automatically load your modules from subdirectories.

# Motivation

They say the voices in my head.<br>
More details: https://habr.com/ru/post/478974/

# Problem

[Dynamic import V8](https://v8.dev/features/dynamic-import) do not support regexp, so we make such decisions:
```
$ tree
.
├── modules
│   ├── a
│   │   └── index.ts
│   ├── b
│   │   └── index.ts
│   └── c
│       └── bobule.ts
├── index.ts
└── package.json

```

```javascript
// some index.ts
import a from './modules/a';
import b from './modules/b';
import c from './modules/c/bobule.ts';

export default {
  module: a,
  dopule: b,
  bobule: c
};
```
and level up index.ts import from ./modules/index.ts from ./moduleName/index.ts...

# How can this be solved

```
npm i @melodyn/dynamicimport

const myModules = dynamicimport(projectRoot, ['path', 'to', '*', '*', 'index.js|ts'], moduleName)
```
This function will return an array of loaded modules, [as in the documentation](https://v8.dev/features/dynamic-import).

To hell with chatter, see the [code](https://github.com/Melodyn/npm-dynamicimport/blob/master/__tests__/lib/index.test.js).

# Local development

Requirements:
* Node: >=12.13 or Docker

Docker commands see in [Makefile](./Makefile)

* `npm ci` or `make expand` for install dependencies
* `npm run test` or `make test` for run tests
