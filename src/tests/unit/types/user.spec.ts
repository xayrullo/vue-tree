import { test, assertType, expectTypeOf } from 'vitest'
import { User } from "@/types/user"

test('My user type works preperly', () => {
    expectTypeOf(User).toBeFunction()
})