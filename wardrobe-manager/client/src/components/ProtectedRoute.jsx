import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <main className="grid min-h-screen place-items-center bg-ivory text-sm text-muted">Opening your studio…</main>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
