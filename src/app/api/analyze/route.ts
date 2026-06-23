import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/prompt'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MAX_DAILY = 3

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, imageBase64, imageMediaType, uid } = body

    if (!uid) {
      return NextResponse.json({ error: 'Google 로그인이 필요합니다.' }, { status: 401 })
    }

    // 서버에서 사용량 확인
    const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
    const snap = await getDoc(ref)
    const currentCount = snap.exists() ? (snap.data().count as number) : 0

    if (currentCount >= MAX_DAILY) {
      return NextResponse.json(
        { error: `오늘 무료 분석 횟수(${MAX_DAILY}회)를 모두 사용했습니다. 내일 다시 이용해주세요.` },
        { status: 429 }
      )
    }

    if (!text && !imageBase64) {
      return NextResponse.json({ error: '지문을 입력하거나 이미지를 업로드해주세요.' }, { status: 400 })
    }

    type ContentBlock =
      | { type: 'text'; text: string }
      | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }

    const userContent: ContentBlock[] = []
    if (imageBase64) {
      userContent.push({ type: 'image', source: { type: 'base64', media_type: imageMediaType || 'image/jpeg', data: imageBase64 } })
    }
    userContent.push({
      type: 'text',
      text: imageBase64
        ? (text ? `이미지 지문과 텍스트를 함께 분석해주세요:\n\n${text}` : '이 이미지의 TOEIC Part 7 지문을 분석해주세요.')
        : `다음 TOEIC Part 7 지문을 분석해주세요:\n\n${text}`,
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
    const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim())

    // 분석 성공 후 사용량 증가
    await setDoc(ref, { count: currentCount + 1, uid, date: todayKey() })

    return NextResponse.json({ ...parsed, usageCount: currentCount + 1 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
