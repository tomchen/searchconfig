import { getConfig, ConfigGetStrategyType } from './getconfig'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig'
import { defaultConfigGetStrategy } from './util'
import {
  registry,
  LoaderFuncType,
  LoaderErrorFuncType,
  Registry,
} from './registry'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors'

export {
  Registry,
  getConfig,
  mergeConfig,
  defaultConfigGetStrategy,
  registry,
  LoaderFuncType,
  LoaderErrorFuncType,
  ConfigGetStrategyType,
  ConfigMergeStrategyType,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
}
