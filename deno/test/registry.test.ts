import { Registry, registry } from '../src/index.ts'
import {
  jsonoryaml,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
} from '../src/registry.ts'
import { expect, test, describe } from './jest_to_deno.ts'
import { assertThrows } from 'https://deno.land/std@0.84.0/testing/asserts.ts'

describe('registry', () => {
  test('registry.loaders default', () => {
    expect(registry.loaders).toEqual(defaultLoaderRegistry)
  })

  test('registry.loaderErrors default', () => {
    expect(registry.loaderErrors).toEqual(defaultLoaderErrorRegistry)
  })

  test('registry.exts default', () => {
    expect(registry.exts).toEqual(defaultExtRegistry)
  })

  test('registry.addLoader', () => {
    const func = () => ({})
    registry.addLoader('randomextname', func)
    expect(registry.loaders['randomextname']).toEqual(func)
  })

  test('registry.addLoaderError', () => {
    const func = () => new Error('my error')
    registry.addLoaderError('randomextname2', func)
    expect(registry.loaderErrors['randomextname2']).toEqual(func)
  })

  test('registry.addExt and reset', () => {
    registry.addExt('.randomext', 'randomextname')
    expect(registry.exts['.randomext']).toEqual('randomextname')
    registry.reset()
    expect('.randomext' in registry.exts).toBe(false)
  })
})

describe('jsonoryaml without yaml package', () => {
  test('jsonoryaml without yaml package all', () => {
    assertThrows(() => {
      jsonoryaml('---\ntest: 132\ntest2: abc')
    }, SyntaxError)
  })
})

import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
describe('jsonoryaml with yaml package', () => {
  test('jsonoryaml with yaml package all', () => {
    const obj = { test: 132, test2: 'abc' }
    // with yaml package
    registry.addLoader('yaml', yaml.parse)
    expect(jsonoryaml('{ "test": 132, "test2": "abc" }')).toEqual(obj)
    expect(jsonoryaml('---\ntest: 132\ntest2: abc')).toEqual(obj)
  })
})

describe('Registry class', () => {
  test('Registry class new', () => {
    const registry2 = new Registry()
    expect(registry2.loaders).toEqual(defaultLoaderRegistry)
  })
})
