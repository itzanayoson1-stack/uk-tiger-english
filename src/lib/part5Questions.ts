// src/lib/part5Questions.ts
// TOEIC Part 5 - 변형 문제 풀 (원본 기출 어휘 5~10% 변형)

export interface Part5Question {
  id: number
  sentence: string
  options: { A: string; B: string; C: string; D: string }
  answer: 'A' | 'B' | 'C' | 'D'
  category: 'grammar' | 'vocabulary' | 'preposition' | 'conjunction'
  explanation: string
}

export const PART5_QUESTIONS: Part5Question[] = [
  // ─── TEST 1 (101~130) ───────────────────────────────────────────
  {
    id: 1,
    sentence: "The seminar will be held at 7:00 P.M., ------- which participants may submit questions.",
    options: { A: "across", B: "after", C: "inside", D: "among" },
    answer: "B",
    category: "preposition",
    explanation: "'after which' = 관계부사 구문으로 '그 이후에'를 의미. 시간적 순서를 나타내는 전치사 after가 정답."
  },
  {
    id: 2,
    sentence: "The ------- furniture store in Maple Grove will shut down next month.",
    options: { A: "last", B: "lasts", C: "lasted", D: "lasting" },
    answer: "A",
    category: "grammar",
    explanation: "명사(furniture store) 앞에서 형용사 역할을 하는 'last(마지막 남은)'가 정답. lasting은 '지속되는' 의미로 문맥 불일치."
  },
  {
    id: 3,
    sentence: "Greenfield residents will receive an online progress ------- about the ongoing highway expansion project.",
    options: { A: "update", B: "change", C: "payment", D: "request" },
    answer: "A",
    category: "vocabulary",
    explanation: "'status update(현황 업데이트)'는 토익 빈출 표현. 진행 중인 프로젝트 관련 정보 제공에는 update가 가장 자연스러움."
  },
  {
    id: 4,
    sentence: "As a result of ------- many years leading global media firms, Ms. Park was nominated for the Edison Journalism Award.",
    options: { A: "she", B: "her", C: "hers", D: "herself" },
    answer: "B",
    category: "grammar",
    explanation: "전치사 'of' 다음에는 목적격 또는 동명사의 의미상 주어(소유격)가 옴. 'of her leading'에서 her가 정답."
  },
  {
    id: 5,
    sentence: "To prevent the ------- of computer malware, do not open suspicious attachments.",
    options: { A: "break", B: "spread", C: "balance", D: "surface" },
    answer: "B",
    category: "vocabulary",
    explanation: "'spread(확산)'는 바이러스나 악성코드의 전파를 나타내는 토익 빈출 어휘."
  },
  {
    id: 6,
    sentence: "The recruiting manager ------- reviewed each applicant's portfolio and experience.",
    options: { A: "caring", B: "careful", C: "carefully", D: "carefulness" },
    answer: "C",
    category: "grammar",
    explanation: "동사(reviewed)를 수식하려면 부사가 필요. carefully(부사)가 정답."
  },
  {
    id: 7,
    sentence: "In November, Ms. Tanaka will travel to Australia ------- will oversee the launch of the new Sydney branch.",
    options: { A: "because", B: "in addition", C: "and", D: "prior to" },
    answer: "C",
    category: "conjunction",
    explanation: "두 개의 절을 연결하는 등위접속사 and가 정답. 앞뒤 문장이 동등한 관계로 연결됨."
  },
  {
    id: 8,
    sentence: "Nortech Pharmaceuticals is expanding its product ------- to include prescription medications.",
    options: { A: "to line", B: "lining", C: "lined", D: "line" },
    answer: "D",
    category: "grammar",
    explanation: "'product line(제품군)'은 토익 빈출 명사 복합어. line이 명사로 쓰여 product를 수식."
  },
  {
    id: 9,
    sentence: "Benford, Inc., continuously ------- innovative approaches to reduce its use of single-use plastics.",
    options: { A: "seeks", B: "seeker", C: "to seek", D: "seeking" },
    answer: "A",
    category: "grammar",
    explanation: "주어(Benford, Inc.) 다음 본동사 자리. 3인칭 단수 현재형 seeks가 정답."
  },
  {
    id: 10,
    sentence: "The point-of-sale systems at Pirkle Books automatically ------- the remaining stock of books available.",
    options: { A: "calculate", B: "calculator", C: "calculating", D: "calculation" },
    answer: "A",
    category: "grammar",
    explanation: "조동사(automatically) 뒤 본동사 자리. 동사원형 calculate가 정답."
  },
  {
    id: 11,
    sentence: "The engineering team is developing scanning software that can ------- identify underground resources.",
    options: { A: "infinitely", B: "sincerely", C: "precisely", D: "greatly" },
    answer: "C",
    category: "vocabulary",
    explanation: "'precisely(정밀하게)'는 탐지/측정 관련 문맥에서 빈출. 기술적 정확성을 강조."
  },
  {
    id: 12,
    sentence: "According to Director Kato, it would not be ------- responsible to expand the warehouse at this time.",
    options: { A: "finance", B: "financials", C: "financially", D: "financing" },
    answer: "C",
    category: "grammar",
    explanation: "형용사(responsible)를 수식하는 부사 자리. financially(재정적으로)가 정답."
  },
  {
    id: 13,
    sentence: "Analysts cannot predict with any ------- what the national demand for electric vehicles will be.",
    options: { A: "certainty", B: "justice", C: "excellence", D: "denial" },
    answer: "A",
    category: "vocabulary",
    explanation: "'with certainty(확실하게)'는 토익 빈출 표현. 예측 불확실성 문맥에 적합."
  },
  {
    id: 14,
    sentence: "As part of its promotional campaign, Elegancia Kitchenware is ------- soliciting feedback from buyers.",
    options: { A: "lightly", B: "loyally", C: "actively", D: "cleanly" },
    answer: "C",
    category: "vocabulary",
    explanation: "'actively(적극적으로)'는 마케팅/홍보 활동 문맥의 토익 빈출 부사."
  },
  {
    id: 15,
    sentence: "Rooftop gardens are designed to ------- water to help prevent flooding of nearby streets.",
    options: { A: "engage", B: "undergo", C: "absorb", D: "overwhelm" },
    answer: "C",
    category: "vocabulary",
    explanation: "'absorb(흡수하다)'는 물/빗물과 관련된 환경 주제에서 빈출."
  },
  {
    id: 16,
    sentence: "Sigma Industries' development program aims to boost the ------- of its assembly systems.",
    options: { A: "producer", B: "produced", C: "productive", D: "productivity" },
    answer: "D",
    category: "grammar",
    explanation: "동사(boost)의 목적어 자리에 명사가 필요. productivity(생산성)가 정답."
  },
  {
    id: 17,
    sentence: "The board of directors voted to give Ms. Nakamura a bonus for her role ------- securing the international contract.",
    options: { A: "in", B: "at", C: "except", D: "apart" },
    answer: "A",
    category: "preposition",
    explanation: "'role in + 동명사(~하는 데 있어서의 역할)'는 토익 빈출 구문."
  },
  {
    id: 18,
    sentence: "The operations director gave his approval ------- the project can move forward.",
    options: { A: "along", B: "furthermore", C: "cautiously", D: "so that" },
    answer: "D",
    category: "conjunction",
    explanation: "'so that(~할 수 있도록)'은 목적을 나타내는 접속사. approval 이후 결과/목적 절을 연결."
  },
  {
    id: 19,
    sentence: "The magazine article describes ways job seekers can ------- for having limited workplace experience.",
    options: { A: "reply", B: "capture", C: "compensate", D: "accumulate" },
    answer: "C",
    category: "vocabulary",
    explanation: "'compensate for(~을 보완하다)'는 토익 빈출 동사구."
  },
  {
    id: 20,
    sentence: "Ms. Chen and Mr. Davis were both highly qualified for the position, but ------- got the job.",
    options: { A: "myself", B: "neither", C: "anybody", D: "whoever" },
    answer: "B",
    category: "grammar",
    explanation: "'neither(둘 다 아닌)'는 두 명 모두 해당하지 않음을 나타내는 대명사."
  },
  {
    id: 21,
    sentence: "Ennis Photography acquired all new studio equipment ------- the high cost.",
    options: { A: "even though", B: "however", C: "until", D: "despite" },
    answer: "D",
    category: "conjunction",
    explanation: "'despite + 명사구'는 양보를 나타냄. 뒤에 절이 아닌 명사구가 오므로 despite가 정답."
  },
  {
    id: 22,
    sentence: "Marburton residents who wish to ------- a home should contact the award-winning team at Kwan Real Estate.",
    options: { A: "seller", B: "sold", C: "sell", D: "selling" },
    answer: "C",
    category: "grammar",
    explanation: "wish to 다음에는 동사원형이 옴. sell이 정답."
  },
  {
    id: 23,
    sentence: "Maswa Bistro entered into a ------- agreement with local farmers to purchase seasonal produce each week.",
    options: { A: "disruptive", B: "cooperative", C: "grateful", D: "concerned" },
    answer: "B",
    category: "vocabulary",
    explanation: "'cooperative(협력적인)'는 파트너십/계약 문맥의 빈출 형용사."
  },
  {
    id: 24,
    sentence: "The city's new downtown parking ------- have been met with opposition from residents and commuters.",
    options: { A: "restricts", B: "restricted", C: "restrictions", D: "restricting" },
    answer: "C",
    category: "grammar",
    explanation: "주어 자리에 복수 명사가 필요. restrictions(제한 조치들)가 정답."
  },
  {
    id: 25,
    sentence: "The plumbing role requires extensive training, even for those who studied ------- in technical college.",
    options: { A: "diligently", B: "scientifically", C: "objectively", D: "decidedly" },
    answer: "A",
    category: "vocabulary",
    explanation: "'diligently(성실하게)'는 학습/업무 태도를 나타내는 토익 빈출 부사."
  },
  {
    id: 26,
    sentence: "With its fixed price ------- Omega Cellular guarantees no monthly bill increases for two years.",
    options: { A: "assurance", B: "assuredly", C: "assuring", D: "assures" },
    answer: "A",
    category: "grammar",
    explanation: "전치사(With) 다음 명사 자리. assurance(보장)가 정답."
  },
  {
    id: 27,
    sentence: "As head of analytics, Mr. Ko has served at Lochston Ltd. with great ------- for over two decades.",
    options: { A: "deduction", B: "duplication", C: "declaration", D: "dedication" },
    answer: "D",
    category: "vocabulary",
    explanation: "'with dedication(헌신적으로)'은 장기 근속 직원 묘사의 토익 빈출 표현."
  },
  {
    id: 28,
    sentence: "Milltown Hospital's cafeteria offers breakfast seven days a week ------- only on weekdays for lunch.",
    options: { A: "up to", B: "as though", C: "each time", D: "rather than" },
    answer: "D",
    category: "conjunction",
    explanation: "'rather than(~보다는)'은 대조를 나타내는 토익 빈출 표현."
  },
  {
    id: 29,
    sentence: "The warehouse's entire supply of timber comes from a nearby ------- supplier.",
    options: { A: "financial", B: "promotional", C: "chemical", D: "commercial" },
    answer: "D",
    category: "vocabulary",
    explanation: "'commercial supplier(상업 공급업체)'는 비즈니스 문맥의 빈출 표현."
  },
  {
    id: 30,
    sentence: "For a $95 ------- fee, our technicians will assess what repairs are needed.",
    options: { A: "diagnosed", B: "diagnostic", C: "diagnosable", D: "diagnose" },
    answer: "B",
    category: "grammar",
    explanation: "명사(fee) 앞 형용사 자리. diagnostic(진단의)이 정답."
  },

  // ─── TEST 2 (101~130) ───────────────────────────────────────────
  {
    id: 31,
    sentence: "The all-new Amore sports sedan is engineered for maximum durability ------- fuel efficiency.",
    options: { A: "so", B: "but", C: "and", D: "nor" },
    answer: "C",
    category: "conjunction",
    explanation: "'and'는 두 명사구(durability와 fuel efficiency)를 병렬 연결하는 등위접속사."
  },
  {
    id: 32,
    sentence: "The staff was grateful for the ------- that Mr. Schuller shared at the conference.",
    options: { A: "information", B: "informed", C: "informs", D: "inform" },
    answer: "A",
    category: "grammar",
    explanation: "관사(the) 다음 명사 자리. information(정보)이 정답."
  },
  {
    id: 33,
    sentence: "The next session of the planning committee will begin ------- at 3 P.M.",
    options: { A: "barely", B: "closely", C: "evenly", D: "promptly" },
    answer: "D",
    category: "vocabulary",
    explanation: "'promptly(정각에, 즉시)'는 시간 관련 문맥의 토익 최빈출 부사."
  },
  {
    id: 34,
    sentence: "Reimbursement for business travel expenses will be included in ------- October 15 paycheck.",
    options: { A: "you", B: "your", C: "yours", D: "yourself" },
    answer: "B",
    category: "grammar",
    explanation: "명사(paycheck) 앞 소유격 자리. your가 정답."
  },
  {
    id: 35,
    sentence: "The ------- design engineer on the drone mapping project is Iseul Bae.",
    options: { A: "lead", B: "each", C: "front", D: "most" },
    answer: "A",
    category: "vocabulary",
    explanation: "'lead(수석의)'는 직책 앞에 쓰이는 토익 빈출 형용사. lead engineer = 수석 엔지니어."
  },
  {
    id: 36,
    sentence: "After consulting several reviews, Mr. Kim was able to decide which copier ------- for the office.",
    options: { A: "buying", B: "had bought", C: "buy", D: "to buy" },
    answer: "D",
    category: "grammar",
    explanation: "decide + which + to부정사: 'which printer to buy'가 올바른 구문."
  },
  {
    id: 37,
    sentence: "Please remove the boxes left in the storage room ------- 6 P.M.",
    options: { A: "of", B: "to", C: "as", D: "by" },
    answer: "D",
    category: "preposition",
    explanation: "'by + 시간'은 '~까지'를 나타내는 토익 최빈출 전치사 표현."
  },
  {
    id: 38,
    sentence: "The Southport ------- plant is expected to begin operations in five days.",
    options: { A: "manufacture", B: "manufactured", C: "manufacturing", D: "manufactures" },
    answer: "C",
    category: "grammar",
    explanation: "명사(plant) 앞 형용사 역할의 현재분사 자리. manufacturing(제조)이 정답."
  },
  {
    id: 39,
    sentence: "After receiving a job offer, a candidate must ------- all onboarding tasks before the start date.",
    options: { A: "complete", B: "proceed", C: "recover", D: "enlist" },
    answer: "A",
    category: "vocabulary",
    explanation: "'complete tasks(업무를 완료하다)'는 토익 빈출 동사구."
  },
  {
    id: 40,
    sentence: "Although ------- orientation has just begun, Ms. Yu has already mastered the company's accounting software.",
    options: { A: "her", B: "she", C: "hers", D: "herself" },
    answer: "A",
    category: "grammar",
    explanation: "명사(orientation) 앞 소유격 자리. her가 정답."
  },
  {
    id: 41,
    sentence: "Ms. Clayton was ------- to find that none of her documents had been lost during the system failure.",
    options: { A: "easy", B: "delightful", C: "relieved", D: "absolute" },
    answer: "C",
    category: "vocabulary",
    explanation: "'relieved(안도한)'는 걱정이 해소된 감정 상태를 나타내는 형용사."
  },
  {
    id: 42,
    sentence: "During Ms. Nagahori's term as CEO at Unten Properties, the company has grown ------- .",
    options: { A: "signify", B: "significance", C: "significant", D: "significantly" },
    answer: "D",
    category: "grammar",
    explanation: "동사(has grown)를 수식하는 부사 자리. significantly(상당히)가 정답."
  },
  {
    id: 43,
    sentence: "Safety must always be the top ------- in each phase of the metalworking process.",
    options: { A: "surface", B: "material", C: "priority", D: "position" },
    answer: "C",
    category: "vocabulary",
    explanation: "'top priority(최우선 사항)'는 토익 빈출 명사 표현."
  },
  {
    id: 44,
    sentence: "Central Science Museum hosts online workshops by specialists who ------- topics related to environmental technology.",
    options: { A: "are covered", B: "covering", C: "to cover", D: "cover" },
    answer: "D",
    category: "grammar",
    explanation: "관계절에서 선행사(specialists)를 수식하는 동사 자리. 능동태 cover가 정답."
  },
  {
    id: 45,
    sentence: "Conradia Computers ------- changed the direction of its advertising strategy last quarter.",
    options: { A: "thickly", B: "abruptly", C: "formerly", D: "frequently" },
    answer: "B",
    category: "vocabulary",
    explanation: "'abruptly(갑자기)'는 예상치 못한 변화를 나타내는 토익 빈출 부사."
  },
  {
    id: 46,
    sentence: "Because of an abundance of ------- candidates, Xaniper Industries may take longer than expected to appoint a new CFO.",
    options: { A: "qualify", B: "qualifier", C: "qualified", D: "qualifies" },
    answer: "C",
    category: "grammar",
    explanation: "명사(candidates) 앞 형용사 자리. qualified(자격을 갖춘)가 정답."
  },
  {
    id: 47,
    sentence: "All of our laptop computers come with a two-year warranty ------- includes hardware repairs and replacements.",
    options: { A: "that", B: "who", C: "what", D: "it" },
    answer: "A",
    category: "grammar",
    explanation: "선행사(warranty)가 사물이므로 관계대명사 that이 정답."
  },
  {
    id: 48,
    sentence: "The Exprite Foundation Board of Directors is ------- of twelve members who are elected annually by stakeholders.",
    options: { A: "expected", B: "described", C: "composed", D: "announced" },
    answer: "C",
    category: "vocabulary",
    explanation: "'be composed of(~로 구성되다)'는 토익 빈출 수동태 표현."
  },
  {
    id: 49,
    sentence: "Financial advisors generally prefer to review all relevant documents ------- meeting with a prospective client.",
    options: { A: "toward", B: "further", C: "lately", D: "before" },
    answer: "D",
    category: "preposition",
    explanation: "'before + 동명사'는 시간 순서를 나타내는 토익 빈출 표현."
  },
  {
    id: 50,
    sentence: "Management will ------- candidates for promotion by the end of the quarter.",
    options: { A: "identify", B: "identifying", C: "will identify", D: "to identify" },
    answer: "A",
    category: "grammar",
    explanation: "조동사(will) 다음 동사원형 자리. identify가 정답."
  },
  {
    id: 51,
    sentence: "While we typically charge $30 for missed appointments, we understand that ------- circumstances may arise.",
    options: { A: "unforeseen", B: "excessive", C: "approximate", D: "acclaimed" },
    answer: "A",
    category: "vocabulary",
    explanation: "'unforeseen(예상치 못한)'은 불가피한 상황을 설명하는 토익 빈출 형용사."
  },
  {
    id: 52,
    sentence: "At Blu Hedge, clients earn 1.5 percent interest, pay no monthly fees, and can make unlimited ------- .",
    options: { A: "transfer", B: "transfers", C: "transferred", D: "transferring" },
    answer: "B",
    category: "grammar",
    explanation: "make의 목적어 자리에 복수 명사가 필요. transfers(이체)가 정답."
  },
  {
    id: 53,
    sentence: "Farist Bakery, which specializes in artisan catering, is located ------- the Liverpool Convention Center.",
    options: { A: "near", B: "without", C: "since", D: "following" },
    answer: "A",
    category: "preposition",
    explanation: "'near(~근처에)'는 위치를 나타내는 토익 빈출 전치사."
  },
  {
    id: 54,
    sentence: "The presentations were ------- than we anticipated, so there was extra time for audience questions.",
    options: { A: "brief", B: "briefly", C: "briefer", D: "briefest" },
    answer: "C",
    category: "grammar",
    explanation: "than이 있으므로 비교급 자리. briefer(더 짧은)가 정답."
  },
  {
    id: 55,
    sentence: "According to our shipping ------- , your order will arrive in five days or we will refund 30 percent of the cost.",
    options: { A: "distribution", B: "guarantee", C: "exception", D: "discount" },
    answer: "B",
    category: "vocabulary",
    explanation: "'guarantee(보장)'는 환불 정책 문맥의 토익 빈출 어휘."
  },
  {
    id: 56,
    sentence: "Several Tokyo-based firms have ------- redesigned their office spaces to be more open and collaborative.",
    options: { A: "note", B: "noted", C: "notable", D: "notably" },
    answer: "D",
    category: "grammar",
    explanation: "동사(redesigned)를 수식하는 부사 자리. notably(특히, 눈에 띄게)가 정답."
  },
  {
    id: 57,
    sentence: "The company picnic will be postponed until next Saturday because of the ------- cold temperatures this week.",
    options: { A: "deceptively", B: "unnecessarily", C: "irresponsibly", D: "unseasonably" },
    answer: "D",
    category: "vocabulary",
    explanation: "'unseasonably(계절답지 않게)'는 날씨 관련 문맥의 토익 빈출 부사."
  },
  {
    id: 58,
    sentence: "The marketing department is in second place in the office fund-raising drive, ------- just three days to go.",
    options: { A: "against", B: "namely", C: "with", D: "else" },
    answer: "C",
    category: "preposition",
    explanation: "'with + 시간(~을 남겨두고)'는 토익 빈출 독립 전치사구 표현."
  },
  {
    id: 59,
    sentence: "Pink Geranium Coffee has struggled to ------- its new canned espresso from similar beverages on the market.",
    options: { A: "participate", B: "distinguish", C: "overturn", D: "revoke" },
    answer: "B",
    category: "vocabulary",
    explanation: "'distinguish A from B(A를 B와 구별하다)'는 토익 빈출 동사구."
  },
  {
    id: 60,
    sentence: "------- it is occasionally inconvenient, Mr. Ohtani expects all staff members to attend his weekly briefing.",
    options: { A: "Though", B: "As soon as", C: "Because", D: "When" },
    answer: "A",
    category: "conjunction",
    explanation: "'Though(비록 ~이지만)'는 양보절을 이끄는 접속사. 불편함에도 불구하고 참석을 요구하는 문맥에 적합."
  },
]

// 랜덤 문제 1개 반환
export function getRandomQuestion(): Part5Question {
  const idx = Math.floor(Math.random() * PART5_QUESTIONS.length)
  return PART5_QUESTIONS[idx]
}
