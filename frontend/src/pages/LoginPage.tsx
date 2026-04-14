export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/auth/google`
  }
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-xl">
        <h1 className="text-3xl font-bold text-white">DeepLearn</h1>
        <p className="text-gray-400">딥러닝을 실전처럼 배우는 플랫폼</p>
        <button
          onClick={handleLogin}
          className="flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Google로 시작하기
        </button>
      </div>
    </div>
  )
}
