// src/app/api/history/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json({ error: 'uid가 필요합니다.' }, { status: 400 })
    }

    const q = query(
      collection(db, 'history'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    const snapshot = await getDocs(q)
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ history })
  } catch (error) {
    console.error('히스토리 조회 오류:', error)
    return NextResponse.json({ error: '히스토리를 불러오지 못했습니다.' }, { status: 500 })
  }
}
