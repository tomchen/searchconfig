import { autoDetectLoader, defaultConfigGetStrategy } from '../src/util'
import { registry } from '../src/registry'

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

test('defaultConfigGetStrategy without options', () => {
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

test('defaultConfigGetStrategy hasYaml option', () => {
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

test('defaultConfigGetStrategy before (object) option', () => {
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

test('defaultConfigGetStrategy before (array) & hasYaml option', () => {
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
