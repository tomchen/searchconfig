import { assertEquals } from 'https://deno.land/std@0.84.0/testing/asserts.ts'
import { keyStr2Arr } from '../../deno/_util.ts'

// Deno.test('Test Assert Equals', () => {
//   assertEquals(1, 1)

//   class Foo {}
//   const foo1 = new Foo()
//   const foo2 = new Foo()

//   assertEquals(foo1, foo2)
// })

Deno.test('str1.str2', () => {
  assertEquals(keyStr2Arr('str1.str2'), ['str1', 'str2'])
})
