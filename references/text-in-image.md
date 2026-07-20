# 이미지 안 텍스트 렌더링 — 포스터 카피·헤드라인·썸네일·타이포그래피 아트

> 포스터 카피, 광고 헤드라인, 썸네일 문구, 타이포그래피 아트처럼 이미지 **안에 정확한 문자**를 렌더링해야 하는 요청에서 읽는다. 텍스트 렌더링은 gpt-image-2의 플래그십 강점이지만 정확도는 전적으로 프롬프트 설계에 달려 있고, 한글은 로마자 알파벳 계열과 다른 특유의 실패 패턴을 갖는다. 순수 사진/시네마틱 컷이면 이 파일을 읽지 않아도 된다.

## 텍스트 렌더 철칙

1. **따옴표가 카피를 고정한다.** 렌더할 문구는 예외 없이 `headline "…"`, `text reads "…"`처럼 큰따옴표 안에 넣는다. 따옴표 밖에서 같은 문구를 서술형으로 다시 언급하면 모델이 그 문구를 한 번 더 렌더해 중복 텍스트가 나온다(같은 카피를 두 번 쓰면 두 번 렌더된다고 가정할 것).
2. **언어를 명시한다.** 비영어 텍스트는 반드시 언어를 선언한다 — `Korean text: "안녕하세요", bold sans-serif Korean font` 식으로 스크립트와 서체 계열을 함께 못박는다. 언어 선언 없이 따옴표만 주면 오타·유사 글리프 확률이 올라간다.
3. **스펠아웃은 최후 수단 전술이다.** 희귀 브랜드명·조어(신조어 로고타입)는 `정확히 "M-A-N-U-S" 다섯 글자로` 처럼 글자 단위로 짚어준다. 단 이 전술은 **로마자 알파벳 전용**이다 — 한글에 적용하면 다음 절의 "고스트 하이픈" 실패를 그대로 재현한다.
4. **Tier-1 동결 문장으로 정확도를 강제한다.** 렌더 텍스트가 있는 모든 컷의 기본값(티어 0)은 긍정형 한 줄이다.
   ```
   모든 텍스트는 한 번씩만, 완벽히 또렷하게
   ```
   텍스트 블록 3개 이상, 한/영 혼합 카피, 실패 후 재시도, 밀집 텍스트(카드뉴스·인포그래픽) 같은 조건에서는 캐노니컬 결합 문장(동결, 그대로 인용)으로 승격한다.
   ```
   All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs, no watermark.
   ```
   화이트리스트 밖의 영어 부정문(`no ugly font` 류)은 쓰지 않는다 — 검증된 형태는 이 결합 문장과 아래 화이트리스트뿐이다. 동결 문장의 정본과 승격 조건은 `references/core-grammar.md`를 따른다.

   | 문자열 | 용도 |
   |---|---|
   | `no extra words` | 카피 외 텍스트 발명 차단 |
   | `no duplicate text` | 동일 카피 중복 렌더 차단 |
   | `no invented glyphs` | 유령 글리프·가짜 문자 차단 |
   | `no watermark` | 워터마크 차단 |
   | `no logo` | 임의 로고 차단 |
   | `no extra text` | 배경 잡텍스트 차단 |
   | `verbatim, no extra characters` | 따옴표 카피 축자 렌더 강제 |

   승격 조건 없이(렌더 텍스트가 없는 컷에) 이 문구들을 얹지 않는다 — 텍스트가 없는 컷에 텍스트 부정형을 쓰는 것 자체가 실패 신호가 된다.
5. **렌더 문자열 안에서 한/영을 섞지 않는다.** 따옴표 하나에 한글+영문이 같이 들어가면 스크립트 전환 지점에서 글리프가 깨지기 쉽다. 두 언어가 다 필요하면 줄을 나눠 각각 라벨링한다.
   ```
   Korean text: "겨울 세일"
   English text: "WINTER SALE"
   ```
