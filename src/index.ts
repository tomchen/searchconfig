import { getConfig, ConfigGetStrategyType } from './getconfig'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig'
import { defaultConfigGetStrategy } from './util'
import { registry, LoaderFuncType, LoaderErrorFuncType } from './registry'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors'

export {
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
