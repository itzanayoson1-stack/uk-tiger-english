'use client'

import { useState } from 'react'
import { User } from 'firebase/auth'
import AuthSection from '@/components/AuthSection'
import LoginGate from '@/components/LoginGate'
import UploadSection from '@/components/UploadSection'
import ResultsSection from '@/components/ResultsSection'

type AppState = 'upload' | 'loading' | 'results' | 'error'

const STEPS = ['OCR 인식', 'Skeleton 추출', 'Structure 분석', 'Layer 분석', '결과 생성']

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [appState, setAppState] = useState<AppState>('upload')
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [stepIndex, setStepIndex] = useState(0)

  const handleUserChange = (u: User | null, count: number) => {
    setUser(u)
    setUsageCount(count)
  }

  const handleAnalyze = async (text: string, imageBase64: string | null, imageMediaType: string | null) => {
    if (!user) return
    setAppState('loading')
    setStepIndex(0)
    setErrorMsg('')

    const timer = setInterval(() => {
      setStepIndex((p) => (p < STEPS.length - 1 ? p + 1 : p))
    }, 800)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, imageBase64, imageMediaType, uid: user.uid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '분석에 실패했습니다.')
      clearInterval(timer)
      setStepIndex(STEPS.length)
      setResult(data)
      setUsageCount(data.usageCount)
      setTimeout(() => setAppState('results'), 400)
    } catch (err) {
      clearInterval(timer)
      setErrorMsg(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setAppState('error')
    }
  }

  const handleReset = () => {
    setAppState('upload')
    setResult(null)
    setStepIndex(0)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f8f7f4] border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="font-grotesk text-lg font-extrabold text-gray-900 tracking-tight">
            <span className="text-orange-500">UK Tiger</span> 영어 읽기 훈련소
          </div>
          <div className="text-xs text-gray-400 tracking-widest uppercase font-medium hidden sm:block">
            Read Structure, Not Words
          </div>
        </div>
        <AuthSection onUserChange={handleUserChange} />
      </header>

      {/* Hero */}
      {appState === 'upload' && (
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-4 relative overflow-hidden">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">TOEIC Part 7 독해 구조 훈련</div>
          <h1 className="font-grotesk text-5xl sm:text-7xl font-extrabold leading-none tracking-tight text-gray-900 mb-4">
            Read<br />
            <span className="text-orange-500">Structure,</span><br />
            Not Words.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-md mb-6">
            지문을 업로드하면 AI가 Skeleton → Structure → Detail 순서로 독해 구조를 분석해드립니다.
          </p>
          {/* Decorative shapes */}
          <div className="absolute right-8 top-8 w-20 h-20 bg-orange-400 rounded-full opacity-80 hidden lg:block" />
          <div className="absolute right-36 top-16 w-12 h-12 bg-yellow-300 rounded-lg rotate-12 opacity-80 hidden lg:block" />
          <div className="absolute right-16 top-32 w-8 h-8 bg-green-400 rounded-full opacity-80 hidden lg:block" />
          <div className="absolute right-56 top-8 w-6 h-6 bg-sky-300 rounded-full opacity-70 hidden lg:block" />
        </div>
      )}

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {!user ? (
          <LoginGate />
        ) : (
          <>
            {appState === 'upload' && (
              <UploadSection onAnalyze={handleAnalyze} isLoading={false} usageCount={usageCount} />
            )}

            {appState === 'loading' && (
              <div className="text-center py-20">
                <div className="text-6xl mb-6 tiger-bounce inline-block">🐯</div>
                <div className="font-grotesk text-xl font-bold text-gray-900 mb-2">RC Coach가 분석 중입니다...</div>
                <div className="text-sm text-gray-400 mb-8">지문의 구조와 핵심 정보를 추출하고 있어요</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {STEPS.map((step, i) => (
                    <div key={step} className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-300 ${
                      i < stepIndex ? 'bg-green-50 border-green-300 text-green-600'
                      : i === stepIndex ? 'bg-orange-50 border-orange-300 text-orange-600'
                      : 'bg-white border-gray-200 text-gray-300'
                    }`}>
                      {i < stepIndex ? '✓ ' : ''}{step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appState === 'error' && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">⚠️</div>
                <div className="text-gray-600 mb-6 leading-relaxed">{errorMsg}</div>
                <button onClick={handleReset} className="px-8 py-3 bg-gray-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors">
                  다시 시도
                </button>
              </div>
            )}

            {appState === 'results' && result && (
              <ResultsSection result={result} onReset={handleReset} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
