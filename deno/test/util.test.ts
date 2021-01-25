import { autoDetectLoader } from '../src/util.ts'
import {
  getConfig,
  defaultConfigGetStrategy,
  registry,
  ConfigNotFoundError,
} from '../src/index.ts'
import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
import { expect, test, describe } from './jest_to_deno.ts'

describe('autoDetectLoader', () => {
  test('autoDetectLoader defaultExtRegistry', () => {
    expect(autoDetectLoader('abcde.js')).toBe('js')
    expect(autoDetectLoader('abcde.cjs')).toBe('js')
    expect(autoDetectLoader('abcde.json')).toBe('json')
    expect(autoDetectLoader('abcde.yaml')).toBe('yaml')
    expect(autoDetectLoader('abcde.yml')).toBe('yaml')
  })

  test('autoDetectLoader defaults to json', () => {
    expect(autoDetectLoader('abcderc')).toBe('json')
    expect(autoDetectLoader('abcderc.')).toBe('json')
    expect(autoDetectLoader('abcderc.js2')).toBe('json')
  })

  test('autoDetectLoader after registry.addExt() & .reset()', () => {
    registry.addExt('.customext', 'customtype')
    registry.addExt('.customext2', 'customtype2')
    expect(autoDetectLoader('abcde.customext')).toBe('customtype')
    expect(autoDetectLoader('abcde.customext2')).toBe('customtype2')
    registry.reset()
    expect(autoDetectLoader('abcde.customext')).toBe('json')
    expect(autoDetectLoader('abcde.customext2')).toBe('json')
  })
})

describe('defaultConfigGetStrategy', () => {
  describe('function', () => {
    test('defaultConfigGetStrategy function without options', () => {
      const stra = defaultConfigGetStrategy('johndoe')
      expect(stra).toEqual([
        {
          filename: [
            'package.json',
            '.johndoerc',
            '.johndoerc.json',
            '.johndoerc.js',
            '.johndoerc.cjs',
            'johndoe.config.json',
            'johndoe.config.js',
            'johndoe.config.cjs',
          ],
          key: ['johndoe'],
        },
      ])
    })

    test('defaultConfigGetStrategy function hasYaml option', () => {
      const stra = defaultConfigGetStrategy('johndoe', {
        hasYaml: true,
      })
      expect(stra).toEqual([
        {
          filename: [
            'package.json',
            '.johndoerc',
            '.johndoerc.json',
            '.johndoerc.yaml',
            '.johndoerc.yml',
            '.johndoerc.js',
            '.johndoerc.cjs',
            'johndoe.config.json',
            'johndoe.config.yaml',
            'johndoe.config.yml',
            'johndoe.config.js',
            'johndoe.config.cjs',
          ],
          loader: [null, 'jsonoryaml'],
          key: ['johndoe'],
        },
      ])
    })

    test('defaultConfigGetStrategy function hasYaml and fromDir option', () => {
      const stra = defaultConfigGetStrategy('johndoe', {
        hasYaml: true,
        fromDir: './test/file_to_test/',
      })
      expect(stra).toEqual([
        {
          filename: [
            'package.json',
            '.johndoerc',
            '.johndoerc.json',
            '.johndoerc.yaml',
            '.johndoerc.yml',
            '.johndoerc.js',
            '.johndoerc.cjs',
            'johndoe.config.json',
            'johndoe.config.yaml',
            'johndoe.config.yml',
            'johndoe.config.js',
            'johndoe.config.cjs',
          ],
          loader: [null, 'jsonoryaml'],
          key: ['johndoe'],
          fromDir: './test/file_to_test/',
        },
      ])
    })

    test('defaultConfigGetStrategy function before (object) option', () => {
      const stra = defaultConfigGetStrategy('johndoe', {
        before: {
          filepath: 'special.config.json',
        },
      })
      expect(stra).toEqual([
        {
          filepath: 'special.config.json',
        },
        {
          filename: [
            'package.json',
            '.johndoerc',
            '.johndoerc.json',
            '.johndoerc.js',
            '.johndoerc.cjs',
            'johndoe.config.json',
            'johndoe.config.js',
            'johndoe.config.cjs',
          ],
          key: ['johndoe'],
        },
      ])
    })

    test('defaultConfigGetStrategy function before (array) & hasYaml option', () => {
      const stra = defaultConfigGetStrategy('johndoe', {
        before: [
          {
            filepath: 'special.config.json',
          },
          {
            filename: ['special.config.js'],
            key: ['special'],
          },
        ],
        hasYaml: true,
      })
      expect(stra).toEqual([
        {
          filepath: 'special.config.json',
        },
        {
          filename: ['special.config.js'],
          key: ['special'],
        },
        {
          filename: [
            'package.json',
            '.johndoerc',
            '.johndoerc.json',
            '.johndoerc.yaml',
            '.johndoerc.yml',
            '.johndoerc.js',
            '.johndoerc.cjs',
            'johndoe.config.json',
            'johndoe.config.yaml',
            'johndoe.config.yml',
            'johndoe.config.js',
            'johndoe.config.cjs',
          ],
          loader: [null, 'jsonoryaml'],
          key: ['johndoe'],
        },
      ])
    })
  })

  describe('defaultConfigGetStrategy with getConfig', () => {
    const expectedConfObj = {
      'option-1': { fruit: 'orange' },
      'option-2': ['yellow'],
      'option-3': 3,
      'option-5': 'hello',
    }

    test('defaultConfigGetStrategy with getConfig before 0', async () => {
      const fromDir = './test/file_to_test/defaultconfig/0/from/'
      const stra = defaultConfigGetStrategy('johndoe', {
        before: [
          {
            filepath: path.join(fromDir, 'special.config.js'),
          },
        ],
      })

      const fileConfig = await getConfig(stra)

      expect(fileConfig).toEqual(expectedConfObj)
    })

    // for (const i of Array.from({ length: 13 }, (_, i) => i + 1)) {
    // test(`defaultConfigGetStrategy with getConfig fromDir simple: ${i.toString()}`, async () => {
    test(`defaultConfigGetStrategy with getConfig fromDir simple from 1 to 13`, async () => {
      registry.addLoader('yaml', yaml.parse)
      for (const i of Array.from({ length: 13 }, (_, i) => i + 1)) {
        const fromDir = `./test/file_to_test/defaultconfig/${i.toString()}/from/`
        const stra = defaultConfigGetStrategy('johndoe', {
          hasYaml: true,
          fromDir,
        })
        try {
          const fileConfig = await getConfig(stra)
          expect(fileConfig).toEqual(expectedConfObj)
        } catch (error) {
          console.log(`i = ${i.toString()}`)
          throw error
        }
      }
    })
    // }

    test('defaultConfigGetStrategy with getConfig fromDir simple not found 14', async () => {
      expect.assertions(2)

      const fromDir = './test/file_to_test/defaultconfig/14/from/'
      const stra = defaultConfigGetStrategy('johndoe', {
        hasYaml: true,
        fromDir,
      })
      const stra0 = stra[0]
      if ('filename' in stra0 && Array.isArray(stra0.filename)) {
        // remove first element 'package.json'
        stra0.filename.shift()
      }
      if ('loader' in stra0 && Array.isArray(stra0.loader)) {
        // remove first element null
        stra0.loader.shift()
      }

      await getConfig(stra).catch((error) => {
        expect(error).toBeInstanceOf(ConfigNotFoundError)
        expect(error).toEqual(
          new ConfigNotFoundError('Cannot find config file')
        )
      })
    })
  })
})
