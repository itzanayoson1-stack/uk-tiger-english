import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  if (!uid) return NextResponse.json({ history: [] })

  try {
    // 인덱스 없이도 작동하도록 — uid로만 필터링 후 클라이언트에서 정렬
    const q = query(
      collection(db, 'history'),
      where('uid', '==', uid),
      limit(50)
    )
    const snap = await getDocs(q)
    const history = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => b.createdAt?.localeCompare(a.createdAt))
    return NextResponse.json({ history })
  } catch (error) {
    console.error('히스토리 오류:', error)
    return NextResponse.json({ history: [], error: String(error) })
  }
}
