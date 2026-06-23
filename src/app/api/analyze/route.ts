import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/prompt'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'

export const maxDuration = 60

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

    const userContent: Anthropic.MessageParam['content'] = []

    if (imageBase64) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: (imageMediaType || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: imageBase64,
        },
      })
    }

    userContent.push({
      type: 'text',
      text: imageBase64
        ? (text ? `이미지 지문과 텍스트를 함께 분석해주세요:\n\n${text}` : '이 이미지의 TOEIC Part 7 지문을 분석해주세요.')
        : `다음 TOEIC Part 7 지문을 분석해주세요:\n\n${text}`,
    })

    // ① AI 분석 먼저 실행
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
    const clean = rawText.replace(/```json|```/g, '').trim()

    // ② JSON 파싱 성공 후에만 횟수 차감
    const parsed = JSON.parse(clean)

    // ③ 분석 성공 확정 → 사용량 업데이트
    await setDoc(ref, { count: currentCount + 1, uid, date: todayKey() })

    // ④ 히스토리 저장
    try {
      await addDoc(collection(db, 'history'), {
        uid,
        date: todayKey(),
        createdAt: new Date().toISOString(),
        title: parsed.title || parsed.format || '지문 분석',
        format: parsed.format || '',
        purpose_type: parsed.purpose_type || '',
        skeleton_summary: parsed.skeleton_summary || [],
      })
    } catch (historyError) {
      // 히스토리 저장 실패해도 분석 결과는 반환
      console.error('히스토리 저장 실패:', historyError)
    }

    return NextResponse.json({ ...parsed, usageCount: currentCount + 1 })

  } catch (error) {
    console.error('분석 오류:', error)
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    // 오류 시 횟수 차감 없이 에러만 반환
    return NextResponse.json({ error: `분석 중 오류가 발생했습니다: ${message}` }, { status: 500 })
  }
}
