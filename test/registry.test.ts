import {
  jsonoryaml,
  registry,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
} from '../src/registry'

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
  test('all', () => {
    expect.assertions(1)
    try {
      jsonoryaml('---\ntest: 132\ntest2: abc')
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError)
    }
  })
})

import * as yaml from 'yaml'
describe('jsonoryaml with yaml package', () => {
  test('all', () => {
    const obj = { test: 132, test2: 'abc' }
    // with yaml package
    registry.addLoader('yaml', yaml.parse)
    expect(jsonoryaml('{ "test": 132, "test2": "abc" }')).toEqual(obj)
    expect(jsonoryaml('---\ntest: 132\ntest2: abc')).toEqual(obj)
  })
})
