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
  diagnosis: { skeleton: string; structure: string; detail: string }
  usageCount: number
}

interface Props { result: AnalysisResult; onReset: () => void }

const LAYER_STYLE: Record<string, string> = {
  Skeleton: 'bg-red-50 text-red-600 border border-red-200',
  Structure: 'bg-orange-50 text-orange-600 border border-orange-200',
  Detail: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}

function Card({ label, title, iconCls, iconBg, defaultOpen = true, children, delay = 0 }: {
  label: string; title: string; iconCls: string; iconBg: string
  defaultOpen?: boolean; children: React.ReactNode; delay?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden card-anim hover:border-gray-200 transition-colors" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setOpen(!open)}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${iconBg}`}>
          <i className={`ti ${iconCls}`} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{label}</div>
          <div className="font-grotesk text-sm font-bold text-gray-900">{title}</div>
        </div>
        <i className={`ti ti-chevron-down text-gray-300 text-lg transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </div>
      {open && <div className="px-5 pb-5 border-t-2 border-gray-50">{children}</div>}
    </div>
  )
}

function ExpandItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
        <span>{title}</span>
        <i className={`ti ti-chevron-down text-gray-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t-2 border-gray-50 text-sm text-gray-600 leading-relaxed">{content}</div>}
    </div>
  )
}

export default function ResultsSection({ result, onReset }: Props) {
  const remaining = Math.max(0, 3 - result.usageCount)

  return (
    <div>
      <div className="flex items-center justify-between mb-7 pb-4 border-b-2 border-gray-100">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">분석 완료</div>
          <div className="font-grotesk text-xl font-extrabold text-gray-900">📊 독해 구조 분석 결과</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 font-medium">오늘 남은 횟수 <span className="text-orange-500 font-bold">{remaining}/3</span></div>
          <button onClick={onReset} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-400 hover:text-gray-800 transition-all">
            <i className="ti ti-refresh align-middle" aria-hidden="true" /> 새 지문
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Card label="Card 1" title="지문 형식 (Format)" iconCls="ti-file-description" iconBg="bg-blue-50 text-blue-500" delay={0}>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border-2 border-blue-100 text-blue-700 font-grotesk text-base font-bold">
            <i className={`ti ti-${result.format_icon || 'file'}`} aria-hidden="true" /> {result.format}
          </div>
        </Card>

        <Card label="Card 2" title="지문 목적 유형 (Purpose)" iconCls="ti-target" iconBg="bg-orange-50 text-orange-500" delay={50}>
          <div className="mt-3 p-4 rounded-xl bg-orange-50 border-2 border-orange-100">
            <div className="font-grotesk text-sm font-bold text-orange-700 mb-1">{result.purpose_emoji} {result.purpose_type}</div>
            <div className="text-sm text-orange-600">{result.purpose_desc}</div>
          </div>
        </Card>

        <Card label="Card 3" title="고득점자 읽기 포인트" iconCls="ti-award" iconBg="bg-purple-50 text-purple-500" delay={100}>
          <div className="mt-3 flex flex-col divide-y divide-gray-50">
            {result.reading_points.map((p, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <div className="text-sm text-gray-800 font-medium">{p.ko}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.en}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 4" title="Skeleton Mode" iconCls="ti-eye" iconBg="bg-red-50 text-red-500" delay={150}>
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-200 font-bold">RED</span>
              = 주어 · 동사 · 목적어 · 보어
            </div>
            <div className="text-sm leading-9 text-gray-500" dangerouslySetInnerHTML={{ __html: result.skeleton_html }} />
          </div>
        </Card>

        <Card label="Card 5" title="Structure Mode (전개)" iconCls="ti-sitemap" iconBg="bg-orange-50 text-orange-500" delay={200}>
          <div className="mt-3">
            {result.structure_steps.map((s, i) => (
              <div key={i}>
                <div className="px-4 py-3 rounded-xl bg-orange-50 border-l-4 border-orange-400">
                  <div className="text-sm font-semibold text-gray-800">{s.ko}</div>
                  <div className="text-xs text-orange-500 mt-0.5 font-medium">{s.en}</div>
                </div>
                {i < result.structure_steps.length - 1 && (
                  <div className="text-center text-orange-300 text-xl my-1">↓</div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 6" title="Skeleton Summary" iconCls="ti-list-check" iconBg="bg-green-50 text-green-500" delay={250}>
          <div className="mt-3 flex flex-col gap-2.5">
            {result.skeleton_summary.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </Card>

        <Card label="Card 7" title="문제 Layer 분석" iconCls="ti-layers-subtract" iconBg="bg-yellow-50 text-yellow-600" delay={300}>
          <div className="mt-3 flex flex-col gap-2">
            {result.questions.map((q) => (
              <div key={q.num} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100">
                <span className="font-grotesk text-sm font-bold text-gray-400 w-8">{q.num}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${LAYER_STYLE[q.layer] || ''}`}>🧠 {q.layer}</span>
                <span className="text-xs text-gray-400 flex-1">{q.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card label="추가 분석" title="Detail 심층 분석 (클릭하여 열기)" iconCls="ti-zoom-in" iconBg="bg-sky-50 text-sky-500" defaultOpen={false} delay={350}>
          <div className="mt-3 flex flex-col gap-2">
            <ExpandItem title="세부 정보 분석" content={result.detail_analysis} />
            <ExpandItem title="함정 분석" content={result.trap_analysis} />
            <ExpandItem title="패러프레이징 분석" content={result.paraphrase} />
            <ExpandItem title="출제 의도 분석" content={result.intent} />
            <ExpandItem title="문장 구조 분석" content={result.sentence_structure} />
          </div>
        </Card>

        <Card label="학습 진단" title="Layer 역량 진단" iconCls="ti-stethoscope" iconBg="bg-pink-50 text-pink-500" delay={400}>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {(['skeleton', 'structure', 'detail'] as const).map((key) => {
              const s = result.diagnosis[key]
              return (
                <div key={key} className={`rounded-xl p-4 text-center border-2 ${s === 'strong' ? 'bg-green-50 border-green-200' : s === 'weak' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">{key}</div>
                  <div className="text-2xl mb-2">{s === 'strong' ? '✅' : s === 'weak' ? '❌' : '⚪'}</div>
                  <div className={`text-xs font-bold ${s === 'strong' ? 'text-green-600' : s === 'weak' ? 'text-red-600' : 'text-gray-400'}`}>
                    {s === 'strong' ? '✓ 강함' : s === 'weak' ? '✗ 부족' : '— 보통'}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
