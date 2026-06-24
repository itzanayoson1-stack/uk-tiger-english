// src/app/api/analyze/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT, MULTI_PASSAGE_PROMPT } from '@/lib/prompt'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'

export const maxDuration = 300  // Vercel Pro: 최대 300초 (다중 지문 대응)

// Next.js body 크기 제한 해제 (이미지 여러 장 대응)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MAX_DAILY = 3

const UNLIMITED_EMAILS = ['itzanayoson1@gmail.com']

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function safeParseJSON(raw: string): object {
  let clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  try {
    return JSON.parse(clean)
  } catch {
    clean = clean.replace(
      /"skeleton_html"\s*:\s*"([\s\S]*?)(?<!\\)",/,
      (_match, content) => {
        const fixed = content
          .replace(/\\"/g, "'")
          .replace(/"/g, "'")
        return `"skeleton_html": "${fixed}",`
      }
    )

    try {
      return JSON.parse(clean)
    } catch {
      const firstBrace = clean.indexOf('{')
      const lastBrace = clean.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        const trimmed = clean.substring(firstBrace, lastBrace + 1)
        try {
          return JSON.parse(trimmed)
        } catch {
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
    const {
      text,
      imageBase64,
      imageMediaType,
      // 다중 이미지 지원 (새로 추가)
      images,          // { base64: string, mediaType: string }[]
      isMultiPassage,  // 프론트에서 명시적으로 넘김
      uid,
      userEmail,
    } = body

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

    // ── 이미지 목록 통합 ──────────────────────────────
    // 기존 단일 imageBase64 + 새로운 images[] 배열 모두 지원
    type ImageItem = { base64: string; mediaType: string }
    const allImages: ImageItem[] = []

    if (images && Array.isArray(images) && images.length > 0) {
      allImages.push(...images)
    } else if (imageBase64) {
      allImages.push({
        base64: imageBase64,
        mediaType: imageMediaType || 'image/jpeg',
      })
    }

    if (!text && allImages.length === 0) {
      return NextResponse.json({ error: '지문을 입력하거나 이미지를 업로드해주세요.' }, { status: 400 })
    }

    // ── 다중 지문 자동 감지 ───────────────────────────
    const multiPassageKeywords = [
      '[지문2]', '[지문3]', '[passage 2]', '[passage 3]',
    ]
    const textHasMultiMarker = text
      ? multiPassageKeywords.some(k => text.toLowerCase().includes(k.toLowerCase()))
      : false

    const detectedMultiPassage =
      isMultiPassage === true ||
      allImages.length >= 2 ||
      textHasMultiMarker

    const systemPrompt = detectedMultiPassage ? MULTI_PASSAGE_PROMPT : SYSTEM_PROMPT

    // ── Claude API 메시지 구성 ────────────────────────
    const userContent: Anthropic.MessageParam['content'] = []

    // 이미지를 모두 추가 (순서: 이미지1 → 이미지2 → ... → 텍스트)
    for (const img of allImages) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: img.base64,
        },
      })
    }

    // 텍스트 지시문
    if (detectedMultiPassage) {
      userContent.push({
        type: 'text',
        text: allImages.length > 0
          ? (text
              ? `이미지의 TOEIC Part 7 다중 지문(Double/Triple Passage)과 아래 텍스트를 함께 분석해주세요.\n\n${text}`
              : `이미지의 TOEIC Part 7 다중 지문(Double/Triple Passage)을 분석해주세요.\n이미지가 ${allImages.length}장 있습니다. 각 이미지에서 지문을 추출하고, 지문 간의 관계(Cross-reference 포인트 포함)를 분석해주세요.`)
          : `다음 TOEIC Part 7 다중 지문을 분석해주세요:\n\n${text}`,
      })
    } else {
      userContent.push({
        type: 'text',
        text: allImages.length > 0
          ? (text
              ? `이미지 지문과 텍스트를 함께 분석해주세요:\n\n${text}`
              : '이 이미지의 TOEIC Part 7 지문을 분석해주세요.')
          : `다음 TOEIC Part 7 지문을 분석해주세요:\n\n${text}`,
      })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
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

    // ✅ Firestore 히스토리 저장
    try {
      const p = parsed as Record<string, unknown>
      await addDoc(collection(db, 'history'), {
        uid,
        date: todayKey(),
        createdAt: new Date().toISOString(),
        title: p.title || p.format || '지문 분석',
        format: p.format || (detectedMultiPassage ? p.passage_type : ''),
        purpose_type: p.purpose_type || '',
        skeleton_summary: p.skeleton_summary || [],
        isMultiPassage: detectedMultiPassage,
        passageCount: detectedMultiPassage ? (p.passage_count || allImages.length) : 1,
        fullResult: p,
      })
    } catch (historyError) {
      console.error('히스토리 저장 실패:', historyError)
    }

    return NextResponse.json({
      ...(parsed as Record<string, unknown>),
      usageCount,
      isUnlimited,
      isMultiPassage: detectedMultiPassage,
    })

  } catch (error) {
    console.error('분석 오류:', error)
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    // 반드시 JSON으로 반환 (텍스트 에러 방지)
    return new NextResponse(
      JSON.stringify({ error: `분석 중 오류가 발생했습니다: ${message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
