import { getConfig, ConfigNotFoundError } from '../../deno/index.ts'
import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import { expect } from "https://deno.land/x/expect/mod.ts"

const fromDir = './test/file_to_test/filename/from'
const expectedConfObj = {
  'option-1': { fruit: 'orange' },
  'option-2': ['yellow'],
  'option-3': 3,
  'option-5': 'hello',
}

test('simplest uppercased loader string', async () => {
  const configGetStrategy = [
    {
      filename: 'good.js',
      loader: 'JS',
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('simplest exports without module.', async () => {
  const configGetStrategy = [
    {
      filename: 'goodexports.js',
      loader: 'js',
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('simplest no fromDir with key, loader is function', async () => {
  const configGetStrategy = [
    {
      filename: 'package.json',
      loader: JSON.parse,
      key: 'gmc',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('filename array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.js'],
      loader: 'js',
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('filename and loader array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['js', 'json'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('filename, loader and key array, real config file in upper dir', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'package.json'],
      loader: ['js', 'json'],
      key: ['inexistent', 'gmc'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('filename, mixed loader, mixed key array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: [(str: string) => ({}), 'JSON'],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, no loader', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, null loader', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: null,
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, null loader[1]', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['inexistent', null],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, loader array length insufficient', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['inexistent'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, real config file in ../conf/, key[i] undefined', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'conf/inupperconf.json'],
      loader: [(str: string) => ({}), 'JSON'],
      key: ['inexistent'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('idem, key has dot', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good2.package.json'],
      loader: [(str: string) => ({}), 'JSON'],
      key: ['inexistent', 'gmc.option'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('filepath and filename mix', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.json'),
      loader: 'json',
    },
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['inexistent', JSON.parse],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('get i_am_js_but_has_json_ext.json', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'i_am_js_but_has_json_ext.json'],
      loader: ['inexistent', 'js'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual(expectedConfObj)
})

test('cannot find config file', async () => {
  expect.assertions(2)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.json'),
      loader: 'json',
    },
    {
      filename: ['inexistent.js', 'inexistent.json'],
      loader: ['inexistent', JSON.parse],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigNotFoundError)
    expect(error).toEqual(new ConfigNotFoundError('Cannot find config file'))
  })
})
