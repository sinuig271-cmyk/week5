import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { getMe } from '../services/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { login, setUser } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')
    if (!token) { navigate('/login'); return }

    login(token)
    // URL에서 토큰 즉시 제거
    window.history.replaceState({}, '', '/auth/callback')

    getMe()
      .then((user) => { setUser(user); navigate('/dashboard') })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      로그인 처리 중…
    </div>
  )
}
