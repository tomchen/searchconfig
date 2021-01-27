import * as path from 'https://deno.land/std@0.84.0/path/mod.ts'
import * as fs from 'https://deno.land/std@0.84.0/fs/mod.ts'
import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
} from './errors.ts'
const __dirname = path.dirname(path.fromFileUrl(import.meta.url))

/**
 * Parse a string that is JSON or YAML: try JSON.parse first,
 * if it is not correct JSON string, then use
 * the loader function registered as 'yaml' to parse the string
 * @param str - string to parse
 * @returns JSON (or YAML) object
 *
 * @internal
 */
const jsonoryaml = (str: string): unknown => {
  try {
    return JSON.parse(str)
  } catch (error) {
    if (
      'yaml' in registry.loaders &&
      registry.loaders.yaml instanceof Function
    ) {
      return registry.loaders.yaml(str)
    }
    throw error
  }
}

/**
 * Type of `loader` parameter in function `registry.addLoader()`
 *
 * @example
 *
 * @public
 */
export type LoaderType = {
  (str: string): unknown | Promise<unknown>
  usePath?: boolean
}

/**
 * Type of `loaderErrorFunc` parameter in function `registry.addLoaderError()`
 *
 * @example
 *
 * @public
 */
export type LoaderErrorFuncType = (error: Error, configPath: string) => Error

type LoaderRegistryType = Record<string, LoaderType>
type LoaderErrorRegistryType = Record<string, LoaderErrorFuncType>
type ExtRegistryType = Record<string, string>

/**
 * Import loader
 * @param filepath - File path
 */
const importLoader = async (filepath: string): Promise<LoaderType> => {
  // const config = (await import(path.relative(__dirname, filepath)))?.default // Node
  const config = (
    await import(path.relative(__dirname, filepath).replace('\\', '/'))
  )?.default
  // if ( // Node
  //   config !== undefined &&
  //   typeof config === 'object' &&
  //   config !== null &&
  //   Object.keys(config).length === 0 &&
  //   JSON.stringify(config) === '{}'
  // ) {
  if (config === undefined) {
    // const fileContent = await fs.promises.readFile(filepath, 'utf8') // Node
    const fileContent = await Deno.readTextFile(filepath)
    if (fileContent.trim() === '') {
      throw new ConfigFileEmptyError(
        `Empty config file ${filepath}`,
        undefined,
        filepath
      )
    } else {
      throw new ConfigSyntaxError(
        `Cannot parse (import) the file ${filepath}`,
        undefined,
        filepath
      )
    }
  }
  return config
}
importLoader.usePath = true

const defaultLoaderRegistry: LoaderRegistryType = {
  import: importLoader,
  json: JSON.parse,
  jsonoryaml,
}
const defaultLoaderErrorRegistry: LoaderErrorRegistryType = {
  import: (error: Error, configPath: string): ConfigSyntaxError =>
    new ConfigSyntaxError(
      `Cannot parse (import) the file ${configPath}. Detail: ${error.message}`,
      error,
      configPath
    ),
  json: (error: Error, configPath: string): ConfigSyntaxError =>
    new ConfigSyntaxError(
      `Cannot parse the JSON file ${configPath}. Detail: ${error.message}`,
      error,
      configPath
    ),
}
const defaultExtRegistry = {
  '.js': 'import',
  '.cjs': 'import',
  '.mjs': 'import',
  '.ts': 'import',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
}

/**
 * Class of the registry of loader functions, loader error functions
 * and exts (file extensions).
 * Although exported, it is not recommended to use this class directly,
 * please use the instance of the class - {@link registry} - instead
 *
 * @internal
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
  addLoader(loaderName: string, loader: LoaderType): void {
    this.loaderRegistry[loaderName.toLowerCase()] = loader
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

/**
 * Registry of loader functions, loader error functions
 * and exts (file extensions).
 */
const registry = new Registry()

export {
  jsonoryaml,
  Registry,
  registry,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
  importLoader,
}
