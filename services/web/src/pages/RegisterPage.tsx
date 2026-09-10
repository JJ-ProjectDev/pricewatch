import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import axios from 'axios'
import { ScrambleText } from '@/components/ScrambleText'

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
    <div className="flex flex-col justify-center items-center">
      <div>
        <motion.div
          className="mt-20 font-mono pb-3 text-4xl font-medium pl-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <ScrambleText text={'PriceWatch'} />
        </motion.div>
        <motion.div
          className="bg-card/80 rounded-3xl border-2 border-border"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <div className="mx-10 my-15 flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-2xl font-mono text-foreground">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Start tracking prices in under a minute.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
              <label htmlFor="displayName">Display Name:</label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value)
                }}
                className="outline-none border border-border rounded-md w-full px-6 py-2 mb-5 bg-card focus:border-primary  "
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className="outline-none border border-border rounded-md w-full px-6 py-2 mb-5 bg-card focus:border-primary  "
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                className="outline-none border border-border rounded-md w-full px-6 py-2 bg-card focus:border-primary"
              />
              <div>
                <button className="bg-primary w-full py-2 text-card font-medium rounded-md mt-5 hover:cursor-pointer hover:text-foreground">
                  Create Account
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 mt-3">
                <p className="text-xs text-muted-foreground">
                  Already have an account?
                </p>
                <Link to="/login" className="text-sm hover:cursor-pointer">
                  Sign in
                </Link>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
