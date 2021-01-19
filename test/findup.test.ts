import { findup, fileExists } from '../src/findup'
import * as path from 'path'

const fromDir = './test/file_to_test/findup/from'

test('fileExists true', async () => {
  expect(await fileExists(path.join(fromDir, 'good.js'))).toBe(true)
})

test('fileExists false', async () => {
  expect(await fileExists(path.join(fromDir, 'inexistentdir/good.js'))).toBe(
    false
  )
})

test('fileExists folder true', async () => {
  expect(await fileExists(fromDir)).toBe(true)
})

import * as fs from 'fs'
test('fileExists non ENOENT error code', async () => {
  const spy = jest.spyOn(fs, 'stat').mockImplementation((_, cb) => {
    cb(
      { name: 'Error', message: 'fake error', code: 'MOCKINGJAY' },
      new fs.Stats()
    )
  })
  const fileExistsPromise = fileExists(fromDir)

  await fileExistsPromise
    .catch((error) => {
      expect(error).toBe('Error: MOCKINGJAY')
    })
    .then(() => {
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
})

test('findup no fromDir true', async () => {
  // in some version of node, process.cwd() returns lowercased drive letter
  const firstUpper = (s: string): string =>
    s.charAt(0).toUpperCase() + s.slice(1)

  const res: false | [string, string] = await findup('package.json')
  expect(res).not.toBe(false)

  if (res !== false) {
    res[0] = firstUpper(res[0])

    expect(res).toEqual([
      firstUpper(path.join(__dirname, '../package.json')),
      'package.json',
    ])
  }
})

test('findup no fromDir false', async () => {
  expect(await findup('inexistent.json')).toBe(false)
})

test('findup fromDir true', async () => {
  expect(await findup('good.js', fromDir)).toEqual([
    path.resolve(fromDir, 'good.js'),
    'good.js',
  ])
})

test('findup fromDir false', async () => {
  expect(await findup('inexistent.js', fromDir)).toBe(false)
})

test('findup fromDir in upper folder', async () => {
  expect(await findup('empty.js', fromDir)).toEqual([
    path.resolve(fromDir, '../empty.js'),
    'empty.js',
  ])
})

test('findup multiple files fromDir true in upper folder', async () => {
  expect(await findup(['inexistent.js', 'empty.js'], fromDir)).toEqual([
    path.resolve(fromDir, '../empty.js'),
    'empty.js',
  ])
})
