import { requireFromString } from './_util'
import { ConfigSyntaxError } from './errors'

/**
 * Parse a string that is JSON or YAML: try JSON.parse first,
 * if it is not correct JSON string, then use
 * the loader function registered as 'yaml' to parse the string
 * @param str - string to parse
 * @returns JSON (or YAML) object
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonoryaml = (str: string): any => {
  try {
    return JSON.parse(str)
  } catch (error) {
    if ('yaml' in registry.loaders) {
      return registry.loaders.yaml(str)
    }
    throw error
  }
}

/**
 * Type of `loaderFunc` parameter in function `registry.addLoader()`
 *
 * @example
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderFuncType = (str: string) => { [key: string]: any }

/**
 * Type of `loaderErrorFunc` parameter in function `registry.addLoaderError()`
 *
 * @example
 *
 * @public
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
  jsonoryaml,
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

/**
 * Registry of loader functions, loader error functions
 * and exts (file extensions)
 */
class Registry {
  private loaderRegistry: LoaderRegistryType
  private loaderErrorRegistry: LoaderErrorRegistryType
  private extRegistry: ExtRegistryType

  constructor() {
    this.loaderRegistry = { ...defaultLoaderRegistry }
    this.loaderErrorRegistry = { ...defaultLoaderErrorRegistry }
    this.extRegistry = { ...defaultExtRegistry }
  }

  /**
   * Reset registry
   *
   * @example
   * ```ts
   * registry.reset()
   * ```
   *
   * @public
   */
  reset(): void {
    this.loaderRegistry = { ...defaultLoaderRegistry }
    this.loaderErrorRegistry = { ...defaultLoaderErrorRegistry }
    this.extRegistry = { ...defaultExtRegistry }
  }

  /**
   * Add a loader function into the registry
   * @param loaderName - Loader name
   * @param loaderFunc - Loader function
   *
   * @example
   *
   * @public
   */
  addLoader(loaderName: string, loaderFunc: LoaderFuncType): void {
    this.loaderRegistry[loaderName.toLowerCase()] = loaderFunc
  }

  /**
   * Add a loader error function into the registry
   * @param loaderName - Loader name
   * @param loaderErrorFunc - Loader error function
   *
   * @example
   *
   * @public
   */
  addLoaderError(
    loaderName: string,
    loaderErrorFunc: LoaderErrorFuncType
  ): void {
    this.loaderErrorRegistry[loaderName.toLowerCase()] = loaderErrorFunc
  }

  /**
   * Add an ext (file extension) into the registry
   * @param ext - Ext (file extension) name
   * @param loaderName - Loader name
   *
   * @example
   *
   * @public
   */
  addExt(ext: string, loaderName: string): void {
    this.extRegistry[ext.toLowerCase()] = loaderName
  }

  /**
   * Get loaders in the registry
   * @returns Object containing all loaders
   *
   * @example
   *
   * @public
   */
  get loaders(): LoaderRegistryType {
    return this.loaderRegistry
  }

  /**
   * Get loader error in the registry
   * @returns Object containing all loader errors
   *
   * @example
   *
   * @public
   */
  get loaderErrors(): LoaderErrorRegistryType {
    return this.loaderErrorRegistry
  }

  /**
   * Get ext (file extension) in the registry
   * @returns Object containing all exts (file extensions)
   *
   * @example
   *
   * @public
   */
  get exts(): ExtRegistryType {
    return this.extRegistry
  }
}

const registry = new Registry()

export {
  jsonoryaml,
  registry,
  LoaderFuncType,
  LoaderErrorFuncType,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
}