import { getConfig } from '../src/index'
import * as path from 'path'
import * as yaml from 'yaml'

const fromDir = './test/file_to_test/filepath/'
const expectedConfObj = {
  'option-1': { fruit: 'orange' },
  'option-2': ['yellow'],
  'option-3': 3,
  'option-5': 'hello',
}

test('get good.js (with "js" loader (i.e. dynamic require()))', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.js'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.ts (with "js" loader (i.e. dynamic require()))', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.ts'),
      loader: 'js',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.json'),
      loader: 'json',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get key "gmc" in good.package.json', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.package.json'),
      loader: 'json',
      key: 'gmc',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('get good.yaml with npm package "yaml"', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'good.yaml'),
      loader: yaml.parse,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})
