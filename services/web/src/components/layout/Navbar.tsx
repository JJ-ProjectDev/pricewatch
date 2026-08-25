import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [error, setError] = useState<null | string>(null)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      setError('An error occured while logging out, please try again')
    }
  }

  return (
    <nav className="flex justify-around h-10 items-center ">
      <Link to="/">PriceWatch</Link>
      <Link to="/products">Products</Link>
      {isLoading ? null : isAuthenticated ? (
        <>
          <p>Welcome {user?.displayName}</p>
          <Link to={'/watchlist'}>Watchlist</Link>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Link to={'/login'}>Log in</Link>
          <Link to={'/register'}>Register</Link>
        </>
      )}
    </nav>
  )
}
