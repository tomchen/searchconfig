type ConfType = Record<string, unknown>
type ConfsType = Record<string, ConfType>

/**
 * Type of `configMergeStrategy` parameter in function {@link mergeConfig}
 *
 * @example
 *
 * @public
 */
export type ConfigMergeStrategyType = {
  [key: string]: [string, string][]
}

/**
 * Merge configuration objects
 * @param configs - Array of configuration objects
 * @param configMergeStrategy - Strategy as to how should the config objects be merged
 * @returns Merged configuration object
 *
 * @example
 *
 * @public
 */
const mergeConfig = (
  configs: ConfsType,
  configMergeStrategy: ConfigMergeStrategyType
): ConfType => {
  const retConf: ConfType = {}
  for (const [key, value] of Object.entries(configMergeStrategy)) {
    retConf[key] = value
      .map(([optName, key]) => {
        if (configs[optName] === undefined) {
          return undefined
        }
        return configs[optName][key]
      })
      .reduce((acc, cur) => acc ?? cur)
  }
  return retConf
}

export {
  mergeConfig,
  // ConfigMergeStrategyType,
}
