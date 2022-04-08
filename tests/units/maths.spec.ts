import { test } from '@japa/runner'

test('should be true', ({ expect }) => {
  expect(true).toEqual(true)
})

test.group('Maths.add', () => {
  test('add two numbers', ({ expect }) => {
    expect(2 + 2).toEqual(4)
  })

  test('add three numbers', ({ expect }) => {
    expect(2 + 2 + 2).toEqual(6)
  })
})
