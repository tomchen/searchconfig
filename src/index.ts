import { getConfig, ConfigGetStrategyType } from './getconfig'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig'
import { autoDetectLoader, defaultConfigGetStrategy } from './helpers'
import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigLoaderError,
  ConfigNotFoundError,
} from './errors'

export {
  getConfig,
  mergeConfig,
  autoDetectLoader,
  defaultConfigGetStrategy,
  ConfigGetStrategyType,
  ConfigMergeStrategyType,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigLoaderError,
  ConfigNotFoundError,
}
