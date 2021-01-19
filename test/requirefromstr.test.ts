import requireFromString from '../src/requirefromstring'

test('String required from string', () => {
  expect(requireFromString('module.exports = "good"')).toBe('good')
})

test('Number required from string', () => {
  expect(requireFromString('module.exports = 132')).toBe(132)
})

test('Object required from string', () => {
  expect(requireFromString('module.exports = { test: 132 }')).toEqual({
    test: 132,
  })
})
