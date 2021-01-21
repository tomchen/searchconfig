import { extname } from 'path'
import {
  ConfigGetStrategyType,
  ConfigGetStrategyFilepathType,
  ConfigGetStrategyFilenameType,
} from './getconfig'
import { registry } from './registry'

const autoDetectLoader = (fileName: string): string => {
  const ext = extname(fileName)
  if (ext in registry.exts) {
    return registry.exts[ext]
  }
  return 'json'
}

/**
 * Construct a default configGetStrategy (to be used in {@link mergeConfig})
 * @param packageName - The name of the package
 * @param options - options. \{
 *
 * `before`: your configGetStrategy (which takes precedence) to be inserted before the generated configGetStrategy, it can be configGetStrategy object or array of configGetStrategy object
 *
 * `hasYaml`: whether to use YAML
 *
 * \}
 *
 * @example
 */
const defaultConfigGetStrategy = (
  packageName: string,
  options?: {
    before?:
      | ConfigGetStrategyFilepathType
      | ConfigGetStrategyFilenameType
      | ConfigGetStrategyType
    hasYaml?: boolean
  }
): ConfigGetStrategyType => {
  const { before, hasYaml } = {
    hasYaml: false,
    ...options,
  }
  const stra: ConfigGetStrategyType = [
    {
      filename: [
        'package.json',
        `.${packageName}rc`,
        `.${packageName}rc.json`,
        ...(hasYaml ? [`.${packageName}rc.yaml`] : []),
        ...(hasYaml ? [`.${packageName}rc.yml`] : []),
        `.${packageName}rc.js`,
        `.${packageName}rc.cjs`,
        `${packageName}.config.json`,
        ...(hasYaml ? [`${packageName}.config.yaml`] : []),
        ...(hasYaml ? [`${packageName}.config.yml`] : []),
        `${packageName}.config.js`,
        `${packageName}.config.cjs`,
      ],
      ...(hasYaml ? { loader: [null, 'jsonoryaml'] } : {}),
      key: [packageName],
    },
  ]
  if (before !== undefined) {
    if (Array.isArray(before)) {
      stra.splice(0, 0, ...before)
    } else {
      stra.splice(0, 0, before)
    }
  }
  return stra
}

export { autoDetectLoader, defaultConfigGetStrategy }
