'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  userName: string
  setUserName: (name: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const storedName = localStorage.getItem('userName')
    if (storedTheme) setTheme(storedTheme)
    if (storedName) setUserName(storedName)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const updateUserName = (name: string) => {
    setUserName(name)
    localStorage.setItem('userName', name)
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, userName, setUserName: updateUserName }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

