import { getConfig, registry } from '../src/index.ts'
import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
import { ConfigUnknownLoaderError, ConfigSyntaxError } from '../src/index.ts'
import { expect, test, describe } from './jest_to_deno.ts'
import { assertThrowsAsync } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

const fromDir = './test/file_to_test/filepath/'

describe('Get primitive', () => {
  test('single_number.js', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_number.js'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toBe(274)
  })

  test('single_number.json', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_number.json'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toBe(274)
  })

  test('single_string.js', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_string.js'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toBe('hoho')
  })

  test('single_string.json', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_string.json'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toBe('hoho')
  })

  test('single_function.js', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_function.js'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(typeof fileConfig).toBe('function')
  })

  test('single_function.json', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'single_function.json'),
      },
    ]

    const getConfigPromise = getConfig(configGetStrategy)

    await assertThrowsAsync(() => getConfigPromise)

    await getConfigPromise.catch((error) => {
      expect(error).toBeInstanceOf(ConfigSyntaxError)
      expect(error.originalError).not.toBeUndefined()
    })
  })
})

describe('Get object', () => {
  const expectedConfObj = {
    'option-1': { fruit: 'orange' },
    'option-2': ['yellow'],
    'option-3': 3,
    'option-5': 'hello',
  }

  test('get good.js (with import loader)', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'good.js'),
        loader: 'import',
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toEqual(expectedConfObj)
  })

  test('get good.ts (with auto detected loader)', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'good.ts'),
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toEqual(expectedConfObj)
  })

  // test('get good.cjs (with auto detected loader)', async () => {
  //   const configGetStrategy = [
  //     {
  //       filepath: path.join(fromDir, 'good.cjs'),
  //     },
  //   ]

  //   const fileConfig = await getConfig(configGetStrategy)

  //   expect(fileConfig).toEqual(expectedConfObj)
  // })

  test('get good.mjs (with auto detected loader)', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'good.mjs'),
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

  test('get i_am_json_but_has_js_ext.js', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'i_am_json_but_has_js_ext.js'),
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
        loader: 'import',
      },
    ]

    const getConfigPromise = getConfig(configGetStrategy)

    await assertThrowsAsync(() => getConfigPromise)

    await getConfigPromise.catch((error) => {
      expect(error).toBeInstanceOf(ConfigSyntaxError)
      expect(error.originalError).not.toBeUndefined()
      expect(error.fileName).not.toBeUndefined()
      expect(error.message).toMatch(/^Cannot parse \(import\) the file /)
    })
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

  test('get key gmc.option.inexistent in good2.package.json', async () => {
    const configGetStrategy = [
      {
        filepath: path.join(fromDir, 'good2.package.json'),
        key: 'gmc.option.inexistent',
      },
    ]

    const fileConfig = await getConfig(configGetStrategy)

    expect(fileConfig).toEqual(expectedConfObj) // same as `key: 'gmc.option'`
  })

  test('get good.yaml with npm package yaml, unregistered & registered', async () => {
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
    // const getConfigPromise = getConfig(configGetStrategy2)
    // await assertThrowsAsync(() => getConfigPromise)
    // await getConfigPromise.catch((error) => {
    //   expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
    //   expect(error).toEqual(
    //     new ConfigUnknownLoaderError('Unknown loader string')
    //   )
    // })

    registry.addLoader('yaml', yaml.parse)
    expect(await getConfig(configGetStrategy2)).toEqual(expectedConfObj)

    registry.reset()
    const getConfigPromise2 = getConfig(configGetStrategy2)
    await assertThrowsAsync(() => getConfigPromise2)
    await getConfigPromise2.catch((error) => {
      expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
      expect(error).toEqual(
        new ConfigUnknownLoaderError('Unknown loader string')
      )
    })
  })

  test('get good.yml2 with npm package yaml, unregistered & registered', async () => {
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
    const getConfigPromise = getConfig(configGetStrategy2)
    await assertThrowsAsync(() => getConfigPromise)
    await getConfigPromise.catch((error) => {
      expect(error).toBeInstanceOf(ConfigSyntaxError)
      expect(error.originalError).not.toBeUndefined()
    })

    registry.addExt('.yml2', 'yaml2')
    const getConfigPromise2 = getConfig(configGetStrategy2)
    await assertThrowsAsync(() => getConfigPromise2)
    await getConfigPromise2.catch((error) => {
      expect(error).toBeInstanceOf(ConfigUnknownLoaderError)
      expect(error).toEqual(
        new ConfigUnknownLoaderError('Unknown loader string')
      )
    })

    registry.addLoader('yaml2', yaml.parse)
    expect(await getConfig(configGetStrategy2)).toEqual(expectedConfObj)

    registry.reset()
    const getConfigPromise3 = getConfig(configGetStrategy2)
    await assertThrowsAsync(() => getConfigPromise3)
    await getConfigPromise3.catch((error) => {
      expect(error).toBeInstanceOf(ConfigSyntaxError)
      expect(error.originalError).not.toBeUndefined()
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
})