6. **플레이스홀더를 남기지 않는다.** `[TITLE]`, `{상품명}` 같은 슬롯은 그대로 렌더된다. 실제 카피를 채워 넣거나, 카피가 미정이면 임시 완성 문구를 넣고 나중에 교체한다.
7. **폰트는 실재 상표명 대신 계열+성격으로 지정한다.** "Helvetica처럼"보다 `clean geometric sans-serif`, `bold high-contrast didone serif`, `Korean brush calligraphy`처럼 계열 어휘를 쓴다. weight는 `hairline/light/medium/bold/black`으로, 케이스는 영문에 한해 `ALL CAPS`/`Title Case`/`all lowercase`로, 자간은 `wide letter-spacing`(한글 타이틀과 궁합이 좋다)/`tight kerning`으로 명시하고, 텍스트 색은 반드시 HEX로 못박는다(`headline in #0F1D30 on a #F7F4EC field`).

## 한글 특수 규칙

**로마자 풀어쓰기(음절 하이픈 분해)를 금지한다.** "붉은 벽돌"을 발음 유닛으로 쪼개 `"붉-은 벽-돌"`처럼 하이픈으로 풀어쓰면, 모델이 그 하이픈을 문자 그대로 렌더한다 — 실측된 실패 사례("고스트 하이픈")에서 하이픈이 글자 사이에 낱개로 찍혀 나왔다. 어려운 한글 철자를 "정확히 발음대로 나눠 써주면 더 잘 그리겠지"라는 직관은 반대로 작동한다. 대신:
- 카피는 붙여서 자연스러운 한글 문자열 그대로 따옴표에 넣는다.
- `render the Hangul characters exactly as given`을 덧붙여 로마자 변환 시도 자체를 차단한다 — "gyeoul" 같은 로마자 표기를 주면 로마자가 그대로 그려진다.
- 오탈자가 걱정되면 하이픈 분해가 아니라 **캔버스 크기**를 올린다.

**캔버스 크기가 한글 정확도의 1순위 레버다.** 실측(2×2×2 실험)에서 `2048x2048`은 한글 카피가 전 반복에서 만점(12/12)이었고, 실패는 전부 `1024` 캔버스에 집중됐다. quality를 medium→high로 올리는 것보다 size를 키우는 쪽이 한글 정확도에 훨씬 크게 기여한다 — **돈을 쓸 곳은 quality보다 size**. 짧은 카피 1~2줄이라도 정확도가 크리티컬하면 2048 정사각 또는 1536 장변(`1536x1024`/`1024x1536`)을 우선한다.

| 텍스트량 | quality | size |
|---|---|---|
| 텍스트 블록 3개+, 또는 작은 활자(캡션·라벨·본문) | `high` | `2048x2048` 또는 1536 장변 |
| 짧은 카피 1~2줄 (타이틀+서브 정도) | `medium` OK | AR 매핑 기본 size |
| 카드뉴스 본문·인포그래픽처럼 밀집한 텍스트 | `high` 필수 | `2048x2048` 우선 |

글리프 실패(오탈자·유령 글리프)가 나온 재시도 루프의 기본 처방은 "Tier-1 결합 문장 승격 + size 한 단계 업"이다. size 업그레이드 없이 문장만 강화해서는 한글 실패가 잘 풀리지 않는다.

## 존/밴드/역할 라벨 문법

위치는 "위쪽에" 같은 모호한 서술 대신 **3×3 네임드 존**으로 못박는다.

| KO | EN 토큰 | KO | EN 토큰 | KO | EN 토큰 |
|---|---|---|---|---|---|
| 좌상 | `top-left corner` | 상중 | `top-center` | 우상 | `top-right corner` |
| 중좌 | `middle-left` | 정중앙 | `dead center` | 우중 | `middle-right` |
| 좌하 | `bottom-left corner` | 하중 | `bottom-center` | 우하 | `bottom-right corner` |

**밴드 시스템** — 가로 전폭 띠로 텍스트 층을 분리한다: 상단 1/3 타이틀 밴드(`title band occupying the top third`), 중앙띠(`central horizontal band across the middle`), 하단 캡션 밴드(`bottom caption band`). 여백은 `clear margin of ~5% on all edges`, `generous negative space around the headline`로 구체화한다.

**역할 라벨 블록** — 카피가 2개 이상이면 각 블록에 롤 이름을 먼저 붙이고 따옴표 카피를 뒤에 둔다: `headline "…", subhead "…"`. 롤 없이 따옴표만 나열하면 모델이 위계를 임의로 배분한다.

