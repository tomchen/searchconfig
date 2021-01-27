import { getConfig } from './getconfig'
import { mergeConfig } from './mergeconfig'
import { defaultConfigGetStrategy } from './util'
import { Registry, registry, importLoader } from './registry'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors'

export type LoaderType = import('./registry').LoaderType
export type LoaderErrorFuncType = import('./registry').LoaderErrorFuncType
export type ConfigGetStrategyType = import('./getconfig').ConfigGetStrategyType
export type ConfigGetStrategyFilepathType = import('./getconfig').ConfigGetStrategyFilepathType
export type ConfigGetStrategyFilenameType = import('./getconfig').ConfigGetStrategyFilenameType
export type ConfigMergeStrategyType = import('./mergeconfig').ConfigMergeStrategyType

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
