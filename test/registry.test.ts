import {
  registry,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
} from '../src/registry'

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
