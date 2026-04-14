import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSectionContent, getProgress, markComplete } from '../services/courses'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { CheckCircle, ChevronLeft } from 'lucide-react'

export default function LessonPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const id = Number(sectionId)
  const qc = useQueryClient()
  const [isPremiumBlocked, setIsPremiumBlocked] = useState(false)

  const { data: section, isLoading } = useQuery({
    queryKey: ['section', id],
    queryFn: () => getSectionContent(id),
    throwOnError: false,
    meta: {
      onError: (e: any) => { if (e?.response?.status === 403) setIsPremiumBlocked(true) },
    },
  })

  const { data: progress = [] } = useQuery({ queryKey: ['progress'], queryFn: getProgress })
  const isDone = progress.some((p) => p.section_id === id)

  const complete = useMutation({
    mutationFn: () => markComplete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['progress'] }),
  })

  if (isLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">불러오는 중…</div>

  if (isPremiumBlocked || (!isLoading && !section)) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-white">
      <p className="text-gray-400">이 콘텐츠는 프리미엄 전용입니다.</p>
      <Link to="/pricing" className="bg-violet-600 px-6 py-2 rounded-lg hover:bg-violet-700">업그레이드 →</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto p-8">
        <Link to="/courses/week5" className="flex items-center gap-1 text-gray-400 hover:text-white mb-6">
          <ChevronLeft size={18} /> 목록으로
        </Link>
        <h1 className="text-2xl font-bold mb-8">{section?.title}</h1>
        {section && <MarkdownRenderer content={section.content_md} />}
        <div className="mt-12">
          {isDone ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={20} /> 완료
            </div>
          ) : (
            <button
              onClick={() => complete.mutate()}
              disabled={complete.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              완료로 표시
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
