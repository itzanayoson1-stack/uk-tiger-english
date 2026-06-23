// src/components/AuthSection.tsx
'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, User } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

const UNLIMITED_EMAILS = ['itzanayoson1@gmail.com']

interface Props {
  onUserChange: (user: User | null, usageCount: number) => void
  usageCount?: number
}

export default function AuthSection({ onUserChange, usageCount: externalCount }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [internalCount, setInternalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loginError, setLoginError] = useState('')

  const usageCount = externalCount !== undefined ? externalCount : internalCount
  const isUnlimited = user ? UNLIMITED_EMAILS.includes(user.email || '') : false
  const remaining = Math.max(0, 3 - usageCount)

  useEffect(() => {
    // ✅ 리디렉션 로그인 결과 먼저 확인 (모바일 대응)
    getRedirectResult(auth).catch(() => {})

    const timeout = setTimeout(() => { setLoading(false); onUserChange(null, 0) }, 5000)
    const unsub = onAuthStateChanged(auth, async (u) => {
      clearTimeout(timeout)
      setUser(u)
      if (u) {
        try {
          const res = await fetch(`/api/usage?uid=${u.uid}`)
          const data = await res.json()
          const count = data.count || 0
          setInternalCount(count)
          onUserChange(u, count)
        } catch { onUserChange(u, 0) }
      } else { onUserChange(null, 0) }
      setLoading(false)
    })
    return () => { clearTimeout(timeout); unsub() }
  }, [onUserChange])

  const login = async () => {
    setLoginError('')
    try {
      // ✅ 팝업 시도 → 실패 시 리디렉션으로 자동 전환 (모바일/팝업 차단 대응)
      await signInWithPopup(auth, googleProvider)
    } catch (e: unknown) {
      const err = e as { code?: string }
      console.error('팝업 로그인 실패:', err)
      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        // ✅ 팝업 차단된 경우 리디렉션 방식으로 전환
        try {
          await signInWithRedirect(auth, googleProvider)
        } catch (redirectErr) {
          console.error('리디렉션 로그인도 실패:', redirectErr)
          setLoginError('로그인에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.')
        }
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setInternalCount(0)
    onUserChange(null, 0)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid #FF6B35', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      로딩 중...
    </div>
  )

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
      <button
        onClick={login}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#333', cursor: 'pointer' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google로 시작하기
      </button>
      {loginError && (
        <span style={{ fontSize: '11px', color: '#ff6b6b' }}>{loginError}</span>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* 사용량 표시 */}
      {isUnlimited ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '10px' }}>
          <span style={{ fontSize: '14px' }}>♾️</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>무제한 이용</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF6B35' }}>오늘 남은 횟수</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < remaining ? '#FF6B35' : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35' }}>{remaining}/3</span>
        </div>
      )}

      {/* 유저 정보 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user.photoURL && <img src={user.photoURL} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />}
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          {user.displayName?.split(' ')[0]}님
        </span>
        <button onClick={logout} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
