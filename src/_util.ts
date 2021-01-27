import * as path from 'path'
import * as fs from 'fs'

/**
 * Check if file (or folder) exists in the specified path
 * @param filePath - File path
 * @returns Promise object that is resolved with a boolean value,
 * or rejected with a string `Error: ${error.code}`
 *
 * @internal
 */
const fileExists = (filePath: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    fs.stat(filePath, (err) => {
      if (err === null) {
        resolve(true)
      } else if (err.code === 'ENOENT') {
        resolve(false)
      } else {
        reject(`Error: ${err.code}`)
      }
    })
  })

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
  let dir: string =
    fromDir !== undefined ? path.resolve(fromDir) : process.cwd()
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

export { findup, fileExists, keyStr2Arr }
