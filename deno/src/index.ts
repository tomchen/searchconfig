import { getConfig } from './getconfig.ts'
import { mergeConfig } from './mergeconfig.ts'
import { defaultConfigGetStrategy } from './util.ts'
import { Registry, registry, importLoader } from './registry.ts'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors.ts'

export type LoaderType = import('./registry.ts').LoaderType
export type LoaderErrorFuncType = import('./registry.ts').LoaderErrorFuncType
export type ConfigGetStrategyType = import('./getconfig.ts').ConfigGetStrategyType
export type ConfigGetStrategyFilepathType = import('./getconfig.ts').ConfigGetStrategyFilepathType
export type ConfigGetStrategyFilenameType = import('./getconfig.ts').ConfigGetStrategyFilenameType
export type ConfigMergeStrategyType = import('./mergeconfig.ts').ConfigMergeStrategyType

export {
  getConfig,
  mergeConfig,
  defaultConfigGetStrategy,
  Registry,
  registry,
  importLoader,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
}
