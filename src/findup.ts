import * as path from 'path'
import * as fs from 'fs'

/**
 * Check if file (or folder) exists in the specified path
 * @param filePath - File path
 * @returns Promise object that is resolved with a boolean value,
 * or rejected with a string `Error: ${error.code}`
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

export { findup, fileExists }
