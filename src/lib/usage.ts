import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const MAX_DAILY = 3

function todayKey() {
  return new Date().toISOString().slice(0, 10) // "2025-01-15"
}

export async function getUsage(uid: string): Promise<number> {
  const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data().count as number) : 0
}

export async function incrementUsage(uid: string): Promise<number> {
  const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
  const snap = await getDoc(ref)
  const current = snap.exists() ? (snap.data().count as number) : 0
  const next = current + 1
  await setDoc(ref, { count: next, uid, date: todayKey() })
  return next
}

export async function canUse(uid: string): Promise<boolean> {
  const count = await getUsage(uid)
  return count < MAX_DAILY
}

export { MAX_DAILY }
