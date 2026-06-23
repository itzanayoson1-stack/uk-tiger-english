'use client'

import { useEffect, useState } from 'react'

interface HistoryItem {
  id: string
  date: string
  createdAt: string
  title: string
  format: string
  purpose_type: string
  skeleton_summary: string[]
}

interface Props {
  uid: string
  onClose: () => void
}

export default function HistoryPanel({ uid, onClose }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/history?uid=${uid}`)
      .then(r => r.json())
      .then(d => { setHistory(d.history || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [uid])

  // 날짜별로 묶기
  const grouped = history.reduce((acc, item) => {
    const date = item.date
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, HistoryItem[]>)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f1e35',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 헤더 */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff' }}>📋 분석 히스토리</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>날짜별 분석 기록</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px 12px', fontSize: '13px' }}>
            닫기
          </button>
        </div>

        {/* 목록 */}
        <div style={{ overflowY: 'auto', padding: '16px 24px 24px', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>
              불러오는 중...
            </div>
          )}
          {!loading && history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>아직 분석 기록이 없어요</div>
            </div>
          )}
          {!loading && Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map(date => (
            <div key={date} style={{ marginBottom: '24px' }}>
              {/* 날짜 헤더 */}
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B35', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.2)' }} />
                {formatDate(date)}
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,107,53,0.2)' }} />
              </div>

              {/* 해당 날짜 항목들 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {grouped[date].map(item => (
                  <div key={item.id} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF6B35', background: 'rgba(255,107,53,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                        {item.format || '지문'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                      {item.title}
                    </div>
                    {item.skeleton_summary?.[0] && (
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                        {item.skeleton_summary[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
