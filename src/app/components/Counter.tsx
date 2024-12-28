'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { increment, decrement } from '@/store/features/counterSlice'

export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  )
} 