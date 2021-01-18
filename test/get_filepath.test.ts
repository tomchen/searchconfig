import { getConfig } from '../src/index'
import path from 'path'
import yaml from 'yaml'

const fromDir = './test/get_test/filepath/'
const expectedConfObj = {
  'option-1': { fruit: 'orange' },
  'option-2': ['yellow'],
  'option-3': 3,
  'option-5': 'hello',
}

test('get good.js (with "js" loader (i.e. dynamic require()))', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.js'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.ts (with "js" loader (i.e. dynamic require()))', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.ts'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'json',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get key "gmc" in good.package.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.package.json'),
      loader: 'json',
      key: 'gmc',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.yaml with npm package "yaml"', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.yaml'),
      loader: yaml.parse,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get malformed.js (require())', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.js'),
      loader: 'js',
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(SyntaxError)
    expect(error.toString()).toMatch(/^SyntaxError: Cannot parse /)
  })
})

test('get malformed.json', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.json'),
      loader: 'json',
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(SyntaxError)
  })
})

test('get malformed.yaml', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.yaml'),
      loader: yaml.parse,
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(Error) // YAMLSemanticError
  })
})

test('unknown loader string', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'inexistentloader',
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject(new Error('Unknown loader string'))
  })
})

test('get inexistent file', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.js'),
      loader: 'js',
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject(new Error('Cannot find config file'))
  })
})

test('get empty.js (require())', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.js'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject({})
})

test('get empty.json', () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.json'),
      loader: 'json',
    },
  ]

  return getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(SyntaxError)
  })
})
