'use client'

import { useRef, useState } from 'react'

interface Props {
  onAnalyze: (text: string, imageBase64: string | null, imageMediaType: string | null) => void
  isLoading: boolean
  usageCount: number
}

// 이미지를 최대 1200px, 품질 0.7로 압축
async function compressImage(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
      URL.revokeObjectURL(url)
      resolve({ base64: dataUrl.split(',')[1], mediaType: 'image/jpeg' })
    }
    img.src = url
  })
}

export default function UploadSection({ onAnalyze, isLoading, usageCount }: Props) {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [compressedSize, setCompressedSize] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMediaType, setImageMediaType] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const remaining = Math.max(0, 3 - usageCount)
  const exhausted = remaining === 0

  const handleFile = async (file: File) => {
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(0) + ' KB')
    setCompressing(true)

    // 미리보기용 원본
    const url = URL.createObjectURL(file)
    setPreviewSrc(url)

    // 압축
    const { base64, mediaType } = await compressImage(file)
    const compressedBytes = Math.round(base64.length * 0.75)
    setCompressedSize((compressedBytes / 1024).toFixed(0) + ' KB')
    setImageBase64(base64)
    setImageMediaType(mediaType)
    setCompressing(false)
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

  const canAnalyze = !isLoading && !compressing && (!!text || !!imageBase64)

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
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
              원본 {fileSize}
              {compressing && <span style={{ color: '#FF6B35', marginLeft: '8px' }}>압축 중...</span>}
              {compressedSize && !compressing && <span style={{ color: '#4ade80', marginLeft: '8px' }}>→ 압축 후 {compressedSize}</span>}
            </div>
          </div>
          <button onClick={() => {
            setFileName(null); setPreviewSrc(null); setImageBase64(null)
            setFileSize(null); setCompressedSize(null)
            if (fileRef.current) fileRef.current.value = ''
          }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>
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

      {/* 분석 버튼 */}
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
        }}
      >
        <i className="ti ti-brain" style={{ fontSize: '18px' }} aria-hidden="true" />
        <span>{compressing ? '이미지 압축 중...' : 'Analyze Reading Structure'}</span>
        {!compressing && (
          <span style={{
            fontSize: '14px', fontWeight: 600, opacity: 0.85,
            paddingLeft: '8px',
            borderLeft: canAnalyze ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
          }}>
            분석하기
          </span>
        )}
      </button>
    </div>
  )
}
