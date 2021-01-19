import { keyStr2Arr } from '../src/keystr2arr'

test('str1.str2', () => {
  expect(keyStr2Arr('str1.str2')).toEqual(['str1', 'str2'])
})

test('str1..str2', () => {
  expect(keyStr2Arr('str1..str2')).toEqual(['str1', '', 'str2'])
})

test('str1.str2.', () => {
  expect(keyStr2Arr('str1.str2.')).toEqual(['str1', 'str2', ''])
})

test('str1\\.str2', () => {
  expect(keyStr2Arr('str1\\.str2')).toEqual(['str1.str2'])
})

test('str\\\\1.str2', () => {
  expect(keyStr2Arr('str\\\\1.str2')).toEqual(['str\\1', 'str2'])
})

test('str1\\\\.str2', () => {
  expect(keyStr2Arr('str1\\\\.str2')).toEqual(['str1\\', 'str2'])
})

test('str1\\.\\str2', () => {
  expect(keyStr2Arr('str1\\.\\str2')).toEqual(['str1.\\str2'])
})
