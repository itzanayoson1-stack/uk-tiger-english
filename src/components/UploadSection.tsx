'use client'

import { useRef, useState } from 'react'

interface Props {
  onAnalyze: (text: string, imageBase64: string | null, imageMediaType: string | null) => void
  isLoading: boolean
  usageCount: number
}

export default function UploadSection({ onAnalyze, isLoading, usageCount }: Props) {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMediaType, setImageMediaType] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const remaining = Math.max(0, 3 - usageCount)
  const exhausted = remaining === 0

  const handleFile = (file: File) => {
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    setImageMediaType(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setPreviewSrc(src)
      setImageBase64(src.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  if (exhausted) return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>😴</div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>오늘 분량을 다 사용했어요!</h3>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>
        매일 자정에 3회가 다시 충전됩니다.<br />내일 또 열심히 훈련해요! 🐯
      </p>
    </div>
  )

  const canAnalyze = !isLoading && (!!text || !!imageBase64)

  return (
    <div>
      {/* Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        style={{
          border: `2px dashed ${isDragOver ? '#FF6B35' : 'rgba(255,107,53,0.35)'}`,
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragOver ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '40px', color: isDragOver ? '#FF6B35' : 'rgba(255,107,53,0.4)', marginBottom: '12px' }}>
          <i className="ti ti-file-text" aria-hidden="true" />
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
          Part 7 지문과 문제를 올리세요
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
          지문 + 문제 사진을 드래그하거나 클릭해서 업로드
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {['JPG', 'PNG', 'PDF'].map(e => (
            <span key={e} style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{e}</span>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {/* 파일 미리보기 */}
      {fileName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', marginTop: '14px' }}>
          <i className="ti ti-photo" style={{ fontSize: '26px', color: '#FF6B35' }} aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{fileName}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{fileSize}</div>
          </div>
          <button onClick={() => { setFileName(null); setPreviewSrc(null); setImageBase64(null); if (fileRef.current) fileRef.current.value = '' }}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
      )}

      {previewSrc && (
        <img src={previewSrc} alt="업로드된 지문" style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '12px', marginTop: '14px', border: '1px solid rgba(255,255,255,0.1)' }} />
      )}

      {/* 구분선 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        또는 텍스트로 직접 입력
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* 텍스트 입력 */}
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>
        지문 텍스트 입력
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`TOEIC Part 7 지문을 여기에 붙여넣거나 입력하세요...\n\n예시)\nTo: All Staff\nFrom: HR Department\nSubject: New Remote Work Policy\n\nEffective next month, all employees working remotely must submit weekly progress reports...`}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '16px',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          lineHeight: 1.65,
          minHeight: '140px',
          resize: 'vertical',
          outline: 'none',
        }}
      />

      {/* 분석 버튼 — 오렌지색으로 명확하게 */}
      <button
        onClick={() => onAnalyze(text, imageBase64, imageMediaType)}
        disabled={!canAnalyze}
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '18px',
          background: canAnalyze ? '#FF6B35' : 'rgba(255,255,255,0.08)',
          border: canAnalyze ? 'none' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          color: canAnalyze ? '#fff' : 'rgba(255,255,255,0.25)',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          cursor: canAnalyze ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          letterSpacing: '0.3px',
        }}
      >
        <i className="ti ti-brain" style={{ fontSize: '18px' }} aria-hidden="true" />
        <span>Analyze Reading Structure</span>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          opacity: 0.85,
          paddingLeft: '8px',
          borderLeft: canAnalyze ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}>
          분석하기
        </span>
      </button>
    </div>
  )
}
