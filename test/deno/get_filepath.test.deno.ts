import { getConfig } from '../../deno/index.ts'
import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
import { expect } from "https://deno.land/x/expect/mod.ts"

const fromDir = './test/file_to_test/filepath/'
const expectedConfObj = {
  'option-1': { fruit: 'orange' },
  'option-2': ['yellow'],
  'option-3': 3,
  'option-5': 'hello',
}

test('get good.js (with auto detected loader)', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.js'),
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get good.ts (with js loader)', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.ts'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get good.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'json',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get i_am_js_but_has_json_ext.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'i_am_js_but_has_json_ext.json'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get key gmc in good.package.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.package.json'),
      loader: 'json',
      key: 'gmc',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get key gmc.option in good2.package.json with null loader', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good2.package.json'),
      loader: null,
      key: 'gmc.option',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

import { registry } from '../../deno/registry.ts'
import { ConfigUnknownLoaderError, ConfigSyntaxError } from '../../deno/index.ts'
test('get good.yaml with npm package yaml, unregistered & registered', async () => {
  expect.assertions(6)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.yaml'),
      loader: yaml.parse,
    },
  ]
  expect(await getConfig(configGetStrategy)).toEqual(expectedConfObj)

  const configGetStrategy2 = [
    {
      filepath: path.join(fromDir, 'good.yaml'),
    },
  ]
  await getConfig(configGetStrategy2).catch((error) => {
    expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    expect(error).toEqual(new ConfigUnknownLoaderError('Unknown loader string'))
  })

  registry.addLoader('yaml', yaml.parse)
  expect(await getConfig(configGetStrategy2)).toEqual(expectedConfObj)

  registry.reset()
  await getConfig(configGetStrategy2).catch((error) => {
    expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    expect(error).toEqual(new ConfigUnknownLoaderError('Unknown loader string'))
  })
})

test('get good.yml2 with npm package yaml, unregistered & registered', async () => {
  expect.assertions(6)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.yml2'),
      loader: yaml.parse,
    },
  ]
  expect(await getConfig(configGetStrategy)).toEqual(expectedConfObj)

  const configGetStrategy2 = [
    {
      filepath: path.join(fromDir, 'good.yml2'),
    },
  ]
  await getConfig(configGetStrategy2).catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
  })

  registry.addExt('.yml2', 'yaml2')
  await getConfig(configGetStrategy2).catch((error) => {
    expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    expect(error).toEqual(new ConfigUnknownLoaderError('Unknown loader string'))
  })

  registry.addLoader('yaml2', yaml.parse)
  expect(await getConfig(configGetStrategy2)).toEqual(expectedConfObj)

  registry.reset()
  await getConfig(configGetStrategy2).catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
  })
})

test('loader not present', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('undefined loader', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: undefined,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('null loader', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: null,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})
