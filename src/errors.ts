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

class ConfigFileEmptyError extends ConfigError {
  name = 'ConfigFileEmptyError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigFileEmptyError.prototype)
    Error.captureStackTrace(this, ConfigFileEmptyError)
    this.message = message || ''
  }
}

class ConfigSyntaxError extends ConfigError {
  name = 'ConfigSyntaxError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigSyntaxError.prototype)
    Error.captureStackTrace(this, ConfigSyntaxError)
    this.message = message || ''
  }
}

class ConfigLoaderError extends ConfigError {
  name = 'ConfigLoaderError'
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ConfigLoaderError.prototype)
    Error.captureStackTrace(this, ConfigLoaderError)
    this.message = message || ''
  }
}

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
  ConfigLoaderError,
  ConfigNotFoundError,
}
