import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { ScrambleText } from '@/components/ScrambleText'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { login, isAuthenticated, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
    return <p>Loading..</p>
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
              <h1 className="text-2xl font-mono text-foreground">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back tou your watchlist.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
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
                <Link
                  className="flex text-xs items-center gap-1 text-muted-foreground hover:cursor-pointer hover:text-primary "
                  to="/forgot-password"
                >
                  Forgot your password
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div>
                <button className="bg-primary w-full py-2 text-card font-medium rounded-md mt-5 hover:cursor-pointer hover:text-foreground">
                  Sign In
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 mt-3">
                <p className="text-xs text-muted-foreground">
                  Don't have an account?
                </p>
                <Link to="/register" className="text-sm hover:cursor-pointer">
                  Register
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
