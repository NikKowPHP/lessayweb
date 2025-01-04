'use client'

import { Provider } from 'react-redux'
import { store } from './index'
import { FC, ReactNode } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider
