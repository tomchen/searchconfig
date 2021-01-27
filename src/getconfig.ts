import { findup, fileExists, keyStr2Arr } from './_util'
import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors'
import * as path from 'path'
import * as fs from 'fs'
import { registry, LoaderType } from './registry'
import { autoDetectLoader } from './util'

type ConfType = Record<string, unknown>

export type ConfigGetStrategyFilepathType = {
  filepath: string
  loader?: string | LoaderType | null
  key?: string | null
}

export type ConfigGetStrategyFilenameType = {
  filename: string | string[]
  loader?: string | LoaderType | null | (string | LoaderType | null)[]
  key?: string | (string | null)[] | null
  fromDir?: string
}

/**
 * Type of `configGetStrategy` parameter in functions
 * {@link defaultConfigGetStrategy} and {@link getConfig}
 *
 * @example
 *
 * @public
 */
export type ConfigGetStrategyType = (
  | ConfigGetStrategyFilepathType
  | ConfigGetStrategyFilenameType
)[]

const getConfigInfo = async (
  configGetStrategy: ConfigGetStrategyType
): Promise<{
  configPath: string | null
  loader: string | LoaderType
  key: string[] | null
}> => {
  try {
    let configPath: string | null = null
    let loader: string | LoaderType | null = null
    let key: string[] | null = null
    for (const straItem of configGetStrategy) {
      if ('filepath' in straItem) {
        const pathFull = path.resolve(straItem.filepath)
        if (await fileExists(pathFull)) {
          // file found!
          configPath = pathFull
          loader = straItem.loader ?? null
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
          straItem.fromDir ?? process.cwd()
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
          } else if (
            straItem.loader !== null &&
            straItem.loader !== undefined
          ) {
            // Array.isArray(straItem.loader) === true
            loader = straItem.loader[i] ?? null
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

    if (loader === null && configPath !== null) {
      const filename = path.basename(configPath)
      loader = autoDetectLoader(filename)
    }

    if (loader === null) {
      // configPath is actually always null here (ConfigNotFoundError)
      loader = 'jsonoryaml'
    }

    return { configPath, loader, key }
  } catch (error) {
    throw error
  }
}

const getLoaderFunc = (loader: string | LoaderType): LoaderType => {
  if (typeof loader === 'string') {
    if (!(loader in registry.loaders)) {
      throw new ConfigUnknownLoaderError('Unknown loader string')
    }
    return registry.loaders[loader]
  } else {
    // typeof loader === 'function' (loader can't be null here)
    return loader
  }
}

/**
 * Get the configuration file
 * @param configGetStrategy - Strategy as to how to get the config file
 * (the order of search method and file name / path)
 * @returns Configuration object
 *
 * @example
 *
 * @public
 */
const getConfig = async (
  configGetStrategy: ConfigGetStrategyType
): Promise<ConfType | unknown | undefined> => {
  try {
    const { configPath, loader, key } = await getConfigInfo(configGetStrategy)

    if (configPath !== null) {
      let config: ConfType | unknown

      const loaderFunc = getLoaderFunc(loader)

      const tryToLoad = async (p: string): Promise<ConfType | unknown> => {
        try {
          return await loaderFunc(p)
        } catch (error) {
          if (error instanceof ConfigError) {
            throw error
          }
          if (typeof loader === 'string' && loader in registry.loaderErrors) {
            throw registry.loaderErrors[loader](error, configPath)
          }
          throw error
        }
      }

      if (loaderFunc.usePath) {
        config = await tryToLoad(configPath)
      } else {
        const fileContent = await fs.promises.readFile(configPath, 'utf8')
        if (fileContent.trim() === '') {
          throw new ConfigFileEmptyError(
            `Empty config file ${configPath}`,
            undefined,
            configPath
          )
        }
        config = await tryToLoad(fileContent)
      }

      if (key !== undefined && key !== null) {
        for (const k of key) {
          if (typeof config === 'object' && config !== null && k in config) {
            config = (config as ConfType)[k]
          }
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

export { getConfig }
