import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getSections, getProgress } from '../services/courses'
import ProgressBar from '../components/ProgressBar'
import { Lock, CheckCircle, Play } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const WEEK5_COURSE_ID = 1

export default function CourseListPage() {
  const { user } = useAuthStore()
  const { data: sections = [] } = useQuery({ queryKey: ['sections'], queryFn: () => getSections(WEEK5_COURSE_ID) })
  const { data: progress = [] } = useQuery({ queryKey: ['progress'], queryFn: getProgress })

  const completedIds = new Set(progress.map((p) => p.section_id))

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Week 5 — 딥러닝 핵심</h1>
      <p className="text-gray-400 mb-6">5개 섹션 · 무료 2개 + 프리미엄 3개</p>

      <div className="mb-8">
        <ProgressBar completed={completedIds.size} total={sections.length} />
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section) => {
          const done = completedIds.has(section.id)
          const locked = !section.is_free && user?.plan !== 'premium'
          return (
            <Link
              key={section.id}
              to={locked ? '/pricing' : `/courses/week5/${section.id}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                locked ? 'border-gray-800 opacity-50 cursor-not-allowed' : 'border-gray-700 hover:border-blue-500'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {locked ? <Lock size={18} className="text-gray-500" /> :
                 done  ? <CheckCircle size={18} className="text-green-400" /> :
                          <Play size={18} className="text-blue-400" />}
              </div>
              <div>
                <p className="font-medium">{section.order}. {section.title}</p>
                <p className="text-xs text-gray-500">{section.is_free ? '무료' : '프리미엄'}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
