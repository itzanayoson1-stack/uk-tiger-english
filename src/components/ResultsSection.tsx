'use client'

import { useState } from 'react'

interface AnalysisResult {
  format: string; format_icon: string
  purpose_type: string; purpose_emoji: string; purpose_desc: string
  reading_points: { ko: string; en: string }[]
  skeleton_html: string
  structure_steps: { ko: string; en: string }[]
  skeleton_summary: string[]
  questions: { num: string; layer: string; desc: string }[]
  detail_analysis: string; trap_analysis: string; paraphrase: string; intent: string; sentence_structure: string
  usageCount: number
  title?: string
}

interface Props { result: AnalysisResult; onReset: () => void }

const LAYER_BG: Record<string, string> = {
  Skeleton: '#fef2f2', Structure: '#fff7ed', Detail: '#fefce8',
}
const LAYER_COLOR: Record<string, string> = {
  Skeleton: '#dc2626', Structure: '#ea580c', Detail: '#ca8a04',
}

function Card({ label, title, emoji, defaultOpen = true, children, delay = 0, printAlways = true }: {
  label: string; title: string; emoji: string
  defaultOpen?: boolean; children: React.ReactNode; delay?: number; printAlways?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={printAlways ? 'result-card' : 'result-card detail-card'} style={{ background: '#fff', border: '1.5px solid #e8e5df', borderRadius: '14px', overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', cursor: 'pointer', background: open ? '#fafaf8' : '#fff' }}>
        <span style={{ fontSize: '20px' }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1px' }}>{label}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: '#111' }}>{title}</div>
        </div>
        <i className="ti ti-chevron-down no-print" style={{ color: '#ccc', fontSize: '18px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true" />
      </div>
      {open && <div className="card-body" style={{ padding: '4px 20px 20px', borderTop: '1.5px solid #f0ede8' }}>{children}</div>}
    </div>
  )
}

function ExpandItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1.5px solid #f0ede8', borderRadius: '10px', overflow: 'hidden', background: '#fafaf8' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span>{title}</span>
        <i className="ti ti-chevron-down no-print" style={{ fontSize: '13px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} aria-hidden="true" />
      </button>
      {open && <div style={{ padding: '12px 16px', borderTop: '1.5px solid #f0ede8', fontSize: '13px', color: '#555', lineHeight: 1.75, background: '#fff' }}>{content}</div>}
    </div>
  )
}

export default function ResultsSection({ result, onReset }: Props) {
  const remaining = Math.max(0, 3 - result.usageCount)
  const [showPdfModal, setShowPdfModal] = useState(false)

  const handlePDF = (includeDetail: boolean) => {
    setShowPdfModal(false)
    // 추가분석 포함 여부를 body에 class로 표시
    if (includeDetail) {
      document.body.classList.remove('hide-detail')
    } else {
      document.body.classList.add('hide-detail')
    }
    setTimeout(() => {
      window.print()
      document.body.classList.remove('hide-detail')
    }, 200)
  }

  const detailItems = [
    { title: '세부 정보 분석', content: result.detail_analysis },
    { title: '함정 분석', content: result.trap_analysis },
    { title: '패러프레이징 분석', content: result.paraphrase },
    { title: '출제 의도 분석', content: result.intent },
    { title: '문장 구조 분석', content: result.sentence_structure },
  ]

  return (
    <>
      <style>{`
        .sk-strong { color: #dc2626; font-weight: 700; font-size: 15px; background: #fef2f2; padding: 2px 6px; border-radius: 4px; }
        .sk-medium { color: #ea580c; font-weight: 600; background: #fff7ed; padding: 2px 5px; border-radius: 4px; }
        .sk-weak { color: #6b7280; background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }

        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: #fff !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .result-card {
            background: #fff !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            margin-bottom: 12px !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .result-card .card-body { display: block !important; }
          .detail-card { page-break-inside: avoid; break-inside: avoid; }
          body.hide-detail .detail-card { display: none !important; }
          .print-header {
            display: block !important;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px; font-weight: 800; color: #111;
            margin-bottom: 16px; padding-bottom: 10px;
            border-bottom: 2px solid #FF6B35;
          }
        }
        @media screen {
          .print-header { display: none; }
        }
      `}</style>

      {/* PDF 선택 모달 */}
      {showPdfModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} className="no-print">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px 24px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>📄 PDF 출력 옵션</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: 1.6 }}>출력할 내용을 선택해주세요.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => handlePDF(true)} style={{ padding: '14px 18px', background: '#FF6B35', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                📋 전체 출력
                <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.85, marginTop: '3px' }}>카드 7개 + 추가 분석 5개 모두 포함</div>
              </button>
              <button onClick={() => handlePDF(false)} style={{ padding: '14px 18px', background: '#fff', border: '2px solid #e8e5df', borderRadius: '12px', color: '#111', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                📄 핵심만 출력
                <div style={{ fontSize: '12px', fontWeight: 400, color: '#888', marginTop: '3px' }}>카드 7개만 출력 (추가 분석 제외)</div>
              </button>
            </div>
            <button onClick={() => setShowPdfModal(false)} style={{ width: '100%', padding: '10px', background: '#f5f5f5', border: 'none', borderRadius: '10px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>취소</button>
          </div>
        </div>
      )}

      {/* 인쇄용 헤더 */}
      <div className="print-header">🐯 UK Tiger 영어 읽기 훈련소 — {result.title || result.format} 분석 결과</div>

      {/* 결과 헤더 */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1.5px solid #e8e5df' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 500 }}>분석 완료</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800, color: '#111' }}>📊 독해 구조 분석 결과</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setShowPdfModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: '#fff8f5', border: '1.5px solid #fed7c3', color: '#ea580c', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <i className="ti ti-file-type-pdf" style={{ fontSize: '16px' }} aria-hidden="true" /> PDF 저장
          </button>
          <div style={{ fontSize: '12px', color: '#999' }}>남은 횟수 <span style={{ color: '#FF6B35', fontWeight: 700 }}>{remaining}/3</span></div>
          <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #e8e5df', background: '#fff', color: '#666', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <i className="ti ti-refresh" aria-hidden="true" /> 새 지문
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        <Card label="Card 1" title="지문 형식 (Format)" emoji="📄" delay={0}>
          <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d4ed8', fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700 }}>
            <i className={`ti ti-${result.format_icon || 'file'}`} aria-hidden="true" /> {result.format}
          </div>
        </Card>

        <Card label="Card 2" title="지문 목적 유형 (Purpose)" emoji="🎯" delay={40}>
          <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '10px', background: '#fff8f5', border: '1.5px solid #fed7c3' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: '#c2410c', marginBottom: '4px' }}>{result.purpose_emoji} {result.purpose_type}</div>
            <div style={{ fontSize: '13px', color: '#9a3412', lineHeight: 1.55 }}>{result.purpose_desc}</div>
          </div>
        </Card>

        <Card label="Card 3" title="고득점자 읽기 포인트" emoji="🏆" delay={80}>
          <div style={{ marginTop: '12px' }}>
            {result.reading_points.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '11px 0', borderBottom: i < result.reading_points.length - 1 ? '1px solid #f0ede8' : 'none' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f3f0ff', color: '#7c3aed', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: '13px', color: '#111', fontWeight: 500, lineHeight: 1.45 }}>{p.ko}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{p.en}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 4" title="Skeleton Mode" emoji="🦴" delay={120}>
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {[['강','#fef2f2','#dc2626','#fecaca','주어·동사'],['중','#fff7ed','#ea580c','#fed7aa','목적어·보어'],['약','#f3f4f6','#6b7280','#e5e7eb','나머지']].map(([label,bg,color,border,desc])=>(
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: bg, color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, border: `1px solid ${border}` }}>{label}</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>{desc}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '14px', lineHeight: 2.4, color: '#444' }} dangerouslySetInnerHTML={{ __html: result.skeleton_html }} />
          </div>
        </Card>

        <Card label="Card 5" title="Structure Mode (전개)" emoji="🏗️" delay={160}>
          <div style={{ marginTop: '12px' }}>
            {result.structure_steps.map((s, i) => (
              <div key={i}>
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#fff8f5', borderLeft: '3px solid #FF6B35', margin: '5px 0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{s.ko}</div>
                  <div style={{ fontSize: '11px', color: '#ea580c', marginTop: '2px', fontWeight: 500 }}>{s.en}</div>
                </div>
                {i < result.structure_steps.length - 1 && <div style={{ textAlign: 'center', color: '#FF6B35', fontSize: '18px', margin: '2px 0', opacity: 0.5 }}>↓</div>}
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 6" title="Skeleton Summary" emoji="📝" delay={200}>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.skeleton_summary.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#333', lineHeight: 1.55, fontWeight: 500 }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', marginTop: '5px', flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 7" title="문제 Layer 분석" emoji="🧩" delay={240}>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.questions.map(q => (
              <div key={q.num} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 15px', borderRadius: '10px', background: '#fafaf8', border: '1.5px solid #f0ede8' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700, color: '#888', width: '28px' }}>{q.num}</span>
                <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: LAYER_BG[q.layer] || '#f3f4f6', color: LAYER_COLOR[q.layer] || '#666' }}>🧠 {q.layer}</span>
                <span style={{ fontSize: '12px', color: '#888', flex: 1 }}>{q.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card label="추가 분석" title="Detail 심층 분석 (클릭하여 열기)" emoji="🔍" defaultOpen={false} delay={280} printAlways={false}>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {detailItems.map(({ title, content }) => (
              <ExpandItem key={title} title={title} content={content} />
            ))}
          </div>
        </Card>

      </div>
    </>
  )
}
