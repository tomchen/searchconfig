import * as path from 'path'

/**
 * Load module (same as node.js's `require()` but) from string
 * @param str - string to load module from
 * @returns module or other things
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireFromString = (str: string): any => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Module = require('module')
  const filename = ''
  const m = new Module(filename)
  m.filename = filename
  m.paths = Module._nodeModulePaths(path.dirname(''))
  m._compile(str, filename)
  return m.exports
}

export default requireFromString
