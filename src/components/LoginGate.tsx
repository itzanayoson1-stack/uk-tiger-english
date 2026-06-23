'use client'

import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export default function LoginGate() {
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="text-center py-20 px-6">
      {/* Tiger */}
      <div className="text-7xl mb-6">🐯</div>

      <h2 className="font-grotesk text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
        무료로 시작해보세요
      </h2>
      <p className="text-gray-500 text-base mb-2 leading-relaxed">
        Google 계정으로 로그인하면
      </p>
      <p className="text-orange-500 font-bold text-lg mb-8">
        매일 3개 지문을 무료로 분석할 수 있어요!
      </p>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
        {[
          { icon: '🦴', label: 'Skeleton 분석' },
          { icon: '🏗️', label: 'Structure 분석' },
          { icon: '🧠', label: 'Layer 진단' },
        ].map((f) => (
          <div key={f.label} className="bg-white border-2 border-gray-100 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-xs font-semibold text-gray-600">{f.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={login}
        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base hover:bg-orange-500 transition-colors shadow-lg"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google 계정으로 무료 시작
      </button>

      <p className="text-xs text-gray-400 mt-4">신용카드 불필요 · 광고 없음</p>
    </div>
  )
}
