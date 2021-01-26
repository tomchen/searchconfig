import {
  getConfig,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from '../src/index'
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
    expect(myErr.originalError).toBeUndefined()
    myErr.originalError = Error('Original error changed!')
    expect(myErr.originalError).toEqual(Error('Original error changed!'))

    const myErrWithOrigErr = new v(`oh no! ${k}!`, Error('Original error!'))
    expect(myErrWithOrigErr).toBeInstanceOf(v)
    expect(myErrWithOrigErr).toBeInstanceOf(Error)
    expect(myErrWithOrigErr.name).toBe(k)
    expect(myErrWithOrigErr.message).toBe(`oh no! ${k}!`)
    myErrWithOrigErr.message = `changed message. ${k}!`
    expect(myErrWithOrigErr.message).toBe(`changed message. ${k}!`)
    expect(myErrWithOrigErr.originalError).toEqual(Error('Original error!'))
    myErrWithOrigErr.originalError = Error('Original error changed!')
    expect(myErrWithOrigErr.originalError).toEqual(
      Error('Original error changed!')
    )

    const myErrEmpty = new v('')
    expect(myErrEmpty).toBeInstanceOf(v)
    expect(myErr).toBeInstanceOf(Error)
    expect(myErrEmpty.name).toBe(k)
    expect(myErrEmpty.message).toBe('')
    myErrEmpty.message = `changed message. ${k}Empty!`
    expect(myErrEmpty.message).toBe(`changed message. ${k}Empty!`)
    expect(myErrEmpty.originalError).toBeUndefined()
    myErrEmpty.originalError = Error('Original error changed!')
    expect(myErrEmpty.originalError).toEqual(Error('Original error changed!'))

    const myErrUndefined = new v()
    expect(myErrUndefined).toBeInstanceOf(v)
    expect(myErr).toBeInstanceOf(Error)
    expect(myErrUndefined.name).toBe(k)
    expect(myErrUndefined.message).toBe('')
    myErrUndefined.message = `changed message. ${k}Empty!`
    expect(myErrUndefined.message).toBe(`changed message. ${k}Empty!`)
    expect(myErrUndefined.originalError).toBeUndefined()
    myErrUndefined.originalError = Error('Original error changed!')
    expect(myErrUndefined.originalError).toEqual(
      Error('Original error changed!')
    )
  }
})

test('get malformed.js (require or import)', async () => {
  expect.assertions(3)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.js'),
      loader: 'js',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.originalError).not.toBeUndefined()
    expect(error.message).toMatch(
      /^Cannot parse \(require or import\) the file /
    )
  })
})

test('get malformed.json', async () => {
  expect.assertions(2)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.json'),
      loader: 'json',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.originalError).not.toBeUndefined()
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

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
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

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
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

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigNotFoundError)
    expect(error).toEqual(new ConfigNotFoundError('Cannot find config file'))
  })
})

test('get empty.js (require or import)', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.js'),
      loader: 'js',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

test('get node_exports_no_module.js (require or import)', async () => {
  // Node.js only
  // No errors
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'node_exports_no_module.js'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toEqual({})
})

test('get empty.json', async () => {
  expect.assertions(1)
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.json'),
      loader: 'json',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
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

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
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

  const getConfigPromise = getConfig(configGetStrategy)

  await getConfigPromise.catch((error) => {
    expect(error).toEqual(new ConfigFileEmptyError('The config file is empty'))
  })
})

import * as _util from '../src/_util'
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
