import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode
} from 'react'
import api from '@/lib/api'
import type { User } from '@/lib/types'

interface LoginPayload {
  email: string
  password: string
}
interface LoginResponse {
  user: User
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get<User>('/auth/me')
      .then((response) => setUser(response.data))
      .catch((error) => {
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password
    } satisfies LoginPayload)

    setUser(response.data.user)
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
