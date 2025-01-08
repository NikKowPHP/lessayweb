import { FC, PropsWithChildren, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rehydrateState, selectOnboardingState } from '../slices/onboardingSlice'
import { onboardingStorage } from '@/lib/services/onboardingStorage'
import { AppDispatch } from '..'

export const OnboardingStateProvider: FC<PropsWithChildren> = ({ children }): ReactNode => {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector(selectOnboardingState)

  useEffect(() => {
    dispatch(rehydrateState())
  }, [dispatch])

  useEffect(() => {
    if (state) {
      onboardingStorage.setSession(state)
    }
  }, [state])

  return <>{children}</>
}
