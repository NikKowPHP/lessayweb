'use client'

import { Provider } from 'react-redux'
import { store } from './index'
import { OnboardingStateProvider } from './providers/OnboardingStateProvider'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <OnboardingStateProvider>
        {children}
      </OnboardingStateProvider>
    </Provider>
  )
}