| 롤 | 크기 위계 언어 | 추천 영역 |
|---|---|---|
| headline | `dominant headline, roughly one-third of canvas width` | 상단 1/3 타이틀 밴드 |
| subhead | `subhead at half the headline size` | headline 바로 아래, 같은 정렬 |
| callout | `small floating label with a hairline leader line` | 중좌/우중 |
| caption | `small caption text` | 하단 캡션 밴드 |
| badge | `compact pill-shaped badge` | 우상 코너 |
| CTA | `button-style CTA, high-contrast fill` | 하중 |

단독 드롭인 조각:
- `headline "겨울, 서울" centered in the title band occupying the top third, generous negative space around the headline`
- `caption "2026.01.10 - 02.28" in the bottom caption band, left-aligned ragged-right, clear margin of ~5% on all edges`
- `callout "320g" as a small floating label with a hairline leader line to the product, middle-right`
- `CTA "지금 예약" as a button-style pill at bottom-center, white text on #B76E79`

역할 라벨 블록 전체 드롭인 템플릿:
```
headline "국물의 계절" dominant, roughly one-third of canvas width, centered in the title band
occupying the top third, generous negative space around the headline;
subhead "12월 한정 메뉴" at half the headline size, directly below, same alignment;
caption "2026.01.10 - 02.28" in the bottom caption band, left-aligned ragged-right,
clear margin of ~5% on all edges;
badge "NEW" as a compact pill-shaped badge in the top-right corner.
```

## 타이포 아트 5축 (T1-T5)

렌더 텍스트가 곧 이미지의 주인공인 타이포그래피 아트 컷에서 쓰는 발상 축. 전부 Tier-1 결합 문장 1회가 기본이며, 한글 카피는 캔버스 크기 레버(2048)를 함께 적용한다.

- **T1 움직임 번역** — 대상을 그리지 않고 움직임의 리듬·궤적만 획에 싣는다. 예: `letterforms carrying the surge of an incoming wave, strokes swelling thicker as they rise, crests breaking into fine spray at the stroke tips` — "파도"라는 단어 자체가 파도처럼 휘어진다.
- **T2 의성어·의태어 번역** — 소리의 결을 글자 형태로 옮긴다. 감정·장면을 더하면 결이 달라진다("사르르"보다 "버터가 사르르 녹는"이 더 구체적). 예: `letterforms melting like butter on a warm pan, edges softening and gently drooping`.
- **T3 의도 왜곡** — "볼드하고 눈에 띄게" 대신 왜곡 방향 하나를 먼저 정하고 그 방향으로만 일그러뜨린다. 예: `each glyph sliced horizontally at its waist, the upper half shifted slightly right, distortion stopping just before legibility breaks`.
- **T4 네거티브 스페이스(카운터스페이스 은닉)** — 글자 속 여백에 상징을 살짝 숨긴다. 대놓고 그리면 실패. 효과 좋은 글자: 영문 `o c q d e a h`, 한글 `ㅇ ㅎ ㅁ ㅂ ㅅ ㄷ`. 예: `a tiny kite silhouette subtly hidden inside the round counterspace of "ㅇ", invisible at first glance, discovered on the second look`.
- **T5 글자=세계 마이크로씬** — 거대한 한글 단어 하나의 획 안을 그 단어 정서의 미니어처 씬들로 채운다. 획마다 다른 장면, 반복 없음. 예: `every stroke packed with tiny scenes of {정서·소재}, each stroke its own vignette` — 하단에 손글씨 서브헤드 1줄을 더한다.

## TP 패턴 카탈로그

**타이포그래피가 유일한 주인공인 포스터 아트** 14종. 렌더 단어 1개(또는 2~3어 구)가 화면 최대 시각 요소이고, 일시·장소·크레딧은 소형 위성 텍스트로 위계 분리한다. 팔레트는 2~4색 하드 락 + HEX. **반복·미세 텍스트가 컨셉인 패턴(TP2·TP14류)은 Tier-1 결합 문장과 상충** — `no duplicate text`가 반복 디자인 자체를 죽이므로 이 경우 화이트리스트 서브셋(`no invented glyphs`, `no watermark`)만 쓴다.

