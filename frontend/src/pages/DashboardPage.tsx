import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { getSections, getProgress } from '../services/courses'
import ProgressBar from '../components/ProgressBar'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data: sections = [] } = useQuery({ queryKey: ['sections'], queryFn: () => getSections(1) })
  const { data: progress = [] } = useQuery({ queryKey: ['progress'], queryFn: getProgress })
  const completedIds = new Set(progress.map((p) => p.section_id))
  const nextSection = sections.find((s) => !completedIds.has(s.id))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">안녕하세요, {user?.name}!</h1>
      <p className="text-gray-400 mb-8">{user?.plan === 'premium' ? '프리미엄 회원' : '무료 플랜'}</p>
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Week 5 진도</h2>
        <ProgressBar completed={completedIds.size} total={sections.length} />
      </div>
      {nextSection && (
        <div className="bg-gray-900 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">이어보기</p>
          <h3 className="font-semibold mb-3">{nextSection.title}</h3>
          <Link
            to={`/courses/week5/${nextSection.id}`}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            계속 학습하기 →
          </Link>
        </div>
      )}
    </div>
  )
}
