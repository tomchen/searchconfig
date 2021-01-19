import { getConfig, ConfigGetStrategyType } from './getconfig'
import { mergeConfig, ConfigMergeStrategyType } from './mergeconfig'
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
  ConfigGetStrategyType,
  ConfigMergeStrategyType,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigLoaderError,
  ConfigNotFoundError,
}