| TP | 이름 | 한줄 시그니처 | 적합 용도 |
|---|---|---|---|
| TP1 | 포토 마스킹 | 글자 안을 풍경·도시 사진으로 채운다 | 여행 포스터, 지명 |
| TP2 | 텍스트 터널 | 반복 단어가 소용돌이치며 시야를 빨아들인다 | 몰입형·최면형 카피 |
| TP3 | 타입 건축 | 글자가 건물·블록으로 서 있다(아이소메트릭) | 도시 컨셉, 랜드마크형 |
| TP4 | 광학 현상 타입 | 그림자·반사·역광으로만 존재하는 글자 | 발견의 감각이 필요한 감성 카피 |
| TP5 | 물성 파괴 | 찢기고 조각난 종이질감 글자 | 그런지·스트리트 |
| TP6 | 스위스 키네틱 | 미니멀 그리드 + 사선 절단 | 클린한 브랜드 포스터 |
| TP7 | 재질 조각 | 유리·젤리·대리석·얼음으로 조각된 글자 | 프리미엄 실물감 |
| TP8 | 리퀴드 크롬 | 무거워서 녹아내리는 거울 금속 글자 | Y2K·레이브 |
| TP9 | 인플레이터블 | 풍선처럼 부푼 푹신한 글자 | 귀여운 3D 캐릭터형 |
| TP10 | 옵아트 패턴 | 착시로 진동하는 패턴 글자 | 최면·그래픽 임팩트 |
| TP11 | 애시드 그래픽스 | 형광 클럽 포스터 배색 | 레이브·애시드 |
| TP12 | 퓨처 미디벌 | 블랙레터 × 디지털 글리치 | 고딕·오컬트 |
| TP13 | 아나모픽 착시 | 공간에 칠해진 글자가 특정 시점에서만 정합 | 설치·입체 착시(고위험, 2~3회 리트라이 전제) |
| TP14 | 미크로그래피 | 수천 개 미세 글자 뭉치가 초상을 이룬다 | 텍스트 초상화(고위험, 2~3회 리트라이 전제) |

한글 크로스 공통 규칙: 마스킹(TP1)은 한글 2자 안전권, 3D 압출·조각·풍선·크롬(TP3·TP7·TP8·TP9)은 1~2자, 반복 랩핑·미세 텍스트(TP2·TP14)는 영문이 안전하고 한글이면 2~4자 단어로 제한한다.

### 대표 패턴 상세

**TP8 리퀴드 크롬 Y2K**
- 체크리스트: 거울 반사면에 하늘/보라 그라데이션 환경이 비칠 것 · 획 아래쪽이 물방울처럼 드립되되 자형은 유지될 것 · 스펙큘러 하이라이트 2~3방향 · 배경은 순흑 또는 새벽하늘 그라데이션 위 글자 단독 부유 · 드립 방향은 아래로 일관 · 한글이면 1~2자.
- 드롭인:
  ```
  the word "{단어}" cast in mirror-finish liquid chrome floating on a dark field,
  a dawn-sky gradient of violet and silver reflected across every surface,
  the lower strokes sagging and dripping like heavy liquid while the letterforms
  stay legible, two crisp specular highlights on each letter.
  ```
- 실패 경고: 판독 유지 문구(`the letterforms stay legible despite the melting`)가 이 패턴의 생명줄이다 — 빼면 드립이 자형을 완전히 삼켜버린다. 드립을 사방으로 흘리면 "폭발"로 오독되니 아래 방향 하나로만 통제한다.

**TP14 미크로그래피 (Text Portrait)**
- 체크리스트: 초상 전체가 오직 미세 글자 뭉치에서만 떠오를 것 · 윤곽선 없이 글자 흐름 방향 전환만으로 형태 경계를 표현할 것 · 단색 잉크 + 맨 종이 · 원경~중거리 구도로 초상 전체가 한눈에 잡힐 것 · 크게 앉힌 헤드라인 1개만 또렷이 읽히는 유일한 글자.
- 드롭인:
  ```
  a portrait rendered entirely in micrography, thousands of tiny text-like marks
  on bare paper standing in for tone — denser and bolder in the shadows, sparse
  and thin in the light — the boundaries of the face formed only by shifts in the
  flow direction of the lettering, with one large headline as the single legible word.
  ```
