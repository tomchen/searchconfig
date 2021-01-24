import {
  findup,
  fileExists,
  keyStr2Arr,
  requireFromString,
} from '../../deno/_util.ts'
import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import * as fs from 'https://deno.land/std@0.84.0/fs/mod.ts'
import { expect } from 'https://deno.land/x/expect/mod.ts'

const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

const fromDir = './test/file_to_test/findup/from'

Deno.test('fileExists true', async () => {
  expect(await fileExists(path.join(fromDir, 'good.js'))).toBe(true)
})

Deno.test('fileExists false', async () => {
  expect(await fileExists(path.join(fromDir, 'inexistentdir/good.js'))).toBe(
    false
  )
})

Deno.test('fileExists folder true', async () => {
  expect(await fileExists(fromDir)).toBe(true)
})

// Deno.test('fileExists non ENOENT error code', async () => {
//   const spy = jest.spyOn(fs, 'stat').mockImplementation((_, cb) => {
//     cb(
//       { name: 'Error', message: 'fake error', code: 'MOCKINGJAY' },
//       new fs.Stats()
//     )
//   })
//   const fileExistsPromise = fileExists(fromDir)

//   await fileExistsPromise
//     .catch((error) => {
//       expect(error).toBe('Error: MOCKINGJAY')
//     })
//     .then(() => {
//       expect(spy).toHaveBeenCalled()
//       spy.mockRestore()
//     })
// })

Deno.test('findup no fromDir true', async () => {
  // in some version of node, process.cwd() returns lowercased drive letter
  const firstUpper = (s: string): string =>
    s.charAt(0).toUpperCase() + s.slice(1)

  const res: false | [string, string] = await findup('package.json')
  expect(res).not.toBe(false)

  if (res !== false) {
    res[0] = firstUpper(res[0])

    expect(res).toEqual([
      firstUpper(path.join(__dirname, '../../package.json')),
      'package.json',
    ])
  }
})

Deno.test('findup no fromDir false', async () => {
  expect(await findup('inexistent.json')).toBe(false)
})

Deno.test('findup fromDir true', async () => {
  expect(await findup('good.js', fromDir)).toEqual([
    path.resolve(fromDir, 'good.js'),
    'good.js',
  ])
})

Deno.test('findup fromDir false', async () => {
  expect(await findup('inexistent.js', fromDir)).toBe(false)
})

Deno.test('findup fromDir in upper folder', async () => {
  expect(await findup('empty.js', fromDir)).toEqual([
    path.resolve(fromDir, '../empty.js'),
    'empty.js',
  ])
})

Deno.test('findup multiple files fromDir true in upper folder', async () => {
  expect(await findup(['inexistent.js', 'empty.js'], fromDir)).toEqual([
    path.resolve(fromDir, '../empty.js'),
    'empty.js',
  ])
})

Deno.test('keyStr2Arr str1.str2', () => {
  expect(keyStr2Arr('str1.str2')).toEqual(['str1', 'str2'])
})

Deno.test('keyStr2Arr str1..str2', () => {
  expect(keyStr2Arr('str1..str2')).toEqual(['str1', '', 'str2'])
})

Deno.test('keyStr2Arr str1.str2.', () => {
  expect(keyStr2Arr('str1.str2.')).toEqual(['str1', 'str2', ''])
})

Deno.test('keyStr2Arr str1\\.str2', () => {
  expect(keyStr2Arr('str1\\.str2')).toEqual(['str1.str2'])
})

Deno.test('keyStr2Arr str\\\\1.str2', () => {
  expect(keyStr2Arr('str\\\\1.str2')).toEqual(['str\\1', 'str2'])
})

Deno.test('keyStr2Arr str1\\\\.str2', () => {
  expect(keyStr2Arr('str1\\\\.str2')).toEqual(['str1\\', 'str2'])
})

Deno.test('keyStr2Arr str1\\.\\str2', () => {
  expect(keyStr2Arr('str1\\.\\str2')).toEqual(['str1.\\str2'])
})

Deno.test('requireFromString String required from string', () => {
  expect(requireFromString('module.exports = "good"')).toBe('good')
})

Deno.test('requireFromString Number required from string', () => {
  expect(requireFromString('module.exports = 132')).toBe(132)
})

Deno.test('requireFromString Object required from string', () => {
  expect(requireFromString('module.exports = { test: 132 }')).toEqual({
    test: 132,
  })
})
