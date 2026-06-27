'use client'

// src/app/how-to-use/page.tsx

import { useRouter } from 'next/navigation'

const C = {
  molt: '#F94216',
  moltBg: 'rgba(249,66,22,0.10)',
  moltBorder: 'rgba(249,66,22,0.25)',
  line: 'rgba(255,255,255,0.1)',
  card: 'rgba(255,255,255,0.04)',
  soft: 'rgba(255,255,255,0.5)',
  navy: '#0A1628',
}

// 분석 결과 카드 목업
const RESULT_CARDS = [
  { emoji: '📄', label: 'Card 1', title: '지문 형식 (Format)', desc: '이메일 · 공지문 · 기사문 · 광고문 · 양식 등 유형을 자동 분류' },
  { emoji: '🎯', label: 'Card 2', title: '지문 목적 유형 (Purpose)', desc: '요청형 · 정보제공형 · 문제해결형 등 출제 목적을 한 문장으로 요약' },
  { emoji: '🏆', label: 'Card 3', title: '고득점자 읽기 포인트', desc: '고득점자가 이 지문을 읽는 전략 3~4가지를 제시' },
  { emoji: '🦴', label: 'Card 4', title: 'Skeleton Mode', desc: '주어·동사(강), 목적어·보어(중), 수식어(약) 3단계 색 구분' },
  { emoji: '🏗️', label: 'Card 5', title: 'Structure Mode', desc: '단락별 역할과 전개 흐름을 단계별 다이어그램으로 시각화' },
  { emoji: '📝', label: 'Card 6', title: 'Skeleton Summary', desc: '지문 전체를 핵심 문장 3줄로 압축 요약' },
  { emoji: '🧩', label: 'Card 7', title: '문제 Layer 분석', desc: '각 문제가 Skeleton · Structure · Detail 중 어느 Layer인지 분류' },
]

