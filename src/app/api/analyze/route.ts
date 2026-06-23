// src/app/api/analyze/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/prompt'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MAX_DAILY = 3

const UNLIMITED_EMAILS = ['itzanayoson1@gmail.com']

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

// ✅ 근본적으로 개선된 JSON 파싱 함수
function safeParseJSON(raw: string): object {
  // 1단계: 마크다운 코드블록 제거
  let clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  // 2단계: 바로 파싱 시도 (정상 케이스)
  try {
    return JSON.parse(clean)
  } catch {
    // 3단계: skeleton_html 필드의 큰따옴표 문제 수정
    // skeleton_html 값 안의 HTML 속성 따옴표를 이스케이프 처리
    clean = clean.replace(
      /"skeleton_html"\s*:\s*"([\s\S]*?)(?<!\\)",/,
      (_match, content) => {
        const fixed = content
          .replace(/\\"/g, "'")      // 이미 이스케이프된 따옴표 → 작은따옴표
          .replace(/"/g, "'")        // 남은 따옴표 → 작은따옴표
        return `"skeleton_html": "${fixed}",`
      }
    )

    // 4단계: 재파싱 시도
    try {
      return JSON.parse(clean)
    } catch {
      // 5단계: JSON 끝이 잘린 경우 복구
      const firstBrace = clean.indexOf('{')
      const lastBrace = clean.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        const trimmed = clean.substring(firstBrace, lastBrace + 1)
        try {
          return JSON.parse(trimmed)
        } catch {
          // 6단계: 불완전한 마지막 필드 제거 후 닫기
          const lastComma = trimmed.lastIndexOf(',')
          if (lastComma !== -1) {
            const recovered = trimmed.substring(0, lastComma) + '}'
            return JSON.parse(recovered)
          }
        }
      }
      throw new Error('JSON 복구 실패')
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, imageBase64, imageMediaType, uid, userEmail } = body

    if (!uid) {
      return NextResponse.json({ error: 'Google 로그인이 필요합니다.' }, { status: 401 })
    }

    const isUnlimited = UNLIMITED_EMAILS.includes(userEmail || '')

    if (!isUnlimited) {
      const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
      const snap = await getDoc(ref)
      const currentCount = snap.exists() ? (snap.data().count as number) : 0
      if (currentCount >= MAX_DAILY) {
        return NextResponse.json(
          { error: `오늘 무료 분석 횟수(${MAX_DAILY}회)를 모두 사용했습니다. 내일 다시 이용해주세요.` },
          { status: 429 }
        )
      }
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

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const rawText = response.content.map((b) => (b.type === 'text' ? b.text : '')).join('')

    let parsed: object
    try {
      parsed = safeParseJSON(rawText)
    } catch (parseError) {
      console.error('JSON 파싱 최종 실패. 원본 응답 앞부분:', rawText.substring(0, 300))
      return NextResponse.json(
        { error: '분석 중 오류가 발생했습니다. 다시 시도해 주세요.' },
        { status: 500 }
      )
    }

    let usageCount = 0
    if (!isUnlimited) {
      const ref = doc(db, 'usage', `${uid}_${todayKey()}`)
      const snap = await getDoc(ref)
      const currentCount = snap.exists() ? (snap.data().count as number) : 0
      await setDoc(ref, { count: currentCount + 1, uid, date: todayKey() })
      usageCount = currentCount + 1
    }

    try {
      const p = parsed as Record<string, unknown>
      await addDoc(collection(db, 'history'), {
        uid,
        date: todayKey(),
        createdAt: new Date().toISOString(),
        title: p.title || p.format || '지문 분석',
        format: p.format || '',
        purpose_type: p.purpose_type || '',
        skeleton_summary: p.skeleton_summary || [],
      })
    } catch (historyError) {
      console.error('히스토리 저장 실패:', historyError)
    }

    return NextResponse.json({
      ...(parsed as Record<string, unknown>),
      usageCount,
      isUnlimited,
    })

  } catch (error) {
    console.error('분석 오류:', error)
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: `분석 중 오류가 발생했습니다: ${message}` }, { status: 500 })
  }
}
