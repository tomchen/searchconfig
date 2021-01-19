import { findup, fileExists } from './findup'
import {
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigLoaderError,
  ConfigNotFoundError,
} from './errors'
import requireFromString from './requirefromstring'
import { keyStr2Arr } from './keystr2arr'
import * as path from 'path'
import * as fs from 'fs'
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

const loaderFuncMap: { [key: string]: LoaderFuncType } = {
  js: requireFromString,
  json: JSON.parse,
}

const loaderErrorMap: {
  [key: string]: (error: Error, configPath: string) => Error
} = {
  js: (error, configPath) =>
    new ConfigSyntaxError(`Cannot parse (require) the file ${configPath}`),
  json: (error) => new ConfigSyntaxError(error.message),
}

const getConfigInfo = async (
  configGetStrategy: ConfigGetStrategyType
): Promise<{
  configPath: string | undefined
  loader: string | LoaderFuncType | undefined
  key: string[] | null
}> => {
  try {
    let configPath: string | undefined
    let loader: string | LoaderFuncType | undefined
    let key: string[] | null = null
    for (const straItem of configGetStrategy) {
      if ('filepath' in straItem) {
        const pathFull = path.resolve(straItem.filepath)
        if (await fileExists(pathFull)) {
          // file found!
          configPath = pathFull
          loader = straItem.loader
          if (straItem.key !== undefined && straItem.key !== null) {
            key = keyStr2Arr(straItem.key)
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

        const findupRes = await findup(
          filenames,
          straItem.fromDir || process.cwd()
        )
        if (findupRes !== false) {
          // file found!
          configPath = findupRes[0]
          const i = filenames.indexOf(findupRes[1])

          if (
            typeof straItem.loader === 'string' ||
            typeof straItem.loader === 'function'
          ) {
            loader = straItem.loader
          } else {
            // Array.isArray(straItem.loader) === true
            loader = straItem.loader[i]
          }

          if (straItem.key !== undefined && straItem.key !== null) {
            if (typeof straItem.key === 'string') {
              key = keyStr2Arr(straItem.key)
            } else {
              // Array.isArray(straItem.key) === true
              const keyTemp = straItem.key[i]
              if (keyTemp !== undefined && keyTemp !== null) {
                key = keyStr2Arr(keyTemp)
              }
            }
          }
          break
        }
      }
    }

    if (typeof loader === 'string') {
      loader = loader.toLowerCase()
    }

    return { configPath, loader, key }
  } catch (error) {
    throw error
  }
}

const getLoaderFunc = (
  loader: string | LoaderFuncType | undefined
): LoaderFuncType => {
  try {
    if (typeof loader === 'string') {
      if (!(loader in loaderFuncMap)) {
        throw new ConfigLoaderError('Unknown loader string')
      }
      return loaderFuncMap[loader]
    } else if (typeof loader === 'function') {
      return loader
    } else {
      // loader === undefined
      throw new ConfigLoaderError('Unknown loader')
    }
  } catch (error) {
    throw error
  }
}

const getConfig = async (
  configGetStrategy: ConfigGetStrategyType
): Promise<ConfType | undefined> => {
  try {
    const { configPath, loader, key } = await getConfigInfo(configGetStrategy)

    if (configPath !== undefined) {
      let config

      const fileContent = await readFile(configPath, 'utf8')

      if (fileContent.trim() === '') {
        throw new ConfigFileEmptyError('The config file is empty')
      }

      const loaderFunc = getLoaderFunc(loader)
      try {
        config = loaderFunc(fileContent)
      } catch (error) {
        if (typeof loader === 'string' && loader in loaderErrorMap) {
          throw loaderErrorMap[loader](error, configPath)
        }
        throw error
      }

      if (key !== undefined && key !== null) {
        for (const k of key) {
          config = config[k]
        }
      }

      return config
    } else {
      // configPath === undefined
      throw new ConfigNotFoundError('Cannot find config file')
    }
  } catch (error) {
    throw error
  }
}

export { getConfig, ConfigGetStrategyType }
