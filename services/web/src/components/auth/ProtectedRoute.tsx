import { useAuth } from '@/contexts/AuthContext'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <p>loading...</p>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
