import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ProtectedRoute() {
  const { accessToken, isLoading } = useAuthStore()
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading…</div>
  if (!accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}
