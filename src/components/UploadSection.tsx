'use client'

import { useRef, useState } from 'react'

interface ImageItem {
  base64: string
  mediaType: string
  previewSrc: string
  fileName: string
  fileSize: string
  compressedSize: string
}

interface Props {
  onAnalyze: (
    text: string,
    images: { base64: string; mediaType: string }[],
    isMultiPassage: boolean
  ) => void
  isLoading: boolean
  usageCount: number
  isUnlimited?: boolean
}

async function compressImage(file: File): Promise<ImageItem> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 800
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5)
      URL.revokeObjectURL(url)
      const base64 = dataUrl.split(',')[1]
      const compressedBytes = Math.round(base64.length * 0.75)
      resolve({
        base64,
        mediaType: 'image/jpeg',
        previewSrc: dataUrl,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + ' KB',
        compressedSize: (compressedBytes / 1024).toFixed(0) + ' KB',
      })
    }
    img.src = url
  })
}

const MAX_IMAGES = 3

export default function UploadSection({ onAnalyze, isLoading, usageCount, isUnlimited = false }: Props) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [compressing, setCompressing] = useState(false)
  // ── 핵심 변경: 수동 토글로 다중 지문 모드 결정 ──
  const [isMultiPassage, setIsMultiPassage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const remaining = Math.max(0, 3 - usageCount)
  const exhausted = !isUnlimited && remaining === 0
  const canAddMore = images.length < MAX_IMAGES

  const handleFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files)
    const slots = MAX_IMAGES - images.length
    const toProcess = fileArr.slice(0, slots)
    if (toProcess.length === 0) return
    setCompressing(true)
    const results = await Promise.all(toProcess.map(compressImage))
    setImages(prev => [...prev, ...results])
    setCompressing(false)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleAnalyze = () => {
    onAnalyze(
      text,
      images.map(img => ({ base64: img.base64, mediaType: img.mediaType })),
      isMultiPassage
    )
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

  const canAnalyze = !isLoading && !compressing && (!!text || images.length > 0)

  return (
    <div>

      {/* ━━━━ 지문 모드 토글 (최상단) ━━━━ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button
          onClick={() => setIsMultiPassage(false)}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700,
            transition: 'all 0.2s',
            background: !isMultiPassage ? '#F94216' : 'rgba(255,255,255,0.06)',
            color: !isMultiPassage ? '#fff' : 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          }}
        >
          <i className="ti ti-file-text" style={{ fontSize: '15px' }} />
          단일 지문
          <span style={{ fontSize: '11px', opacity: 0.8 }}>Single</span>
        </button>
        <button
          onClick={() => setIsMultiPassage(true)}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700,
            transition: 'all 0.2s',
            background: isMultiPassage ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'rgba(255,255,255,0.06)',
            color: isMultiPassage ? '#fff' : 'rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          }}
        >
          <i className="ti ti-files" style={{ fontSize: '15px' }} />
          다중 지문
          <span style={{ fontSize: '11px', opacity: 0.8 }}>Double / Triple</span>
        </button>
      </div>

      {/* 모드 안내 메시지 */}
      <div style={{
        padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', lineHeight: 1.6,
        background: isMultiPassage ? 'rgba(74,222,128,0.08)' : 'rgba(249,66,22,0.06)',
        border: `1px solid ${isMultiPassage ? 'rgba(74,222,128,0.2)' : 'rgba(249,66,22,0.15)'}`,
        color: isMultiPassage ? 'rgba(74,222,128,0.8)' : 'rgba(249,66,22,0.7)',
      }}>
        {isMultiPassage ? (
          <>
            <i className="ti ti-link" style={{ marginRight: '6px' }} />
            <strong>다중 지문 모드:</strong> 한 장에 두 지문이 모두 찍혀 있어도 OK!
            사진 1~3장을 올리면 지문 간 관계와 Cross-reference 포인트를 분석해드립니다.
          </>
        ) : (
          <>
            <i className="ti ti-file-text" style={{ marginRight: '6px' }} />
            <strong>단일 지문 모드:</strong> Part 7 단일 지문(151~175번) 사진 또는 텍스트를 입력하세요.
          </>
        )}
      </div>

      {/* ── 업로드 영역 ── */}
      <div
        onClick={() => canAddMore && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (canAddMore) setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setIsDragOver(false)
          if (canAddMore) handleFiles(e.dataTransfer.files)
        }}
        style={{
          border: `2px dashed ${isDragOver ? '#F94216' : isMultiPassage ? 'rgba(74,222,128,0.45)' : 'rgba(249,66,22,0.35)'}`,
          borderRadius: '16px', padding: '36px 24px', textAlign: 'center',
          cursor: canAddMore ? 'pointer' : 'default',
          background: isDragOver ? 'rgba(249,66,22,0.08)' : isMultiPassage ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.03)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '36px', color: isMultiPassage ? '#4ade80' : isDragOver ? '#F94216' : 'rgba(249,66,22,0.4)', marginBottom: '10px' }}>
          <i className={`ti ${isMultiPassage ? 'ti-files' : 'ti-file-text'}`} aria-hidden="true" />
        </div>

        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
          {images.length === 0
            ? (isMultiPassage ? '다중 지문 사진을 올리세요' : 'Part 7 지문 사진을 올리세요')
            : canAddMore
              ? `사진 추가 (${images.length}/${MAX_IMAGES}장)`
              : `최대 ${MAX_IMAGES}장 업로드됨`}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
          {isMultiPassage
            ? '한 장에 두 지문이 함께 찍혀 있어도 분석 가능 · 최대 3장'
            : '지문 + 문제가 담긴 사진을 드래그하거나 클릭해서 업로드'}
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {['JPG', 'PNG'].map(e => (
            <span key={e} style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{e}</span>
          ))}
          {isMultiPassage && (
            <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', border: '1px solid rgba(74,222,128,0.3)', color: 'rgba(74,222,128,0.6)', fontWeight: 600 }}>최대 3장</span>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={isMultiPassage}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* ── 업로드된 이미지 목록 ── */}
      {images.length > 0 && (
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {images.map((img, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${isMultiPassage ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isMultiPassage ? 'rgba(74,222,128,0.2)' : 'rgba(249,66,22,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: isMultiPassage ? '#4ade80' : '#F94216', flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {isMultiPassage ? `지문 ${index + 1}` : '지문'} — {img.fileName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                    원본 {img.fileSize} <span style={{ color: '#4ade80' }}>→ 압축 후 {img.compressedSize}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '18px', padding: '4px' }}
                >
                  <i className="ti ti-x" aria-hidden="true" />
                </button>
              </div>
              <img
                src={img.previewSrc}
                alt={`지문 ${index + 1}`}
                style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)', display: 'block' }}
              />
            </div>
          ))}

          {compressing && (
            <div style={{ textAlign: 'center', padding: '12px', color: '#F94216', fontSize: '13px' }}>
              <i className="ti ti-loader" style={{ marginRight: '6px' }} />이미지 압축 중...
            </div>
          )}
        </div>
      )}

      {/* ── 구분선 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        또는 텍스트로 직접 입력
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>지문 텍스트 입력</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`TOEIC Part 7 지문을 여기에 붙여넣거나 입력하세요...\n\n예시)\nTo: All Staff\nFrom: HR Department\nSubject: New Remote Work Policy\n\nEffective next month, all employees working remotely must submit weekly progress reports...`}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: 1.65, minHeight: '140px', resize: 'vertical', outline: 'none' }}
      />

      {/* ── 분석 버튼 ── */}
      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        style={{
          width: '100%', marginTop: '16px', padding: '18px',
          background: canAnalyze
            ? (isMultiPassage ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#F94216')
            : 'rgba(255,255,255,0.08)',
          border: canAnalyze ? 'none' : '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          color: canAnalyze ? '#fff' : 'rgba(255,255,255,0.25)',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700,
          cursor: canAnalyze ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}
      >
        <i className={`ti ${isMultiPassage ? 'ti-link' : 'ti-brain'}`} style={{ fontSize: '18px' }} aria-hidden="true" />
        <span>
          {compressing ? '이미지 압축 중...' : isMultiPassage ? 'Multi-Passage Analysis' : 'Analyze Reading Structure'}
        </span>
        {!compressing && (
          <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.85, paddingLeft: '8px', borderLeft: canAnalyze ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
            {isMultiPassage ? '다중 지문 분석' : '분석하기'}
          </span>
        )}
      </button>

    </div>
  )
}
