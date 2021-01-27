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
    expect(myErr.fileName).toBeUndefined()
    myErr.fileName = 'abcd.js'
    expect(myErr.fileName).toEqual('abcd.js')

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
    expect(myErrWithOrigErr.fileName).toBeUndefined()
    myErrWithOrigErr.fileName = 'bgf/abcd.js'
    expect(myErrWithOrigErr.fileName).toEqual('bgf/abcd.js')

    const myErrWithFileName = new v(`oh no! ${k}!`, undefined, 'asd/efg.js')
    expect(myErrWithFileName).toBeInstanceOf(v)
    expect(myErrWithFileName).toBeInstanceOf(Error)
    expect(myErrWithFileName.name).toBe(k)
    expect(myErrWithFileName.message).toBe(`oh no! ${k}!`)
    myErrWithFileName.message = `changed message. ${k}!`
    expect(myErrWithFileName.message).toBe(`changed message. ${k}!`)
    expect(myErrWithFileName.originalError).toBeUndefined()
    myErrWithFileName.originalError = Error('Original error changed!')
    expect(myErrWithFileName.originalError).toEqual(
      Error('Original error changed!')
    )
    expect(myErrWithFileName.fileName).toBe('asd/efg.js')
    myErrWithFileName.fileName = 'abcd.js'
    expect(myErrWithFileName.fileName).toEqual('abcd.js')

    const myErrEmpty = new v('')
    expect(myErrEmpty).toBeInstanceOf(v)
    expect(myErrEmpty).toBeInstanceOf(Error)
    expect(myErrEmpty.name).toBe(k)
    expect(myErrEmpty.message).toBe('')
    myErrEmpty.message = `changed message. ${k}Empty!`
    expect(myErrEmpty.message).toBe(`changed message. ${k}Empty!`)
    expect(myErrEmpty.originalError).toBeUndefined()
    expect(myErrEmpty.fileName).toBeUndefined()

    const myErrUndefined = new v()
    expect(myErrUndefined).toBeInstanceOf(v)
    expect(myErrUndefined).toBeInstanceOf(Error)
    expect(myErrUndefined.name).toBe(k)
    expect(myErrUndefined.message).toBe('')
    myErrUndefined.message = `changed message. ${k}Empty!`
    expect(myErrUndefined.message).toBe(`changed message. ${k}Empty!`)
    expect(myErrUndefined.originalError).toBeUndefined()
    expect(myErrUndefined.fileName).toBeUndefined()
  }
})

test('get malformed.js (import)', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.js'),
      loader: 'import',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.originalError).not.toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Cannot parse \(import\) the file /)
  })
})

test('get malformed.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.json'),
      loader: 'json',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.originalError).not.toBeUndefined()
  })
})

test('get malformed.yaml', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'malformed.yaml'),
      loader: yaml.parse,
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(Error) // YAMLSemanticError
  })
})

test('unknown loader string', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'inexistentloader',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()
  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    expect(error).toEqual(new ConfigUnknownLoaderError('Unknown loader string'))
  })
})

test('get inexistent file', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.js'),
      loader: 'import',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigNotFoundError)
    expect(error).toEqual(new ConfigNotFoundError('Cannot find config file'))
  })
})

test('get empty.js (import)', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.js'),
      loader: 'import',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigFileEmptyError)
    expect(error.originalError).toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Empty config file /)
  })
})

test('get node_exports_no_module.js (import)', async () => {
  // Node.js only
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'node_exports_no_module.js'),
      loader: 'import',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigSyntaxError)
    expect(error.originalError).toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Cannot parse \(import\) the file /)
  })
})

test('get empty.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.json'),
      loader: 'json',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigFileEmptyError)
    expect(error.originalError).toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Empty config file /)
  })
})

test('get empty.package.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.package.json'),
      loader: 'json',
      key: 'gmc',
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigFileEmptyError)
    expect(error.originalError).toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Empty config file /)
  })
})

test('get empty.yaml', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'empty.yaml'),
      loader: yaml.parse,
    },
  ]

  const getConfigPromise = getConfig(configGetStrategy)

  await expect(() => getConfigPromise).rejects.toThrow()

  await getConfigPromise.catch((error) => {
    expect(error).toBeInstanceOf(ConfigFileEmptyError)
    expect(error.originalError).toBeUndefined()
    expect(error.fileName).not.toBeUndefined()
    expect(error.message).toMatch(/^Empty config file /)
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
