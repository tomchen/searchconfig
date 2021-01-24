import { getConfig, ConfigGetStrategyType } from './getconfig.ts'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig.ts'
import { defaultConfigGetStrategy } from './util.ts'
import { registry, LoaderFuncType, LoaderErrorFuncType } from './registry.ts'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors.ts'

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
