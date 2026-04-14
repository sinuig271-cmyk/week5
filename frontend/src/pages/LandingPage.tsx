import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <span className="text-xl font-bold text-blue-400">DeepLearn</span>
        <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">시작하기</Link>
      </nav>
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 gap-6">
        <h1 className="text-5xl font-bold max-w-2xl leading-tight">누구나 딥러닝을<br />실전처럼 배울 수 있는 플랫폼</h1>
        <p className="text-gray-400 text-lg max-w-xl">코드 실행 결과를 즉시 확인하며 Week 5 딥러닝 핵심을 체득하세요.</p>
        <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700">
          무료로 시작하기 →
        </Link>
      </section>
      <section className="max-w-4xl mx-auto px-8 py-16 grid grid-cols-3 gap-6">
        {[
          { title: 'Regularization', desc: 'L1/L2, Dropout, Batch Norm', free: true },
          { title: 'Overfitting', desc: '손실 곡선 진단과 해결 전략', free: true },
          { title: 'Data Augmentation', desc: 'Keras 이미지 변형 기법', free: false },
          { title: 'Transfer Learning', desc: 'MobileNetV2 Fine-tuning', free: false },
          { title: 'CNN MNIST', desc: '손글씨 인식 전 과정', free: false },
        ].map((s) => (
          <div key={s.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{s.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${s.free ? 'bg-green-900 text-green-400' : 'bg-violet-900 text-violet-400'}`}>
                {s.free ? '무료' : '프리미엄'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
