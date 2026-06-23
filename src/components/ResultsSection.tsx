'use client'

import { useState, useRef } from 'react'

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

const LAYER_STYLE: Record<string, string> = {
  Skeleton: 'background:rgba(230,57,70,0.15);color:#FF6B7A;border:1px solid rgba(230,57,70,0.25)',
  Structure: 'background:rgba(255,107,53,0.15);color:#FF9162;border:1px solid rgba(255,107,53,0.25)',
  Detail: 'background:rgba(250,204,21,0.12);color:#facc15;border:1px solid rgba(250,204,21,0.25)',
}

function Card({ label, title, iconCls, iconBg, defaultOpen = true, children, delay = 0 }: {
  label: string; title: string; iconCls: string; iconBg: string
  defaultOpen?: boolean; children: React.ReactNode; delay?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden', animationDelay: `${delay}ms` }} className="card-anim">
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, ...Object.fromEntries(iconBg.split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim(), v?.trim()] })) }}>
          <i className={`ti ${iconCls}`} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{title}</div>
        </div>
        <i className={`ti ti-chevron-down`} style={{ color: 'rgba(255,255,255,0.22)', fontSize: '18px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true" />
      </div>
      {open && <div style={{ padding: '4px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{children}</div>}
    </div>
  )
}

function ExpandItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span>{title}</span>
        <i className={`ti ti-chevron-down`} style={{ fontSize: '13px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} aria-hidden="true" />
      </button>
      {open && <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{content}</div>}
    </div>
  )
}

export default function ResultsSection({ result, onReset }: Props) {
  const remaining = Math.max(0, 3 - result.usageCount)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePDF = () => {
    window.print()
  }

  return (
    <>
      {/* PDF용 인쇄 스타일 */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; left: 0; top: 0; width: 100%; background: #fff !important; color: #111 !important; padding: 20px; }
          .no-print { display: none !important; }
          .sk-strong { color: #dc2626 !important; background: #fef2f2 !important; padding: 1px 4px; border-radius: 3px; font-weight: 700; }
          .sk-medium { color: #ea580c !important; background: #fff7ed !important; padding: 1px 4px; border-radius: 3px; font-weight: 600; }
          .sk-weak { color: #6b7280 !important; background: #f3f4f6 !important; padding: 1px 4px; border-radius: 3px; }
        }
      `}</style>

      <div id="print-area" ref={printRef}>
        {/* 헤더 */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>분석 완료</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: '#fff' }}>📊 독해 구조 분석 결과</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* PDF 저장 버튼 */}
            <button onClick={handlePDF} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)',
              color: '#FF6B35', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
              <i className="ti ti-file-type-pdf" style={{ fontSize: '16px' }} aria-hidden="true" />
              PDF 저장
            </button>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>남은 횟수 <span style={{ color: '#FF6B35', fontWeight: 700 }}>{remaining}/3</span></div>
            <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.14)', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontSize: '13px', cursor: 'pointer' }}>
              <i className="ti ti-refresh align-middle" aria-hidden="true" /> 새 지문
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Card 1: Format */}
          <Card label="Card 1" title="지문 형식 (Format)" iconCls="ti-file-description" iconBg="background:rgba(100,149,237,0.15);color:#93c5fd" delay={0}>
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', background: 'rgba(100,149,237,0.1)', border: '1px solid rgba(100,149,237,0.2)', color: '#93c5fd', fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 700 }}>
              <i className={`ti ti-${result.format_icon || 'file'}`} aria-hidden="true" /> {result.format}
            </div>
          </Card>

          {/* Card 2: Purpose */}
          <Card label="Card 2" title="지문 목적 유형 (Purpose)" iconCls="ti-target" iconBg="background:rgba(255,107,53,0.12);color:#FB923C" delay={50}>
            <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 600, color: '#FF9162', marginBottom: '4px' }}>{result.purpose_emoji} {result.purpose_type}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{result.purpose_desc}</div>
            </div>
          </Card>

          {/* Card 3: Reading Points */}
          <Card label="Card 3" title="고득점자 읽기 포인트" iconCls="ti-award" iconBg="background:rgba(168,85,247,0.12);color:#C084FC" delay={100}>
            <div style={{ marginTop: '12px' }}>
              {result.reading_points.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '11px 0', borderBottom: i < result.reading_points.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', color: '#C084FC', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{p.ko}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{p.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 4: Skeleton Mode — 3단계 색상 */}
          <Card label="Card 4" title="Skeleton Mode" iconCls="ti-eye" iconBg="background:rgba(230,57,70,0.14);color:#FF6B7A" delay={150}>
            <div style={{ marginTop: '12px' }}>
              {/* 범례 */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(220,38,38,0.15)', color: '#FF4D5A', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>강</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>주어·동사</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(234,88,12,0.15)', color: '#FB923C', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>중</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>목적어·보어</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>약</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>나머지</span>
                </div>
              </div>
              <style>{`
                .sk-strong { color: #FF4D5A; font-weight: 700; font-size: 15px; background: rgba(220,38,38,0.15); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.3px; }
                .sk-medium { color: #FB923C; font-weight: 600; background: rgba(234,88,12,0.12); padding: 2px 5px; border-radius: 4px; }
                .sk-weak { color: rgba(255,255,255,0.38); background: rgba(255,255,255,0.06); padding: 2px 4px; border-radius: 3px; }
              `}</style>
              <div style={{ fontSize: '14px', lineHeight: 2.4 }} dangerouslySetInnerHTML={{ __html: result.skeleton_html }} />
            </div>
          </Card>

          {/* Card 5: Structure */}
          <Card label="Card 5" title="Structure Mode (전개)" iconCls="ti-sitemap" iconBg="background:rgba(255,107,53,0.12);color:#FF6B35" delay={200}>
            <div style={{ marginTop: '12px' }}>
              {result.structure_steps.map((s, i) => (
                <div key={i}>
                  <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,107,53,0.06)', borderLeft: '3px solid rgba(255,107,53,0.5)', margin: '5px 0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.ko}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,107,53,0.7)', marginTop: '2px', letterSpacing: '0.4px' }}>{s.en}</div>
                  </div>
                  {i < result.structure_steps.length - 1 && <div style={{ textAlign: 'center', color: 'rgba(255,107,53,0.4)', fontSize: '18px', margin: '2px 0' }}>↓</div>}
                </div>
              ))}
            </div>
          </Card>

          {/* Card 6: Summary */}
          <Card label="Card 6" title="Skeleton Summary" iconCls="ti-list-check" iconBg="background:rgba(74,222,128,0.1);color:#4ade80" delay={250}>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.skeleton_summary.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, fontWeight: 500 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', marginTop: '6px', flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          </Card>

          {/* Card 7: Layer */}
          <Card label="Card 7" title="문제 Layer 분석" iconCls="ti-layers-subtract" iconBg="background:rgba(250,204,21,0.1);color:#facc15" delay={300}>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {result.questions.map(q => (
                <div key={q.num} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 15px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', width: '28px' }}>{q.num}</span>
                  <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, ...Object.fromEntries((LAYER_STYLE[q.layer] || '').split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim(), v?.trim()] })) }}>🧠 {q.layer}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', flex: 1 }}>{q.desc}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 추가 분석 */}
          <Card label="추가 분석" title="Detail 심층 분석 (클릭하여 열기)" iconCls="ti-zoom-in" iconBg="background:rgba(125,211,252,0.1);color:#7dd3fc" defaultOpen={false} delay={350}>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ExpandItem title="세부 정보 분석" content={result.detail_analysis} />
              <ExpandItem title="함정 분석" content={result.trap_analysis} />
              <ExpandItem title="패러프레이징 분석" content={result.paraphrase} />
              <ExpandItem title="출제 의도 분석" content={result.intent} />
              <ExpandItem title="문장 구조 분석" content={result.sentence_structure} />
            </div>
          </Card>

        </div>
      </div>
    </>
  )
}
