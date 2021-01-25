import { getConfig } from './getconfig.ts'
import { mergeConfig } from './mergeconfig.ts'
import { defaultConfigGetStrategy } from './util.ts'
import { registry } from './registry.ts'

import {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
} from './errors.ts'

export type LoaderFuncType = import('./registry.ts').LoaderFuncType
export type LoaderErrorFuncType = import('./registry.ts').LoaderErrorFuncType
export type ConfigGetStrategyType = import('./getconfig.ts').ConfigGetStrategyType
export type ConfigMergeStrategyType = import('./mergeconfig.ts').ConfigMergeStrategyType

export {
  getConfig,
  mergeConfig,
  defaultConfigGetStrategy,
  registry,
  // LoaderFuncType,
  // LoaderErrorFuncType,
  // ConfigGetStrategyType,
  // ConfigMergeStrategyType,
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
}
