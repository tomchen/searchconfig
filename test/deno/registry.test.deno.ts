import {
  jsonoryaml,
  registry,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
} from '../../deno/registry.ts'
import { expect } from "https://deno.land/x/expect/mod.ts"

Deno.test('registry.loaders default', () => {
  expect(registry.loaders).toEqual(defaultLoaderRegistry)
})

Deno.test('registry.loaderErrors default', () => {
  expect(registry.loaderErrors).toEqual(defaultLoaderErrorRegistry)
})

Deno.test('registry.exts default', () => {
  expect(registry.exts).toEqual(defaultExtRegistry)
})

Deno.test('registry.addLoader', () => {
  const func = () => ({})
  registry.addLoader('randomextname', func)
  expect(registry.loaders['randomextname']).toEqual(func)
})

Deno.test('registry.addLoaderError', () => {
  const func = () => new Error('my error')
  registry.addLoaderError('randomextname2', func)
  expect(registry.loaderErrors['randomextname2']).toEqual(func)
})

Deno.test('registry.addExt and reset', () => {
  registry.addExt('.randomext', 'randomextname')
  expect(registry.exts['.randomext']).toEqual('randomextname')
  registry.reset()
  expect('.randomext' in registry.exts).toBe(false)
})

describe('jsonoryaml without yaml package', () => {
  Deno.test('all', () => {
    expect.assertions(1)
    try {
      jsonoryaml('---\ntest: 132\ntest2: abc')
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError)
    }
  })
})

import * as yaml from 'https://deno.land/std@0.84.0/encoding/yaml.ts'
describe('jsonoryaml with yaml package', () => {
  Deno.test('all', () => {
    const obj = { test: 132, test2: 'abc' }
    // with yaml package
    registry.addLoader('yaml', yaml.parse)
    expect(jsonoryaml('{ "test": 132, "test2": "abc" }')).toEqual(obj)
    expect(jsonoryaml('---\ntest: 132\ntest2: abc')).toEqual(obj)
  })
})
