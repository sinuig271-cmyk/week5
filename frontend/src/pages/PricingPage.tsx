import { useAuthStore } from '../stores/authStore'

const POLAR_ORG_ID = import.meta.env.VITE_POLAR_ORG_ID ?? ''

export default function PricingPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">플랜 선택</h1>
      <p className="text-gray-400 text-center mb-12">언제든 업그레이드/취소 가능</p>
      <div className="grid grid-cols-2 gap-8">
        {/* Free */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-1">무료</h2>
          <p className="text-4xl font-bold mb-6">₩0</p>
          <ul className="text-gray-400 space-y-2 mb-8 text-sm">
            <li>✓ Regularization 섹션</li>
            <li>✓ Overfitting 섹션</li>
            <li>✗ 나머지 3개 섹션</li>
          </ul>
          {user?.plan === 'free' && <p className="text-center text-green-400 text-sm">현재 플랜</p>}
        </div>
        {/* Premium */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-violet-600">
          <h2 className="text-xl font-bold mb-1">프리미엄</h2>
          <p className="text-4xl font-bold mb-6">₩9,900<span className="text-lg text-gray-400">/월</span></p>
          <ul className="text-gray-400 space-y-2 mb-8 text-sm">
            <li>✓ 모든 5개 섹션 접근</li>
            <li>✓ 향후 Week 6+ 콘텐츠</li>
            <li>✓ 언제든 취소 가능</li>
          </ul>
          {user?.plan === 'premium' ? (
            <p className="text-center text-violet-400 text-sm">현재 플랜</p>
          ) : (
            <a
              href={`https://sandbox.polar.sh/${POLAR_ORG_ID}/subscribe`}
              className="block text-center bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700"
            >
              지금 구독하기 →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
