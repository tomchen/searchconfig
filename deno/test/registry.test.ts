import { Registry } from '../src/index.ts'
import { expect, test, describe } from './jest_to_deno.ts'
import { assertThrows } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

const _registry = new Registry()

describe('_registry', () => {
  test('_registry.loaders default', () => {
    expect(Object.keys(_registry.loaders)).toEqual([
      'import',
      'json',
      'jsonoryaml',
    ])
  })

  test('_registry.loaderErrors default', () => {
    expect(Object.keys(_registry.loaderErrors)).toEqual([
      'import',
      'json',
    ])
  })

  test('_registry.exts default', () => {
    expect(_registry.exts).toEqual({
      '.js': 'import',
      '.cjs': 'import',
      '.mjs': 'import',
      '.ts': 'import',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
    })
  })

  test('_registry.addLoader', () => {
    const func = () => ({})
    _registry.addLoader('randomextname', func)
    expect(_registry.loaders['randomextname']).toEqual(func)
    _registry.reset()
  })

  test('_registry.addLoaderError', () => {
    const func = () => new Error('my error')
    _registry.addLoaderError('randomextname2', func)
    expect(_registry.loaderErrors['randomextname2']).toEqual(func)
    _registry.reset()
  })

  test('_registry.addExt and reset', () => {
    _registry.addExt('.randomext', 'randomextname')
    expect(_registry.exts['.randomext']).toEqual('randomextname')
    _registry.reset()
    expect('.randomext' in _registry.exts).toBe(false)
  })
})

describe('jsonoryaml without yaml package', () => {
  test('jsonoryaml without yaml package all', () => {
    assertThrows(() => {
      _registry.loaders.jsonoryaml('---\ntest: 132\ntest2: abc')
    }, SyntaxError)
  })
})

import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
describe('jsonoryaml with yaml package', () => {
  test('jsonoryaml with yaml package all', () => {
    const obj = { test: 132, test2: 'abc' }
    // with yaml package
    _registry.addLoader('yaml', yaml.parse)
    expect(_registry.loaders.jsonoryaml('{ "test": 132, "test2": "abc" }')).toEqual(obj)
    expect(_registry.loaders.jsonoryaml('---\ntest: 132\ntest2: abc')).toEqual(obj)
    _registry.reset()
  })
})
