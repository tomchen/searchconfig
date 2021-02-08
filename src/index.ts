import {
  getConfig,
  ConfigGetStrategyType,
  ConfigGetStrategyFilepathType,
  ConfigGetStrategyFilenameType,
} from './getconfig'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig'
import { defaultConfigGetStrategy } from './util'
import {
  Registry,
  registry,
  importLoader,
  LoaderType,
  LoaderErrorFuncType,
} from './registry'

import {
  ConfigError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors'

export {
  getConfig,
  mergeConfig,
  defaultConfigGetStrategy,
  Registry,
  registry,
  importLoader,
  ConfigError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
}

export type {
  LoaderType,
  LoaderErrorFuncType,
  ConfigGetStrategyType,
  ConfigGetStrategyFilepathType,
  ConfigGetStrategyFilenameType,
  ConfigMergeStrategyType,
}
