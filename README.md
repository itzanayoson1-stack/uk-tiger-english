# 🐯 UK Tiger 영어 읽기 훈련소

TOEIC Part 7 독해 구조 분석 플랫폼 — Read Structure, Not Words

---

## 🚀 배포 가이드 (Firebase + Vercel)

### ✅ 준비물
- Google 계정
- Anthropic API 키 (`sk-ant-api03-...`)
- GitHub 계정

---

## STEP 1 — Firebase 설정 (10분)

### 1-1. Firebase 프로젝트 만들기
1. [console.firebase.google.com](https://console.firebase.google.com) 접속
2. **프로젝트 만들기** 클릭
3. 프로젝트 이름: `uk-tiger` → 계속
4. Google 애널리틱스: 꺼도 됨 → **프로젝트 만들기**

### 1-2. 웹앱 추가 (환경변수 얻기)
1. 프로젝트 홈에서 **</>** (웹) 아이콘 클릭
2. 앱 닉네임: `uk-tiger-web` → **앱 등록**
3. 화면에 나오는 `firebaseConfig` 값들을 복사해 보관

```js
// 이런 형태입니다
const firebaseConfig = {
  apiKey: "AIza...",           // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "uk-tiger.firebaseapp.com",  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "uk-tiger",       // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "uk-tiger...",// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123...", // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc..."    // NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### 1-3. Google 로그인 켜기
1. 왼쪽 메뉴 **Authentication** → **시작하기**
2. **Sign-in method** 탭
3. **Google** 클릭 → 사용 설정 켜기
4. 지원 이메일 선택 → **저장**

### 1-4. Firestore 데이터베이스 만들기
1. 왼쪽 메뉴 **Firestore Database** → **데이터베이스 만들기**
2. **프로덕션 모드** 선택 → 다음
3. 위치: `asia-northeast3 (Seoul)` 선택 → **완료**

### 1-5. Firestore 보안 규칙 설정
1. **Firestore Database** → **규칙** 탭
2. 아래 내용으로 교체 후 **게시**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usage/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

---

## STEP 2 — GitHub에 코드 올리기 (5분)

1. [github.com](https://github.com) → 새 저장소 만들기
   - 이름: `uk-tiger`
   - Public 선택 → **Create repository**

2. 터미널에서:
```bash
cd uk-tiger
git init
git add .
git commit -m "첫 배포"
git remote add origin https://github.com/본인아이디/uk-tiger.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Vercel 배포 (5분)

1. [vercel.com](https://vercel.com) → GitHub으로 로그인
2. **Add New → Project** → `uk-tiger` 저장소 선택 → **Import**
3. **Environment Variables** 섹션에서 아래 6+1개 추가:

| 이름 | 값 |
|------|-----|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase에서 복사한 값 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase에서 복사한 값 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase에서 복사한 값 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase에서 복사한 값 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase에서 복사한 값 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase에서 복사한 값 |

4. **Deploy** 클릭 → 2분 후 완료!

---

## STEP 4 — Firebase에 Vercel 도메인 등록 (중요!)

Google 로그인이 작동하려면 Vercel 도메인을 Firebase에 등록해야 합니다.

1. Vercel에서 배포된 URL 확인 (예: `uk-tiger-abc.vercel.app`)
2. Firebase Console → **Authentication** → **Settings** 탭
3. **승인된 도메인** → **도메인 추가**
4. `uk-tiger-abc.vercel.app` 입력 → **추가**

---

## ✅ 완료!

`https://uk-tiger-abc.vercel.app` 으로 접속하면:
- Google 로그인 → 하루 3회 무료 분석
- 분석 횟수는 매일 자정 자동 리셋

---

## 💻 로컬 개발

```bash
npm install
cp .env.local.example .env.local
# .env.local 에 모든 키 입력
npm run dev
# http://localhost:3000
```
