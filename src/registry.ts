import requireFromString from './requirefromstring'
import { ConfigSyntaxError } from './errors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderFuncType = (str: string) => { [key: string]: any }
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

class Registry {
  private loaderRegistry: LoaderRegistryType
  private loaderErrorRegistry: LoaderErrorRegistryType
  private extRegistry: ExtRegistryType

  constructor() {
    this.loaderRegistry = { ...defaultLoaderRegistry }
    this.loaderErrorRegistry = { ...defaultLoaderErrorRegistry }
    this.extRegistry = { ...defaultExtRegistry }
  }

  reset() {
    this.loaderRegistry = { ...defaultLoaderRegistry }
    this.loaderErrorRegistry = { ...defaultLoaderErrorRegistry }
    this.extRegistry = { ...defaultExtRegistry }
  }

  addLoader(loaderName: string, loaderFunc: LoaderFuncType): void {
    this.loaderRegistry[loaderName.toLowerCase()] = loaderFunc
  }

  addLoaderError(
    loaderName: string,
    loaderErrorFunc: LoaderErrorFuncType
  ): void {
    this.loaderErrorRegistry[loaderName.toLowerCase()] = loaderErrorFunc
  }

  addExt(ext: string, loaderName: string): void {
    this.extRegistry[ext.toLowerCase()] = loaderName
  }

  get loaders(): LoaderRegistryType {
    return this.loaderRegistry
  }

  get loaderErrors(): LoaderErrorRegistryType {
    return this.loaderErrorRegistry
  }

  get exts(): ExtRegistryType {
    return this.extRegistry
  }
}

const registry = new Registry()

export {
  registry,
  LoaderFuncType,
  defaultLoaderRegistry,
  defaultLoaderErrorRegistry,
  defaultExtRegistry,
}
