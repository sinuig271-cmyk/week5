import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-8">설정</h1>
      <div className="bg-gray-900 rounded-xl p-6 flex items-center gap-4 mb-6">
        {user?.picture && <img src={user.picture} alt="" className="w-12 h-12 rounded-full" />}
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <p className="text-gray-400 text-sm mb-1">현재 플랜</p>
        <p className="font-semibold capitalize">{user?.plan === 'premium' ? '프리미엄' : '무료'}</p>
        {user?.plan === 'premium' && (
          <a href="https://polar.sh" className="text-violet-400 text-sm mt-2 block">구독 관리 →</a>
        )}
      </div>
      <button onClick={handleLogout} className="w-full bg-red-900/50 text-red-400 py-3 rounded-xl hover:bg-red-900">
        로그아웃
      </button>
    </div>
  )
}
