import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { getMe } from './services/auth'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import DashboardPage from './pages/DashboardPage'
import CourseListPage from './pages/CourseListPage'
import LessonPage from './pages/LessonPage'
import PricingPage from './pages/PricingPage'
import SettingsPage from './pages/SettingsPage'

const queryClient = new QueryClient()

function AuthInit({ children }: { children: React.ReactNode }) {
  const { accessToken, setUser, setLoading } = useAuthStore()
  useEffect(() => {
    if (accessToken) {
      getMe().then(setUser).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [accessToken])
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInit>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/courses/week5" element={<CourseListPage />} />
              <Route path="/courses/week5/:sectionId" element={<LessonPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </AuthInit>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
