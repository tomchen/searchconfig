# Search Config: Get and merge configuration, for Node and Deno

TypeScript (JavaScript) package to get and merge configuration, made for Node.js and Deno.

A lightweight alternative to cosmiconfig, it is easy to use, fully customizable and predictable, and has clear error types that are simple to handle.

[Home Page & Docs (searchconfig.js.org)](https://searchconfig.js.org/) | [GitHub repo](https://github.com/tomchen/searchconfig) | [npm package](https://www.npmjs.com/package/searchconfig) | [Deno Module](https://deno.land/x/searchconfig)

[![npm package](https://img.shields.io/badge/npm%20i-searchconfig-brightgreen)](https://www.npmjs.com/package/searchconfig) [![version number](https://img.shields.io/npm/v/searchconfig?color=green&label=version)](https://github.com/tomchen/searchconfig/releases) [![Actions Status](https://github.com/tomchen/searchconfig/workflows/Test/badge.svg)](https://github.com/tomchen/searchconfig/actions) [![Node.js](https://img.shields.io/badge/node-%3E=10.0-brightgreen.svg?logo=node.js)](https://nodejs.org/) [![Deno](https://img.shields.io/badge/deno-%3E=1.5.0-white.svg?logo=deno)](https://deno.land/x/searchconfig) [![License](https://img.shields.io/github/license/tomchen/searchconfig)](https://github.com/tomchen/searchconfig/blob/main/LICENSE)

For now it's an alpha release and I'll improve the [documentation](https://searchconfig.js.org/). But it should be usable and there is auto-generated [API doc](https://searchconfig.js.org/api) you can read.

```bash
npm install searchconfig
```

Basic Usage:

```js
import { getConfig } from 'https://raw.githubusercontent.com/tomchen/searchconfig/main/deno/src/index.ts'
const stra = defaultConfigGetStrategy('packagename')
const config = await getConfig(stra)
```

With YAML:

```js
import { getConfig, registry } from 'https://raw.githubusercontent.com/tomchen/searchconfig/main/deno/src/index.ts'
import * as yaml from 'yaml'

registry.addLoader('yaml', yaml.parse)
const stra = defaultConfigGetStrategy('packagename', {
  hasYaml: true,
})
const config = await getConfig(stra)
```

The `stra` variable, which represents a default config get strategy, looks like this (the previous one take precedence over the next ones):

```js
[
  {
    filename: [
      'package.json',
      '.packagenamerc',
      '.packagenamerc.json',
      '.packagenamerc.yaml',
      '.packagenamerc.yml',
      '.packagenamerc.js',
      '.packagenamerc.mjs',
      '.packagenamerc.cjs',
      'packagename.config.json',
      'packagename.config.yaml',
      'packagename.config.yml',
      'packagename.config.js',
      'packagename.config.mjs',
      'packagename.config.cjs',
    ],
    loader: [null, 'jsonoryaml'], // only set 'jsonoryaml' for the second item which is '.packagenamerc'
    key: ['packagename'], // only set object key 'jsonoryaml' for the first item which is 'package.json'
  },
]
```
