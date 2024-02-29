# unplugin-replace

[![NPM version](https://img.shields.io/npm/v/unplugin-replace)](https://www.npmjs.com/package/unplugin-replace)

Replace target strings in files while bundling, powered by unplugin.

## Install

```bash
npm i -D unplugin-replace
```

## Usage

```ts
import replace from 'unplugin-replace'

const esbuildPlugin = replace.esbuild([
  {
    from: 'STRING_OR_REGEXP',
    to: 'STRING'
  }
])
```
