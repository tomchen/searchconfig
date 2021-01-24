import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import { exists } from 'https://deno.land/std@0.84.0/fs/mod.ts'

/**
 * Check if file (or folder) exists in the specified path
 * @param filePath - File path
 * @returns Promise object that is resolved with a boolean value,
 * or rejected with a string `Error: ${error.code}`
 *
 * @internal
 */
const fileExists = exists

/**
 * Find a file by walking up parent directories
 * @param filenames - A file name or array of file names to search for
 * @param fromDir - From which directory
 * @returns Promise object that is resolved with
 * [pathOfTheFileFound, nameOfTheFileFound] if found,
 * or with false if not found
 *
 * @internal
 */
const findup = async (
  filenames: string[] | string,
  fromDir?: string
): Promise<[string, string] | false> => {
  if (typeof filenames === 'string') {
    filenames = [filenames]
  }
  let dir: string = fromDir !== undefined ? path.resolve(fromDir) : Deno.cwd()
  const { root } = path.parse(dir)
  let filePath: string

  while (true) {
    for (const filename of filenames) {
      filePath = path.join(dir, filename)
      if (await fileExists(filePath)) {
        return [filePath, filename]
      }
    }

    if (dir === root) {
      return false
    }
    dir = path.dirname(dir)
  }
}

/**
 * Convert dot-separated key string to array
 * @param key - key string
 * @returns Array
 *
 * @example
 * ```ts
 * keyStr2Arr('str1.str2') // ['str1', 'str2']
 * ```
 *
 * @internal
 */
const keyStr2Arr = (key: string): string[] => {
  let keyTemp = key
  const needEscape: boolean =
    keyTemp.search(/\\\./) !== -1 || keyTemp.search(/\\\\/) !== -1
  let escReserved1: string
  let escReserved2: string
  let escReservedRegex1: RegExp
  let escReservedRegex2: RegExp
  if (needEscape) {
    escReserved1 = '\uDBFC\uDF2A'
    escReserved2 = '\uDBAC\uDF4A'
    escReservedRegex1 = new RegExp(escReserved1, 'g')
    escReservedRegex2 = new RegExp(escReserved2, 'g')
    keyTemp = keyTemp
      .replace(/\\\\/g, escReserved2)
      .replace(/\\\./g, escReserved1)
  }
  const arr = keyTemp.split('.')
  if (needEscape) {
    arr.forEach((item, i) => {
      arr[i] = item
        .replace(escReservedRegex2, '\\')
        .replace(escReservedRegex1, '.')
    })
  }
  return arr
}

/**
 * Load module (same as node.js's `require()` but) from string
 * @param str - string to load module from
 * @returns module or other things
 *
 * @example
 * ```ts
 * requireFromString('module.exports = { test: 132 }') // { test: 132 }
 * ```
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireFromString = (str: string): any => {
  // // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const Module = require('module')
  // const filename = ''
  // const m = new Module(filename)
  // m.filename = filename
  // m.paths = Module._nodeModulePaths(path.dirname(''))
  // m._compile(str, filename)
  // return m.exports
}

export { findup, fileExists, keyStr2Arr, requireFromString }
