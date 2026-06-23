import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  if (!uid) return NextResponse.json({ count: 0 })

  const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
  const snap = await getDoc(ref)
  const count = snap.exists() ? (snap.data().count as number) : 0
  return NextResponse.json({ count, max: 3 })
}
