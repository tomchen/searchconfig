import {
  getConfig,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from '../../src/index'
import * as path from 'path'
import * as yaml from 'yaml'

const fromDir = './test/file_to_test/filepath/'

test('error classes', () => {
  const errs = {
    ConfigError,
    ConfigFileEmptyError,
    ConfigSyntaxError,
    ConfigUnknownLoaderError,
    ConfigNotFoundError,
  }

  for (const [k, v] of Object.entries(errs)) {
    const myErr = new v(`oh no! ${k}!`)
    expect(myErr).toBeInstanceOf(v)
    expect(myErr).toBeInstanceOf(Error)
    expect(myErr.name).toBe(k)
    expect(myErr.message).toBe(`oh no! ${k}!`)
    myErr.message = `changed message. ${k}!`
    expect(myErr.message).toBe(`changed message. ${k}!`)

    const myErrEmpty = new v('')
    expect(myErrEmpty).toBeInstanceOf(v)
    expect(myErr).toBeInstanceOf(Error)
    expect(myErrEmpty.name).toBe(k)
    expect(myErrEmpty.message).toBe('')
    myErrEmpty.message = `changed message. ${k}Empty!`
    expect(myErrEmpty.message).toBe(`changed message. ${k}Empty!`)
  }
})

test('get malformed.js (require)', async () => {
  expect.assertions(2)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.js'),
      loader: 'js',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.message).toMatch(/^Cannot parse \(require\) the file /)
  })
})

test('get malformed.json', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.json'),
      loader: 'json',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
  })
})

test('get malformed.yaml', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.yaml'),
      loader: yaml.parse,
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(Error) // YAMLSemanticError
  })
})

test('unknown loader string', async () => {
  expect.assertions(2)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'inexistentloader',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    expect(error).toEqual(new ConfigUnknownLoaderError('Unknown loader string'))
  })
})

test('get inexistent file', async () => {
  expect.assertions(2)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.js'),
      loader: 'js',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigNotFoundError)
    expect(error).toEqual(new ConfigNotFoundError('Cannot find config file'))
  })
})

test('get empty.js (require)', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.js'),
      loader: 'js',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

test('get empty.json', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.json'),
      loader: 'json',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

test('get empty.package.json', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.package.json'),
      loader: 'json',
      key: 'gmc',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

test('get empty.yaml', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.yaml'),
      loader: yaml.parse,
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

import * as _util from '../../src/_util'
test('mock keyStr2Arr to simulate error', async () => {
  expect.assertions(2)
  const spy = jest.spyOn(_util, 'keyStr2Arr').mockImplementation((_) => {
    throw 'my err'
  })
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good2.package.json'),
      loader: 'json',
      key: 'gmc.option',
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toEqual('my err')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
