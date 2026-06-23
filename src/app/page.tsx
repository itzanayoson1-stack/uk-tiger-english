'use client'

import { useState, useCallback } from 'react'
import { User } from 'firebase/auth'
import AuthSection from '@/components/AuthSection'
import UploadSection from '@/components/UploadSection'
import ResultsSection from '@/components/ResultsSection'

type AppState = 'upload' | 'loading' | 'results' | 'error'

const STEPS = ['OCR 인식', 'Skeleton 추출', 'Structure 분석', 'Layer 분석', '결과 생성']

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [authReady, setAuthReady] = useState(false)
  const [appState, setAppState] = useState<AppState>('upload')
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [stepIndex, setStepIndex] = useState(0)

  // useCallback으로 안정화 — AuthSection 재렌더링 방지
  const handleUserChange = useCallback((u: User | null, count: number) => {
    setUser(u)
    setUsageCount(count)
    setAuthReady(true)
  }, [])

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
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>

      {/* Header */}
      <header style={{
        background: '#0A1628',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '18px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#FF6B35' }}>UK TIGER</span>
          <span style={{ color: '#fff' }}> English Coach</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
            <span style={{ color: '#FF6B35' }}>Read Structure,</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}> Not Words</span>
          </div>
          <AuthSection onUserChange={handleUserChange} />
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        {/* 인증 로딩 중 */}
        {!authReady && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            <div style={{
              width: '24px', height: '24px',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTop: '2px solid #FF6B35',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px',
            }} />
            로딩 중...
          </div>
        )}

        {/* 로그인 전 */}
        {authReady && !user && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>🐯</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-1px' }}>
              무료로 시작해보세요
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '8px' }}>Google 계정으로 로그인하면</p>
            <p style={{ color: '#FF6B35', fontWeight: 700, fontSize: '18px', marginBottom: '40px' }}>매일 3개 지문을 무료로 분석할 수 있어요!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '360px', margin: '0 auto 16px' }}>
              {[{ icon: '🦴', label: 'Skeleton 분석' }, { icon: '🏗️', label: 'Structure 분석' }, { icon: '🧠', label: 'Layer 진단' }].map(f => (
                <div key={f.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{f.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>우측 상단 버튼으로 Google 로그인 해주세요</p>
          </div>
        )}

        {/* 로그인 후 */}
        {authReady && user && (
          <>
            {appState === 'upload' && (
              <>
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '14px' }}>
                    TOEIC Part 7 독해 구조 훈련
                  </div>
                  <h1 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(28px, 4.5vw, 44px)',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    letterSpacing: '-1.5px',
                    marginBottom: '16px',
                  }}>
                    글의 구조를 읽어라,<br />
                    단어가 아니라 <span style={{ color: '#FF6B35' }}>Skeleton</span>을.
                  </h1>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '480px' }}>
                    TOEIC Part 7 지문을 업로드하거나 붙여넣으면 AI가 독해 구조를 분석해드립니다.
                  </p>
                </div>
                <UploadSection onAnalyze={handleAnalyze} isLoading={false} usageCount={usageCount} />
              </>
            )}

            {appState === 'loading' && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }} className="tiger-bounce">🐯</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>분석 중입니다...</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>지문의 구조와 핵심 정보를 추출하고 있어요</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {STEPS.map((step, i) => (
                    <div key={step} style={{
                      padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                      background: i < stepIndex ? 'rgba(74,222,128,0.1)' : i === stepIndex ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${i < stepIndex ? 'rgba(74,222,128,0.3)' : i === stepIndex ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      color: i < stepIndex ? '#4ade80' : i === stepIndex ? '#FF6B35' : 'rgba(255,255,255,0.25)',
                      transition: 'all 0.3s',
                    }}>
                      {i < stepIndex ? '✓ ' : ''}{step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appState === 'error' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>{errorMsg}</div>
                <button onClick={handleReset} style={{ padding: '12px 32px', background: '#FF6B35', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
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
