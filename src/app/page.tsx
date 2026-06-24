'use client'

import { useState, useCallback, useEffect } from 'react'
import { User } from 'firebase/auth'
import AuthSection from '@/components/AuthSection'
import UploadSection from '@/components/UploadSection'
import ResultsSection from '@/components/ResultsSection'
import HistoryPanel from '@/components/HistoryPanel'
import { PART5_QUESTIONS, Part5Question } from '@/lib/part5Questions'

type AppState = 'upload' | 'loading' | 'results' | 'error'

// 단일 / 다중 지문 전용 로딩 스텝
const STEPS_SINGLE = ['OCR 인식', 'Skeleton 추출', 'Structure 분석', 'Layer 분석', '결과 생성']
const STEPS_MULTI  = ['지문 인식', '지문 간 관계 분석', 'Cross-reference 추출', 'Layer 분석', '결과 생성']

const UNLIMITED_EMAILS = ['itzanayoson1@gmail.com']

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [usageCount, setUsageCount] = useState(0)
  const [authReady, setAuthReady] = useState(false)
  const [appState, setAppState] = useState<AppState>('upload')
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [isMultiPassageMode, setIsMultiPassageMode] = useState(false)

  // Part 5 퀴즈 상태
  const [quizQuestion, setQuizQuestion] = useState<Part5Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showResult, setShowResult] = useState(false)

  const isUnlimited = user ? UNLIMITED_EMAILS.includes(user.email || '') : false

  const handleUserChange = useCallback((u: User | null, count: number) => {
    setUser(u); setUsageCount(count); setAuthReady(true)
  }, [])

  // 로딩 시작 시 랜덤 문제 선택
  useEffect(() => {
    if (appState === 'loading') {
      const idx = Math.floor(Math.random() * PART5_QUESTIONS.length)
      setQuizQuestion(PART5_QUESTIONS[idx])
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }, [appState])

  const handleAnswer = (choice: 'A' | 'B' | 'C' | 'D') => {
    if (showResult) return
    setSelectedAnswer(choice)
    setShowResult(true)
  }

  // ── 핵심 변경: 시그니처 업데이트 ──────────────
  const handleAnalyze = async (
    text: string,
    images: { base64: string; mediaType: string }[],
    isMultiPassage: boolean
  ) => {
    if (!user) return
    setAppState('loading')
    setStepIndex(0)
    setErrorMsg('')
    setIsMultiPassageMode(isMultiPassage)

    const STEPS = isMultiPassage ? STEPS_MULTI : STEPS_SINGLE
    const timer = setInterval(() => setStepIndex(p => p < STEPS.length - 1 ? p + 1 : p), 800)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          images,           // 배열로 전달
          isMultiPassage,   // 다중 지문 플래그
          uid: user.uid,
          userEmail: user.email,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '분석에 실패했습니다.')
      clearInterval(timer)
      setStepIndex(STEPS.length)
      setResult(data)
      if (!isUnlimited) setUsageCount(data.usageCount)
      setTimeout(() => setAppState('results'), 400)
    } catch (err) {
      clearInterval(timer)
      setErrorMsg(err instanceof Error ? err.message : '오류가 발생했습니다.')
      setAppState('error')
    }
  }

  const handleReset = () => { setAppState('upload'); setResult(null); setStepIndex(0) }
  const goHome = () => { setAppState('upload'); setResult(null); setStepIndex(0); setErrorMsg('') }

  // 현재 모드에 맞는 스텝 배열
  const CURRENT_STEPS = isMultiPassageMode ? STEPS_MULTI : STEPS_SINGLE

  return (
    <div className="min-h-screen" style={{ background: '#0A1628', color: '#fff' }}>
      {/* Header */}
      <header style={{ background: '#0A1628', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '18px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={goHome}
            title="홈으로"
            style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,107,53,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#FF6B35'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,107,53,0.3)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            <i className="ti ti-home" aria-hidden="true" />
          </button>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#FF6B35' }}>UK TIGER</span>
            <span style={{ color: '#fff' }}> English Coach</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
            <span style={{ color: '#FF6B35' }}>Read Structure,</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}> Not Words</span>
          </div>
          {user && (
            <button onClick={() => setShowHistory(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <i className="ti ti-clock-hour-3" style={{ fontSize: '15px' }} aria-hidden="true" />
              기록
            </button>
          )}
          <AuthSection onUserChange={handleUserChange} usageCount={usageCount} />
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
        {!authReady && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid #FF6B35', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            로딩 중...
          </div>
        )}

        {authReady && !user && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>🐯</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-1px' }}>무료로 시작해보세요</h2>
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

        {authReady && user && (
          <>
            {appState === 'upload' && (
              <>
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '14px' }}>TOEIC Part 7 독해 구조 훈련</div>
                  <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1.5px', marginBottom: '16px' }}>
                    글의 구조를 읽어라,<br />단어가 아니라 <span style={{ color: '#FF6B35' }}>Skeleton</span>을.
                  </h1>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '480px' }}>TOEIC Part 7 지문을 업로드하거나 붙여넣으면 AI가 독해 구조를 분석해드립니다.</p>
                </div>
                <UploadSection onAnalyze={handleAnalyze} isLoading={false} usageCount={usageCount} isUnlimited={isUnlimited} />
              </>
            )}

            {appState === 'loading' && (
              <div style={{ padding: '40px 0' }}>
                {/* 상단 분석 진행 상태 */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px' }} className="tiger-bounce">🐯</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {isMultiPassageMode ? '다중 지문 분석 중...' : '분석 중입니다...'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
                    {isMultiPassageMode
                      ? '지문 간 관계와 Cross-reference 포인트를 분석하고 있어요'
                      : '지문의 구조와 핵심 정보를 추출하고 있어요'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                    {CURRENT_STEPS.map((step, i) => (
                      <div key={step} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: i < stepIndex ? 'rgba(74,222,128,0.1)' : i === stepIndex ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i < stepIndex ? 'rgba(74,222,128,0.3)' : i === stepIndex ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.1)'}`, color: i < stepIndex ? '#4ade80' : i === stepIndex ? '#FF6B35' : 'rgba(255,255,255,0.25)', transition: 'all 0.3s' }}>
                        {i < stepIndex ? '✓ ' : ''}{step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part 5 퀴즈 */}
                {quizQuestion && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: '20px', padding: '28px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: '#FF6B35', letterSpacing: '1px' }}>PART 5</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>분석 대기 시간에 풀어보세요!</span>
                    </div>

                    <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#fff', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
                      {quizQuestion.sentence}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(['A', 'B', 'C', 'D'] as const).map((choice) => {
                        const isCorrect = choice === quizQuestion.answer
                        const isSelected = choice === selectedAnswer
                        let bg = 'rgba(255,255,255,0.05)'
                        let border = '1px solid rgba(255,255,255,0.1)'
                        let color = 'rgba(255,255,255,0.75)'

                        if (showResult) {
                          if (isCorrect) { bg = 'rgba(74,222,128,0.12)'; border = '1px solid rgba(74,222,128,0.4)'; color = '#4ade80' }
                          else if (isSelected) { bg = 'rgba(239,68,68,0.12)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#f87171' }
                        } else if (isSelected) {
                          bg = 'rgba(255,107,53,0.15)'; border = '1px solid rgba(255,107,53,0.4)'; color = '#FF6B35'
                        }

                        return (
                          <button
                            key={choice}
                            onClick={() => handleAnswer(choice)}
                            disabled={showResult}
                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 18px', background: bg, border, borderRadius: '12px', color, fontSize: '14px', fontWeight: 500, cursor: showResult ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                          >
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: showResult && isCorrect ? 'rgba(74,222,128,0.2)' : showResult && isSelected && !isCorrect ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : choice}
                            </span>
                            <span>{quizQuestion.options[choice]}</span>
                          </button>
                        )
                      })}
                    </div>

                    {showResult && (
                      <div style={{ marginTop: '18px', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', borderLeft: '3px solid #FF6B35' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: selectedAnswer === quizQuestion.answer ? '#4ade80' : '#f87171', marginBottom: '6px' }}>
                          {selectedAnswer === quizQuestion.answer ? '🎯 정답입니다!' : `❌ 오답 — 정답은 (${quizQuestion.answer})`}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                          {quizQuestion.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {appState === 'error' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>{errorMsg}</div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={handleReset} style={{ padding: '12px 32px', background: '#FF6B35', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>다시 시도</button>
                  <button onClick={goHome} style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>홈으로</button>
                </div>
              </div>
            )}

            {appState === 'results' && result && (
              <ResultsSection result={result} onReset={handleReset} />
            )}
          </>
        )}
      </main>

      {showHistory && user && (
        <HistoryPanel uid={user.uid} onClose={() => setShowHistory(false)} onRestore={(result) => { setResult(result); setAppState('results'); setShowHistory(false); }} />
      )}
    </div>
  )
}
