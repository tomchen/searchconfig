import { findup, fileExists } from './findup'
import path from 'path'
import fs from 'fs'
const readFile = fs.promises.readFile

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfValueType = any

type ConfType = { [key: string]: ConfValueType }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderFuncType = (str: string) => { [key: string]: any }

type ConfigGetStrategyFilepathType = {
  filepath: string
  loader: string | LoaderFuncType
  key?: string | null
}

type ConfigGetStrategyFilenameType = {
  filename: string | string[]
  loader: string | LoaderFuncType | (string | LoaderFuncType)[]
  key?: string | (string | null)[] | null
  fromDir?: string
}

type ConfigGetStrategyType = (
  | ConfigGetStrategyFilepathType
  | ConfigGetStrategyFilenameType
)[]

const getConfig = async (
  configGetStrategy: ConfigGetStrategyType
): Promise<ConfType | undefined> => {
  try {
    let configPath: string | undefined
    let loader: string | LoaderFuncType | undefined
    let key: string | undefined | null
    for (const straItem of configGetStrategy) {
      if ('filepath' in straItem) {
        const pathFull = path.resolve(straItem.filepath)
        if (await fileExists(pathFull)) {
          // file found!
          configPath = pathFull
          loader = straItem.loader
          if (straItem.key !== undefined && straItem.key !== null) {
            key = straItem.key
          }
          break
        }
      } else {
        // 'filename' in straItem
        let filenames
        if (typeof straItem.filename === 'string') {
          filenames = [straItem.filename]
        } else {
          // Array.isArray(straItem.filename) === true
          filenames = straItem.filename
        }

        console.log(straItem.fromDir || process.cwd())

        const findupRes = await findup(
          filenames,
          straItem.fromDir || process.cwd()
        )
        if (findupRes !== false) {
          // file found!
          configPath = findupRes[0]
          const i = filenames.indexOf(findupRes[1])

          if (typeof straItem.loader === 'string') {
            loader = straItem.loader
          } else if (typeof straItem.loader !== 'function') {
            // Array.isArray(straItem.loader) === true
            loader = straItem.loader[i]
          }

          if (straItem.key !== undefined && straItem.key !== null) {
            if (typeof straItem.key === 'string') {
              key = straItem.key
            } else {
              // Array.isArray(straItem.key) === true
              key = straItem.key[i]
            }
          }
          break
        }
      }
    }

    if (configPath !== undefined) {
      let config
      if (typeof loader === 'string') {
        switch (loader.toLowerCase()) {
          case 'js':
            try {
              config = await require(configPath)
            } catch (error) {
              throw new SyntaxError(`Cannot parse ${configPath}`)
            }
            break
          case 'json':
            config = JSON.parse(await readFile(configPath, 'utf8'))
            break
          default:
            throw new Error('Unknown loader string')
        }
      } else if (typeof loader === 'function') {
        config = loader(await readFile(configPath, 'utf8'))
      } else {
        // loader === undefined
        throw new Error('Unknown loader')
      }
      if (key !== undefined && key !== null) {
        config = config[key]
      }
      return config
    } else {
      throw new Error('Cannot find config file')
    }
  } catch (error) {
    throw error
  }
}

export { getConfig }
