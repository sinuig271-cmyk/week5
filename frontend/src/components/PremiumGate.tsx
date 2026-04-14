import { useUiStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const { upgradeModal, openUpgrade, closeUpgrade } = useUiStore()

  if (user?.plan === 'premium') return <>{children}</>

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-gray-400">이 콘텐츠는 프리미엄 전용입니다.</p>
      <button onClick={openUpgrade} className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700">
        업그레이드 →
      </button>
      {upgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closeUpgrade}>
          <div className="bg-gray-900 rounded-xl p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-2">프리미엄으로 업그레이드</h2>
            <p className="text-gray-400 mb-6">5개 섹션 전체 + 향후 업데이트 포함</p>
            <a href="/pricing" className="block text-center bg-violet-600 text-white py-2 rounded-lg">플랜 보기</a>
            <button onClick={closeUpgrade} className="mt-3 w-full text-gray-500 text-sm">닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}
