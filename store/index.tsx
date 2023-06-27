'use client'

import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { INITIALIZE_STORE } from './constants'
import { appReducer, initialState } from './reducer'
import { actionType, contextDataType } from '@/store/contextTypes.ts'


const appContext = createContext<{
  state: contextDataType,
  dispatch: Dispatch<actionType>
}>({ state: initialState, dispatch: () => null })

type AppWrapperType = {
  children: React.ReactNode
}

export const AppWrapper = ({ children }: AppWrapperType) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    dispatch({
      type: INITIALIZE_STORE,
      payload: initialState,
    })
  }, [])

  return (
    <appContext.Provider value={{ state, dispatch }}>{children}</appContext.Provider>
  )
}

export function useAppContext() {
  return useContext(appContext)
}