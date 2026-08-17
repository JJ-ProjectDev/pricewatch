import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'
import api from '@/lib/api'
import axios from 'axios'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { isLoading, isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', {
        displayName,
        email,
        password
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError('Email already in use, please use another one.')
        } else if (err.response?.status === 400) {
          setError('Please check your information and try again')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
      return
    }

    try {
      await login(email, password)
      navigate('/watchlist')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Incorrect email or password.')
        } else if (err.response?.status === 400) {
          setError('Please enter a valid email and password.')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="displayName">Display Name:</label>
      <input
        name="displayName"
        type="text"
        id="displayName"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <label htmlFor="email">Email:</label>
      <input
        name="email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        name="password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
