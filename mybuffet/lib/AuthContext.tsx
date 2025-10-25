'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  
  useEffect(() => {
    setIsClient(true)
  }, [])

  
  useEffect(() => {
    if (!isClient) return

    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
  }, [isClient])

  const login = (userData: User) => {
    setUser(userData)
    if (isClient) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }


  const logout = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
