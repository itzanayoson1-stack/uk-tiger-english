import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UK Tiger 영어 읽기 훈련소',
  description: 'TOEIC Part 7 독해 구조 분석 — Read Structure, Not Words',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
