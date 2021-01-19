import { getConfig, ConfigNotFoundError } from '../src/index'
import * as path from 'path'

const fromDir = './test/file_to_test/filename/from'
const expectedConfObj = {
  'option-1': { fruit: 'orange' },
  'option-2': ['yellow'],
  'option-3': 3,
  'option-5': 'hello',
}

test('simplest uppercased loader string', async () => {
  const configGetStrategy = [
    {
      filename: 'good.js',
      loader: 'JS',
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('simplest no fromDir with key, loader is function', async () => {
  const configGetStrategy = [
    {
      filename: 'package.json',
      loader: JSON.parse,
      key: 'gmc',
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('filename array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.js'],
      loader: 'js',
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('filename and loader array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['js', 'json'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('filename loader and key array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'package.json'],
      loader: ['js', 'json'],
      key: ['inexistent', 'gmc'],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('filename loader and key array', async () => {
  const configGetStrategy = [
    {
      filename: ['inexistent.js', 'good.json'],
      loader: [(str: string) => ({}), 'JSON'],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('filepath and filename mix', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.json'),
      loader: 'json',
    },
    {
      filename: ['inexistent.js', 'good.json'],
      loader: ['inexistent', JSON.parse],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  const fileConfig = await getConfig(configGetStrategy)

  expect(fileConfig).toMatchObject(expectedConfObj)
})

test('cannot find config file', async () => {
  const configGetStrategy = [
    {
      filepath: path.join(fromDir, 'inexistent.json'),
      loader: 'json',
    },
    {
      filename: ['inexistent.js', 'inexistent.json'],
      loader: ['inexistent', JSON.parse],
      key: ['inexistent', null],
      fromDir,
    },
  ]

  await getConfig(configGetStrategy).catch((error) => {
    expect(error).toBeInstanceOf(ConfigNotFoundError)
    expect(error).toMatchObject(new ConfigNotFoundError('Cannot find config file'))
  })
})