export default function HowToUsePage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: C.navy, color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── 헤더 ── */}
      <header style={{ borderBottom: `1px solid ${C.line}`, padding: '18px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, background: C.navy }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800 }}>
            <span style={{ color: C.molt }}>UK TIGER</span>
            <span style={{ color: '#fff' }}> English Coach</span>
          </span>
        </button>
        <button
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: C.molt, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          🐯 시작하기
        </button>
      </header>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* ── 타이틀 ── */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: C.molt, marginBottom: '16px' }}>
            HOW TO USE
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '16px' }}>
            사진 한 장이면<br /><span style={{ color: C.molt }}>끝납니다</span>
          </h1>
          <p style={{ fontSize: '16px', color: C.soft, lineHeight: 1.65, maxWidth: '440px', margin: '0 auto' }}>
            TOEIC Part 7 지문 사진을 올리면 AI가 독해 구조를 분석해드려요.<br />복잡한 설정은 없습니다.
          </p>
        </div>

        {/* ━━━━ STEP 1 ━━━━ */}
        <section style={{ marginBottom: '64px' }}>
          <StepLabel num={1} label="사진을 올리세요" />

          {/* 업로드 목업 */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `2px dashed ${C.moltBorder}`, borderRadius: '20px', padding: '48px 24px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', color: C.moltBorder, marginBottom: '12px' }}>📄</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Part 7 지문 사진을 올리세요
            </div>
            <div style={{ fontSize: '13px', color: C.soft, marginBottom: '16px' }}>
              드래그 & 드롭 또는 클릭해서 업로드
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {['JPG', 'PNG', '최대 3장'].map(t => (
                <span key={t} style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', border: `1px solid ${C.line}`, color: C.soft, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* 안내 포인트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { ic: '📸', text: '교재나 시험지를 스마트폰으로 찍어서 올리면 됩니다.' },
              { ic: '🗂️', text: '다중 지문(Double/Triple)은 토글로 "다중 지문 모드"를 선택 후 1~3장 업로드.' },
              { ic: '✍️', text: '사진이 없으면 텍스트를 직접 붙여넣을 수도 있습니다.' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 18px', background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{p.ic}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━━ STEP 2: 로딩 중 Part 5 퀴즈 ━━━━ */}
        <section style={{ marginBottom: '64px' }}>
          <StepLabel num={2} label="분석하는 동안 Part 5 문제를 풀어요" />

          <p style={{ fontSize: '14px', color: C.soft, lineHeight: 1.65, marginBottom: '20px' }}>
            분석에는 보통 <strong style={{ color: '#fff' }}>10~20초</strong>가 걸립니다. 그 시간에 자동으로 Part 5 문법/어휘 문제가 출제됩니다. 문제를 풀고 정답을 확인한 뒤, 시간이 남으면 <strong style={{ color: '#fff' }}>다음 문제</strong>로 계속 넘어갈 수 있어요.
          </p>

          {/* Part 5 퀴즈 목업 — 실전 시험지 스타일 */}
          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            {/* 상단 태그바 */}
            <div style={{ background: '#f5f5f5', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e5e5e5' }}>
              <span style={{ background: C.molt, color: '#fff', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>PART 5</span>
              <span style={{ fontSize: '12px', color: '#888' }}>분석 대기 시간에 풀어보세요!</span>
            </div>

            {/* 문제 본문 */}
            <div style={{ padding: '28px 28px 12px', borderBottom: '1px solid #e5e5e5' }}>
              <p style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: 1.8, fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: '0.2px' }}>
                The marketing team has decided to ------- the product launch until the design revisions are complete.
              </p>
            </div>

            {/* 선택지 — 실전 시험지 스타일 */}
            <div style={{ padding: '16px 28px 24px' }}>
              {[
                { choice: 'A', text: 'postpone', state: 'correct' },
                { choice: 'B', text: 'postponement', state: 'wrong' },
                { choice: 'C', text: 'postponing', state: 'default' },
                { choice: 'D', text: 'postponed', state: 'default' },
              ].map(opt => {
                const bg = opt.state === 'correct' ? '#f0fdf4' : opt.state === 'wrong' ? '#fef2f2' : '#fff'
                const border = opt.state === 'correct' ? '1.5px solid #86efac' : opt.state === 'wrong' ? '1.5px solid #fecaca' : '1.5px solid #e5e5e5'
                const textColor = opt.state === 'correct' ? '#166534' : opt.state === 'wrong' ? '#991b1b' : '#1a1a1a'
                const circleColor = opt.state === 'correct' ? '#22c55e' : opt.state === 'wrong' ? '#ef4444' : '#d1d5db'
                return (
                  <div key={opt.choice} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '11px 16px', border, borderRadius: '10px', marginBottom: '8px', background: bg }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: circleColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: opt.state === 'default' ? '#9ca3af' : '#fff', flexShrink: 0 }}>
                      {opt.state === 'correct' ? '✓' : opt.state === 'wrong' ? '✗' : opt.choice}
                    </span>
                    <span style={{ fontFamily: "'Times New Roman', Georgia, serif", fontSize: '15px', color: textColor }}>
                      ({opt.choice}) {opt.text}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* 정답/해설 */}
            <div style={{ margin: '0 28px 16px', padding: '14px 18px', background: '#f8fffe', border: '1px solid #a7f3d0', borderRadius: '10px', borderLeft: `4px solid ${C.molt}` }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>🎯 정답: (A) postpone</div>
              <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
                <strong>decide to + 동사원형</strong> 구조. to 부정사 뒤에는 동사원형이 와야 합니다. postponement(명사), postponing(동명사), postponed(과거형)는 모두 오답.
              </div>
            </div>

            {/* 다음 문제 버튼 */}
            <div style={{ padding: '0 28px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: C.molt, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }}>
                다음 문제 →
              </button>
            </div>
          </div>

          <div style={{ marginTop: '14px', padding: '12px 18px', background: C.card, border: `1px solid ${C.line}`, borderRadius: '12px', fontSize: '13px', color: C.soft, lineHeight: 1.6 }}>
            💡 분석이 완료되면 Part 5 퀴즈는 자동으로 사라지고 결과 화면으로 이동합니다.
          </div>
        </section>

        {/* ━━━━ STEP 3: 결과 화면 ━━━━ */}
        <section style={{ marginBottom: '64px' }}>
          <StepLabel num={3} label="분석 결과 — 7개 카드가 나타납니다" />

          <p style={{ fontSize: '14px', color: C.soft, lineHeight: 1.65, marginBottom: '20px' }}>
            분석이 완료되면 아래 7가지 카드가 차례로 펼쳐집니다. 각 카드를 클릭하면 열고 닫을 수 있으며, <strong style={{ color: '#fff' }}>PDF로 저장</strong>도 가능합니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {RESULT_CARDS.map((card, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 20px', background: C.card, border: `1px solid ${C.line}`, borderRadius: '14px' }}>
                <span style={{ fontSize: '26px', flexShrink: 0, marginTop: '2px' }}>{card.emoji}</span>
                <div>
                  <div style={{ fontSize: '10px', color: C.molt, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '3px' }}>{card.label}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{card.title}</div>
                  <div style={{ fontSize: '13px', color: C.soft, lineHeight: 1.55 }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 다중 지문 추가 카드 */}
          <div style={{ padding: '16px 20px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '14px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '26px', flexShrink: 0 }}>🔗</span>
            <div>
              <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '3px' }}>다중 지문 전용</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>지문 관계 분석 (Cross-reference)</div>
              <div style={{ fontSize: '13px', color: C.soft, lineHeight: 1.55 }}>Double/Triple Passage 모드에서 추가로 제공 — 지문 간 흐름도, 공통 키워드, Cross-reference 포인트를 시각화합니다.</div>
            </div>
          </div>
        </section>

        {/* ━━━━ FAQ ━━━━ */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '20px' }}>자주 묻는 질문</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { q: '하루에 몇 번 사용할 수 있나요?', a: '무료 계정은 매일 3회 제공됩니다. 매일 자정에 자동으로 충전됩니다.' },
              { q: '사진이 흐리면 괜찮나요?', a: '어느 정도 글씨가 보이면 인식됩니다. 최대한 밝고 선명하게 찍어주시면 정확도가 높아집니다.' },
              { q: '이중 지문(Double Passage)은 어떻게 분석하나요?', a: '업로드 화면에서 "다중 지문 모드" 토글을 켠 뒤 사진 1~3장을 올리세요. 한 장에 두 지문이 모두 찍혀 있어도 괜찮습니다.' },
              { q: '결과를 저장하거나 다시 볼 수 있나요?', a: '분석 결과는 자동으로 저장됩니다. 우측 상단 "기록" 버튼에서 날짜별로 다시 확인할 수 있습니다.' },
              { q: 'PDF로 출력할 수 있나요?', a: '결과 화면 우측 상단의 "PDF 저장" 버튼을 누르면 전체 또는 핵심 카드만 선택해서 출력할 수 있습니다.' },
            ].map((faq, i) => (
              <div key={i} style={{ padding: '18px 20px', background: C.card, border: `1px solid ${C.line}`, borderRadius: '14px' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>Q. {faq.q}</div>
                <div style={{ fontSize: '13px', color: C.soft, lineHeight: 1.65 }}>A. {faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━━ 하단 CTA ━━━━ */}
        <section style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '24px', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px', animation: 'bob 3s ease-in-out infinite', display: 'inline-block' }}>🐯</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.8px', marginBottom: '10px' }}>이제 직접 해보세요</h2>
          <p style={{ color: C.soft, fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            지문 사진 한 장이면 충분합니다
          </p>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: C.molt, border: 'none', borderRadius: '14px', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
          >
            🚀 무료로 분석 시작하기
          </button>
        </section>

      </main>
    </div>
  )
}

// ── STEP 레이블 컴포넌트 ──
function StepLabel({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F94216', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '14px', color: '#fff', flexShrink: 0 }}>
        {num}
      </div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>{label}</div>
    </div>
  )
}
