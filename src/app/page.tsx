'use client'

import { useState, useCallback, useEffect } from 'react'
import { User } from 'firebase/auth'
import AuthSection from '@/components/AuthSection'
import UploadSection from '@/components/UploadSection'
import ResultsSection from '@/components/ResultsSection'
import HistoryPanel from '@/components/HistoryPanel'
import { PART5_QUESTIONS, Part5Question } from '@/lib/part5Questions'

type AppState = 'upload' | 'loading' | 'results' | 'error'

const STEPS_SINGLE = ['OCR 인식', 'Skeleton 추출', 'Structure 분석', 'Layer 분석', '결과 생성']
const STEPS_MULTI  = ['지문 인식', '지문 간 관계 분석', 'Cross-reference 추출', 'Layer 분석', '결과 생성']

const UNLIMITED_EMAILS = ['itzanayoson1@gmail.com']

// 공식 Google "G" 로고 (랜딩 히어로용 — 더 큰 사이즈)
function GoogleLogoLarge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

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

  const [quizQuestion, setQuizQuestion] = useState<Part5Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null)
  const [showResult, setShowResult] = useState(false)

  const isUnlimited = user ? UNLIMITED_EMAILS.includes(user.email || '') : false

  const handleUserChange = useCallback((u: User | null, count: number) => {
    setUser(u); setUsageCount(count); setAuthReady(true)
  }, [])

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
          text, images, isMultiPassage,
          uid: user.uid, userEmail: user.email,
        }),
      })
      const rawText = await res.text()
      let data: any
      try {
        data = JSON.parse(rawText)
      } catch {
        throw new Error(
          res.status === 504 || res.status === 408
            ? '분석 시간이 초과되었습니다. 이미지를 더 작게 찍거나 다시 시도해 주세요.'
            : `서버 오류가 발생했습니다. (${res.status})`
        )
      }
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

  const CURRENT_STEPS = isMultiPassageMode ? STEPS_MULTI : STEPS_SINGLE

  // ── 색상 토큰 (moltbook 레드 계열) ──
  const C = {
    molt: '#F94216',
    moltDeep: '#D62E08',
    moltGlow: 'rgba(249,66,22,0.20)',
    moltBg: 'rgba(249,66,22,0.10)',
    moltBorder: 'rgba(249,66,22,0.25)',
    line: 'rgba(255,255,255,0.1)',
    card: 'rgba(255,255,255,0.04)',
    soft: 'rgba(255,255,255,0.5)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', color: '#fff' }}>

      {/* ── 글로벌 스타일 ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: '#0A1628',
        borderBottom: `1px solid ${C.line}`,
        padding: '18px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <button
          onClick={goHome}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: 0 }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: C.molt }}>UK TIGER</span>
            <span style={{ color: '#fff' }}> English Coach</span>
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>
            <span style={{ color: C.molt }}>Read Structure,</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}> Not Words</span>
          </span>
          {user && (
            <button
              onClick={() => setShowHistory(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: C.card, border: `1px solid ${C.line}`, borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              <i className="ti ti-clock-hour-3" style={{ fontSize: '15px' }} aria-hidden="true" />
              기록
            </button>
          )}
          <AuthSection onUserChange={handleUserChange} usageCount={usageCount} />
        </div>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 64px' }}>

        {/* ── 로딩 중 (Firebase 초기화) ── */}
        {!authReady && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.soft, fontSize: '14px' }}>
            <div style={{ width: '24px', height: '24px', border: `2px solid ${C.line}`, borderTop: `2px solid ${C.molt}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            로딩 중...
          </div>
        )}

        {/* ━━━━ 비로그인 랜딩 (moltbook 레이아웃) ━━━━ */}
        {authReady && !user && (
          <div>
            {/* 히어로 */}
            <section style={{ textAlign: 'center', padding: '64px 0 48px', position: 'relative' }}>
              {/* 글로우 */}
              <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: `radial-gradient(circle, ${C.moltGlow}, transparent 70%)`, pointerEvents: 'none' }} />

              {/* 마스코트 */}
              <div style={{ fontSize: '100px', lineHeight: 1, marginBottom: '12px', display: 'inline-block', animation: 'bob 3s ease-in-out infinite', position: 'relative' }}>
                🐯
              </div>

              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: C.molt, marginBottom: '16px' }}>
                TOEIC Part 7 독해 구조 훈련
              </div>

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 6vw, 54px)', lineHeight: 1.06, letterSpacing: '-2px', marginBottom: '18px' }}>
                단어가 아니라<br />
                <span style={{ color: C.molt }}>구조</span>를 읽어라
              </h1>

              <p style={{ fontSize: '16px', color: C.soft, maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.65 }}>
                TOEIC Part 7 지문을 올리면 AI가 문장의 뼈대(Skeleton)와 글의 구조를 분석해,
                고득점자처럼 읽는 법을 알려드립니다.
              </p>

              {/* CTA 버튼 — Google 로고 포함 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => {
                    // AuthSection의 login 트리거 — 헤더 버튼 클릭 유도
                    const btn = document.querySelector('[data-google-login]') as HTMLButtonElement
                    btn?.click()
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '12px',
                    padding: '15px 32px',
                    background: '#fff',
                    border: '1px solid #dadce0',
                    borderRadius: '14px',
                    fontSize: '16px', fontWeight: 700, color: '#3c4043',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'transform 0.12s, box-shadow 0.12s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.22)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'
                  }}
                >
                  <GoogleLogoLarge />
                  Google 계정으로 무료 시작
                </button>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                  매일 3회 무료 · 로그인 후 즉시 사용
                </span>
              </div>
            </section>

            {/* 통계 카드 3개 */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '56px' }}>
              {[
                { num: '7', lab: '분석 카드' },
                { num: '매일 3회', lab: '무료 분석' },
                { num: 'Double·Triple', lab: '다중 지문 지원' },
              ].map(s => (
                <div key={s.lab} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '18px', padding: '26px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '22px', color: C.molt, lineHeight: 1, marginBottom: '8px' }}>{s.num}</div>
                  <div style={{ fontSize: '12px', color: C.soft, fontWeight: 600 }}>{s.lab}</div>
                </div>
              ))}
            </section>

            {/* 핵심 기능 카드 3개 */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '26px', letterSpacing: '-1px', marginBottom: '8px' }}>3가지 핵심 분석</h2>
              <p style={{ fontSize: '14px', color: C.soft }}>지문을 구조로 분해해 읽는 훈련</p>
            </div>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '56px' }}>
              {[
                { ic: '🦴', title: 'Skeleton 분석', desc: '주어·동사(강), 목적어·보어(중), 수식어(약)를 색으로 구분해 문장의 뼈대를 봅니다.', tag: '강·중·약 3단계' },
                { ic: '🏗️', title: 'Structure 분석', desc: '글이 어떤 순서로 전개되는지 단락별 역할과 흐름을 단계별로 시각화합니다.', tag: '전개 흐름도' },
                { ic: '🔗', title: '다중 지문 Cross', desc: '이중·삼중 지문의 관계와 두 지문을 교차해야 풀리는 고난도 문제를 짚어줍니다.', tag: 'Cross-reference' },
              ].map(c => (
                <div key={c.title} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '20px', padding: '24px 20px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{c.ic}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{c.title}</div>
                  <p style={{ fontSize: '13px', color: C.soft, lineHeight: 1.6, marginBottom: '14px' }}>{c.desc}</p>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.molt, background: C.moltBg, padding: '4px 12px', borderRadius: '20px' }}>{c.tag}</span>
                </div>
              ))}
            </section>

            {/* 하단 CTA 밴드 */}
            <section style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.line}`, borderRadius: '24px', padding: '48px 32px', textAlign: 'center', marginBottom: '56px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.8px', marginBottom: '10px' }}>지금 바로 시작해보세요</h2>
              <p style={{ color: C.soft, fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                Google 계정으로 로그인하면 매일 3개 지문을 무료로 분석할 수 있어요
              </p>
              <button
                onClick={() => {
                  const btn = document.querySelector('[data-google-login]') as HTMLButtonElement
                  btn?.click()
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '13px 28px',
                  background: '#fff', border: '1px solid #dadce0',
                  borderRadius: '12px', fontSize: '15px', fontWeight: 700, color: '#3c4043',
                  cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <GoogleLogoLarge />
                🐯 Google로 무료 시작하기
              </button>
            </section>

            <footer style={{ borderTop: `1px solid ${C.line}`, padding: '28px 0', textAlign: 'center', color: C.soft, fontSize: '13px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: C.molt, marginBottom: '6px' }}>Read Structure, Not Words</div>
              © 2026 UK Tiger English Coach · uktiger.academy
            </footer>
          </div>
        )}

        {/* ━━━━ 로그인 후 앱 화면 ━━━━ */}
        {authReady && user && (
          <>
            {appState === 'upload' && (
              <>
                <div style={{ marginBottom: '36px', paddingTop: '40px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>
                    TOEIC Part 7 독해 구조 훈련
                  </div>
                  <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-1px', marginBottom: '12px' }}>
                    글의 구조를 읽어라,<br />단어가 아니라 <span style={{ color: C.molt }}>Skeleton</span>을.
                  </h1>
                  <p style={{ fontSize: '14px', color: C.soft, lineHeight: 1.6, maxWidth: '480px' }}>
                    TOEIC Part 7 지문을 업로드하거나 붙여넣으면 AI가 독해 구조를 분석해드립니다.
                  </p>
                </div>
                <UploadSection onAnalyze={handleAnalyze} isLoading={false} usageCount={usageCount} isUnlimited={isUnlimited} />
              </>
            )}

            {appState === 'loading' && (
              <div style={{ padding: '40px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ fontSize: '56px', marginBottom: '16px', animation: 'bob 3s ease-in-out infinite', display: 'inline-block' }}>🐯</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {isMultiPassageMode ? '다중 지문 분석 중...' : '분석 중입니다...'}
                  </div>
                  <div style={{ fontSize: '13px', color: C.soft, marginBottom: '20px' }}>
                    {isMultiPassageMode
                      ? '지문 간 관계와 Cross-reference 포인트를 분석하고 있어요'
                      : '지문의 구조와 핵심 정보를 추출하고 있어요'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                    {CURRENT_STEPS.map((step, i) => (
                      <div key={step} style={{
                        padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, transition: 'all 0.3s',
                        background: i < stepIndex ? 'rgba(74,222,128,0.1)' : i === stepIndex ? C.moltBg : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${i < stepIndex ? 'rgba(74,222,128,0.3)' : i === stepIndex ? C.moltBorder : 'rgba(255,255,255,0.1)'}`,
                        color: i < stepIndex ? '#4ade80' : i === stepIndex ? C.molt : 'rgba(255,255,255,0.25)',
                      }}>
                        {i < stepIndex ? '✓ ' : ''}{step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part 5 퀴즈 */}
                {quizQuestion && (
                  <div style={{ background: C.card, border: `1px solid ${C.moltBorder}`, borderRadius: '20px', padding: '28px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ background: C.moltBg, border: `1px solid ${C.moltBorder}`, borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, color: C.molt, letterSpacing: '1px' }}>PART 5</span>
                      <span style={{ fontSize: '12px', color: C.soft }}>분석 대기 시간에 풀어보세요!</span>
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
                          bg = C.moltBg; border = `1px solid ${C.moltBorder}`; color = C.molt
                        }
                        return (
                          <button key={choice} onClick={() => handleAnswer(choice)} disabled={showResult}
                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 18px', background: bg, border, borderRadius: '12px', color, fontSize: '14px', fontWeight: 500, cursor: showResult ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : choice}
                            </span>
                            <span>{quizQuestion.options[choice]}</span>
                          </button>
                        )
                      })}
                    </div>
                    {showResult && (
                      <div style={{ marginTop: '18px', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', borderLeft: `3px solid ${C.molt}` }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: selectedAnswer === quizQuestion.answer ? '#4ade80' : '#f87171', marginBottom: '6px' }}>
                          {selectedAnswer === quizQuestion.answer ? '🎯 정답입니다!' : `❌ 오답 — 정답은 (${quizQuestion.answer})`}
                        </div>
                        <div style={{ fontSize: '13px', color: C.soft, lineHeight: 1.65 }}>{quizQuestion.explanation}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {appState === 'error' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <div style={{ color: C.soft, fontSize: '15px', marginBottom: '24px', lineHeight: 1.6 }}>{errorMsg}</div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={handleReset} style={{ padding: '12px 32px', background: C.molt, border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>다시 시도</button>
                  <button onClick={goHome} style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.line}`, borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>홈으로</button>
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
        <HistoryPanel
          uid={user.uid}
          onClose={() => setShowHistory(false)}
          onRestore={(r) => { setResult(r); setAppState('results'); setShowHistory(false) }}
        />
      )}
    </div>
  )
}
