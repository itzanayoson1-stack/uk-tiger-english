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
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-5">😴</div>
      <h3 className="font-grotesk text-2xl font-bold text-gray-900 mb-3">오늘 분량을 다 사용했어요!</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        매일 자정에 3회가 다시 충전됩니다.<br />내일 또 열심히 훈련해요! 🐯
      </p>
    </div>
  )

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      >
        <div className={`text-5xl mb-3 transition-colors ${isDragOver ? 'text-orange-400' : 'text-gray-300'}`}>
          <i className="ti ti-file-text" aria-hidden="true" />
        </div>
        <div className="font-grotesk text-lg font-bold text-gray-900 mb-1">TOEIC Part 7 지문을 올리세요</div>
        <div className="text-sm text-gray-400 mb-4">이미지를 드래그하거나 클릭해서 업로드</div>
        <div className="flex gap-2 justify-center">
          {['JPG', 'PNG', 'PDF'].map(e => (
            <span key={e} className="px-3 py-1 rounded-full text-xs border-2 border-gray-200 text-gray-400 font-semibold bg-gray-50">{e}</span>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {fileName && (
        <div className="mt-4 flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3">
          <i className="ti ti-photo text-orange-400 text-2xl" aria-hidden="true" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">{fileName}</div>
            <div className="text-xs text-gray-400">{fileSize}</div>
          </div>
          <button onClick={() => { setFileName(null); setPreviewSrc(null); setImageBase64(null); if (fileRef.current) fileRef.current.value = '' }} className="text-gray-300 hover:text-gray-500 text-xl">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
      )}

      {previewSrc && (
        <img src={previewSrc} alt="업로드된 지문" className="mt-3 w-full max-h-52 object-contain rounded-xl border-2 border-gray-200" />
      )}

      <div className="flex items-center gap-3 my-5 text-gray-300 text-sm">
        <div className="flex-1 h-px bg-gray-200" />또는 텍스트로 직접 입력<div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">지문 텍스트 입력</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`TOEIC Part 7 지문을 여기에 붙여넣거나 입력하세요...\n\n예시)\nTo: All Staff\nFrom: HR Department\nSubject: New Remote Work Policy\n\nEffective next month, all employees working remotely must submit weekly progress reports...`}
        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-800 text-sm leading-relaxed min-h-36 outline-none resize-y placeholder-gray-300 focus:border-orange-400 transition-colors"
      />

      <button
        onClick={() => onAnalyze(text, imageBase64, imageMediaType)}
        disabled={isLoading || (!text && !imageBase64)}
        className="w-full mt-4 py-5 bg-gray-900 hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-grotesk font-bold text-base rounded-2xl transition-colors"
      >
        <i className="ti ti-brain text-lg align-middle mr-2" aria-hidden="true" />
        Analyze Reading Structure
      </button>
    </div>
  )
}