- 실패 경고: 미세 반복 글자는 어떤 엔진에서도 유사문자 뭉개짐이 된다 — **판독을 포기하고 명암 취득 텍스처로만 다루는 것이 공식 전략**이다. Tier-1 결합 문장을 그대로 쓰면 `no duplicate text`가 미세 반복 자체를 억제해 룩이 무너지므로, 부정형은 `the headline appears once, perfectly legible — no watermark.`만 허용한다. 근접 크롭은 뭉개짐이 들통나므로 금지, 초상이 흐리게 나오면 밀도 대비 문구부터 강화해 재시도한다.

**TP4 광학 현상 타입**
- 체크리스트: 헤드라인이 잉크가 아니라 물리 현상(그림자·반사·역광)으로만 존재할 것 · 실물 광원(램프·창)은 또렷하고 물리적으로 렌더될 것 · 반사 변형은 뒤집힘 방향을 명시(`mirrored upside-down`)할 것 · 카피는 짧게(2~5어) — 블러가 오탈자를 은폐해주는 대신 글자 수를 줄여야 한다.
- 드롭인:
  ```
  a real floor lamp on the right edge washing warm light across a plain wall,
  the headline existing purely as soft blurred shadow letters cast on the wall surface,
  every letter edge diffused like a true shadow, the lamp body and cable rendered
  sharp and physical.
  ```
- 실패 경고: 이 패턴은 그림자/반사가 "장면의 서사"가 아니라 "글자 그 자체"라는 점을 프롬프트에서 분명히 해야 한다 — 서술이 애매하면 모델이 진짜 장면 서사용 그림자로 되돌리고 글자를 별도로 얹어버린다. 긴 카피를 시도하면 블러 속에서 오탈자가 나와도 알아채기 어려우니 카피 길이부터 줄인다.

## Worked example

**예 1 — 밴드/역할 라벨 문법 기반 이벤트 포스터**
```
Purpose: seasonal promotion poster for a hot-pot restaurant, portrait format for storefront display.
Scene: a single steaming hot-pot bowl centered in the lower two-thirds of the frame, shot from a
high angle, rising steam catching warm light.
Text-in-image:
headline "국물의 계절" dominant, roughly one-third of canvas width, centered in the title band
occupying the top third, generous negative space around the headline;
subhead "12월 한정 메뉴" at half the headline size, directly below, same alignment;
caption "2026.12.01 - 12.31" in the bottom caption band, left-aligned ragged-right, clear margin
of ~5% on all edges;
badge "NEW" as a compact pill-shaped badge in the top-right corner.
render the Hangul characters exactly as given.
All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs,
no watermark.
Font: bold serif headline in #1E3A5F, light geometric sans-serif subhead in #B76E79.
Color grading: warm broth amber, deep charcoal bowl, cream background #F7F4EC.
Output: size 2048x2048, quality high, AR 4:5.
```

**예 2 — TP8 리퀴드 크롬 응용 캠페인 키아트**
```
Scene: the word "겨울" cast in mirror-finish liquid chrome floating centered on a near-black field,
a dawn-sky gradient of violet and silver reflected across every curved surface, the lower strokes
sagging and dripping like heavy liquid while the letterforms stay legible, one falling chrome
droplet below the final stroke.
Camera: frontal hero framing, slight low angle.
Lighting: two crisp specular highlights per letter, soft violet rim from behind.
Color grading: field #0B0A12, chrome silver #D8DCE4, reflection violet #7A5FD0.
Text-in-image: the chrome word "겨울" appears once; a small flat caption reads "겨울 컬렉션"
in thin capitals at the bottom, Korean text, bold sans-serif Korean font.
render the Hangul characters exactly as given.
All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs,
no watermark.
Output: size 2048x2048, quality high, AR 4:5.
```

## Sources

- 타이포·레이아웃 영역 문법/롤 라벨/정확 문자열 프로토콜/Tier-1 가드 레퍼런스
- 타이포그래피 포스터 패턴 라우터 및 TP1~TP14 개별 패턴 파일
- 컨셉 변수 축 문서의 타이포그래피 아트(T축) 절
- GPT-Image-2 활용 가이드의 텍스트 렌더링 정확도 향상 팁(§8.4)
