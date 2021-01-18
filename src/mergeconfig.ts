// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfValueType = any

type ConfType = { [key: string]: ConfValueType }
type ConfsType = { [key: string]: ConfType }

interface ConfigMergeStrategyType {
  [key: string]: [string, string][]
}

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
      .reduce((acc, cur) => acc || cur)
  }
  return retConf
}

export { mergeConfig, ConfigMergeStrategyType }
