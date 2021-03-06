import { mergeConfig, ConfigMergeStrategyType } from '../src/index'

test('merge, order', async () => {
  const configMergeStrategy: ConfigMergeStrategyType = {
    option_one: [
      ['cliopt', 'option1'],
      ['conf', 'opta'],
      ['default', 'option-1'],
    ],
    option_two: [
      ['conf', 'optb'],
      ['cliopt', 'option2'],
      ['default', 'option-2'],
    ],
    option_three: [
      ['default', 'option-3'],
      ['cliopt', 'option3'],
      ['conf', 'optc'],
    ],
  }

  const fileConfig = {
    opta: 1,
    optb: 'blue',
    optc: 'dog',
  }

  const cliOptions = {
    option1: 0,
    option2: 'red',
    option3: 'cat',
  }

  const defaultConfig = {
    'option-1': 2,
    'option-2': 'yellow',
    'option-3': '',
  }

  const configs = {
    conf: fileConfig,
    default: defaultConfig,
    cliopt: cliOptions,
  }

  const config = mergeConfig(configs, configMergeStrategy)

  const expectedConfig = {
    option_one: 0,
    option_two: 'blue',
    option_three: '',
  }

  expect(config).toEqual(expectedConfig)
})

const configMergeStrategy: ConfigMergeStrategyType = {
  option_one: [
    ['cliopt', 'option1'],
    ['conf', 'opta'],
    ['default', 'option-1'],
  ],
  option_two: [
    ['cliopt', 'option2'],
    ['conf', 'optb'],
    ['default', 'option-2'],
  ],
  option_three: [
    ['cliopt', 'option3'],
    ['conf', 'optc'],
    ['default', 'option-3'],
  ],
}

const fileConfig = {
  opta: 'apple',
}

const cliOptions = {
  option2: 'red',
}

const defaultConfig = {
  'option-1': 'orange',
}

test('merge, some options inexistent', async () => {
  const configs = {
    conf: fileConfig,
    default: defaultConfig,
    cliopt: cliOptions,
  }

  const config = mergeConfig(configs, configMergeStrategy)

  const expectedConfig = {
    option_one: 'apple',
    option_two: 'red',
    option_three: undefined,
  }

  expect(config).toEqual(expectedConfig)
})

test('merge, some config inexistent', async () => {
  const configs = {
    conf: fileConfig,
    cliopt: cliOptions,
  }

  const config2 = mergeConfig(configs, configMergeStrategy)

  const expectedConfig2 = {
    option_one: 'apple',
    option_two: 'red',
    option_three: undefined,
  }

  expect(config2).toEqual(expectedConfig2)
})

test('merge, all configs inexistent', async () => {
  const configs = {}

  const config3 = mergeConfig(configs, configMergeStrategy)

  const expectedConfig3 = {
    option_one: undefined,
    option_two: undefined,
    option_three: undefined,
  }

  expect(config3).toEqual(expectedConfig3)
})

test('merge, some config has extra item', async () => {
  const fileConfig = {
    opta: 'apple',
    optb: 'blue',
    optc: 'dog',
  }

  const cliOptions = {
    option1: 'banana',
    option2: 'red',
    option3: 'cat',
    option8: 'moon',
  }

  const defaultConfig = {
    'option-1': 'orange',
    'option-2': 'yellow',
    'option-3': 'bird',
    'option-10': 'alien',
  }

  const configs = {
    conf: fileConfig,
    default: defaultConfig,
    cliopt: cliOptions,
  }

  const config = mergeConfig(configs, configMergeStrategy)

  const expectedConfig = {
    option_one: 'banana',
    option_two: 'red',
    option_three: 'cat',
  }

  expect(config).toEqual(expectedConfig)

  // if you want a simple merger, use `{...obj, ...obj}` or `Object.assign()` instead:
  // expect({...defaultConfig, ...fileConfig, ...cliOptions}).toEqual({
  //   opta: 'apple',
  //   optb: 'blue',
  //   optc: 'dog',
  //   'option-1': 'orange',
  //   'option-10': 'alien',
  //   'option-2': 'yellow',
  //   'option-3': 'bird',
  //   option1: 'banana',
  //   option2: 'red',
  //   option3: 'cat',
  //   option8: 'moon',
  // })
})
