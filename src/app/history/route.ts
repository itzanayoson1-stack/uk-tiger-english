import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  if (!uid) return NextResponse.json({ history: [] })

  try {
    const q = query(
      collection(db, 'history'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    const history = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ history })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ history: [] })
  }
}
