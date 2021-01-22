/**
 * Error thrown by searchconfig package.
 * Parent Error for {@link ConfigFileEmptyError}, {@link ConfigSyntaxError},
 * {@link ConfigUnknownLoaderError} and {@link ConfigNotFoundError}
 * @public
 */
class ConfigError extends Error {
  public readonly name: string = 'ConfigError'
  public message: string
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigError.prototype)
    Error.captureStackTrace(this, ConfigError)
    this.message = message || ''
  }
}

/**
 * Error specifying that the config file found is empty
 * @public
 */
class ConfigFileEmptyError extends ConfigError {
  name = 'ConfigFileEmptyError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigFileEmptyError.prototype)
    Error.captureStackTrace(this, ConfigFileEmptyError)
    this.message = message || ''
  }
}

/**
 * Error specifying that there is syntax error in the config file
 * found therefore it cannot be parsed
 * @public
 */
class ConfigSyntaxError extends ConfigError {
  name = 'ConfigSyntaxError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigSyntaxError.prototype)
    Error.captureStackTrace(this, ConfigSyntaxError)
    this.message = message || ''
  }
}

/**
 * Error specifying that the loader is unknown
 * @public
 */
class ConfigUnknownLoaderError extends ConfigError {
  name = 'ConfigUnknownLoaderError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigUnknownLoaderError.prototype)
    Error.captureStackTrace(this, ConfigUnknownLoaderError)
    this.message = message || ''
  }
}

/**
 * Error specifying that the config file is not found at all places
 * @public
 */
class ConfigNotFoundError extends ConfigError {
  name = 'ConfigNotFoundError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigNotFoundError.prototype)
    Error.captureStackTrace(this, ConfigNotFoundError)
    this.message = message || ''
  }
}

export {
  ConfigError,
  ConfigFileEmptyError,
  ConfigSyntaxError,
  ConfigUnknownLoaderError,
  ConfigNotFoundError,
}
