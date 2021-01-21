import requireFromString from './requirefromstring'
import { ConfigSyntaxError } from './errors'

/**
 * Type of `loaderFunc` parameter in function `registry.addLoader()`
 *
 * @example
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderFuncType = (str: string) => { [key: string]: any }

/**
 * Type of `loaderErrorFunc` parameter in function `registry.addLoaderError()`
 *
 * @example
 */
type LoaderErrorFuncType = (error: Error, configPath: string) => Error

type LoaderRegistryType = { [loaderName: string]: LoaderFuncType }
type LoaderErrorRegistryType = {
  [key: string]: LoaderErrorFuncType
}
type ExtRegistryType = { [ext: string]: string }

const defaultLoaderRegistry = {
  js: requireFromString,
  json: JSON.parse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonoryaml: (str: string): any => {
    try {
      return JSON.parse(str)
    } catch (error) {
      if ('yaml' in registry.loaders) {
        return registry.loaders.yaml(str)
      }
      return JSON.parse(str)
    }
  },
}
const defaultLoaderErrorRegistry = {
  js: (error: Error, configPath: string): ConfigSyntaxError =>
    new ConfigSyntaxError(`Cannot parse (require) the file ${configPath}`),
  json: (error: Error): ConfigSyntaxError =>
    new ConfigSyntaxError(error.message),
}
const defaultExtRegistry = {
  '.js': 'js',
  '.cjs': 'js',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
}

let loaderRegistry: LoaderRegistryType = { ...defaultLoaderRegistry }
let loaderErrorRegistry: LoaderErrorRegistryType = {
  ...defaultLoaderErrorRegistry,
}
let extRegistry: ExtRegistryType = { ...defaultExtRegistry }

/**
 * registry
 */
const registry = {
  reset: (): void => {
    loaderRegistry = { ...defaultLoaderRegistry }
    loaderErrorRegistry = { ...defaultLoaderErrorRegistry }
    extRegistry = { ...defaultExtRegistry }
  },
  addLoader: (loaderName: string, loaderFunc: LoaderFuncType): void => {
    loaderRegistry[loaderName.toLowerCase()] = loaderFunc
  },
  addLoaderError: (
    loaderName: string,
    loaderErrorFunc: LoaderErrorFuncType
  ): void => {
    loaderErrorRegistry[loaderName.toLowerCase()] = loaderErrorFunc
  },
  addExt: (ext: string, loaderName: string): void => {
    extRegistry[ext.toLowerCase()] = loaderName
  },
  /**
   * ss
   */
  get loaders(): LoaderRegistryType {
    return loaderRegistry
  },
  get loaderErrors(): LoaderErrorRegistryType {
    return loaderErrorRegistry
  },
  get exts(): ExtRegistryType {
    return extRegistry
  },
}
const descriptor = {
  configurable: false,
  enumerable: false,
  writable: false,
}
const descriptor2 = {
  configurable: false,
  enumerable: false,
}
Object.defineProperties(registry, {
  reset: descriptor,
  addLoader: descriptor,
  addLoaderError: descriptor,
  addExt: descriptor,
  loaders: descriptor2,
  loaderErrors: descriptor2,
  exts: descriptor2,
})

export {
  registry,
  LoaderFuncType,
  LoaderErrorFuncType,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
}
