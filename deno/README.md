# Get & Merge Config

TypeScript (JavaScript) package to get and merge configuration, made for Node.js and Deno.

A lightweight alternative to cosmiconfig, it is easy to use, fully customizable and predictable, and has clear error types that are simple to handle.

For now it's an alpha release and I'll improve the documentation. But it should be usable and there is auto-generated API doc you can read.

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
