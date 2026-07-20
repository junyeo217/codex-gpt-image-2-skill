# 레인: 커머셜 (Commercial)

**로드 조건**: 제품 광고, 캠페인 포스터, 브랜딩 목업, 발주서(job spec) 형태의 이미지 요청일 때 이 레인을 로드한다. 코어 문법 대신 커머셜 슬롯 템플릿, 카피 여백 관행, 프로모 포스터 패턴만 다룬다.

## 코어 조합 순서

| 순서 | 코어 레퍼런스 | 이 레인에서의 역할 |
|---|---|---|
| 1 | `../core-grammar.md` | 6-section 구조를 베이스로 잡는다. |
| 2 | `../cinematic-stills.md` | 조명/재질/컬러그레이딩 어휘를 가져온다. |
| 3 | `../text-in-image.md` | 헤드라인·카피·라벨 텍스트 규칙(따옴표 고정, 배치, 위계)을 적용한다. |
| 4 | `../character-consistency.md` | 모델이 등장하면 얼굴·의상 앵커를 고정한다. |
| 5 | `../edit-workflows.md` | 목업 합성, 제품 교체, 배경 스왑 등 편집 요청일 때 적용. |

## 도메인 디폴트

- **기본 비율**: 4:5(캠페인 포스터/SNS 피드), 1:1(제품컷/플랫레이/스와치), 16:9(데스크 무드/브랜드 스테이셔너리).
- **기본 구도 관행**: 카피가 들어갈 자리(보통 하단 1/3 또는 세로 컬럼 하나)를 이미지 구도 단계에서 미리 비워둔다. 제품은 중앙 정렬 또는 45도 매크로, 헤드라인은 장식이 아니라 화면에서 가장 큰 시각 요소이자 피사체와 물리적으로 얽히는 구조물로 다룬다.
- **팔레트 관행**: 2~3색 하드 락(밝은 필드 1 + 딥 톤 1 + 액센트 최대 1). hex 값을 명시하고, 배경/잉크/액센트 역할을 각각 지정한다.

## 도메인 어휘/패턴

### 커머셜 슬롯 템플릿 (제품/캠페인/브랜딩 계열)

로컬 커머셜 프롬프트 라이브러리에서 반복되는 슬롯 순서:

```
Scene: [피사체·연출 컨셉 한 문단]
Camera: [앵글, 프레이밍, 심도]
Lighting: [광원 방향, 소프트박스/자연광, 하이라이트 처리]
Color grading: [색온도 K값, hex 팔레트 2~3개]
Texture/Medium: [재질·질감 디테일]
Text-in-image: [정확한 카피, 배치, 서체 톤, "한 번씩만 또렷하게"]
AR [비율]
```

- 카피 영역: `하단 1/3은 카피 영역으로 비워 타이포 위계를 잡는다` 같은 문장을 Scene 슬롯에 직접 넣는다.
- 가상 모델 디스클레이머: 실제 인물처럼 보이는 모델이 등장하면 `(공인 인물이 아닌 가상의 모델)` 또는 `a fictional model, not a real public figure`를 Scene 슬롯에 명시한다.
- 텍스트 규칙: 라벨/헤드라인/캡션은 정확한 문구를 따옴표로 고정하고 "모든 텍스트는 한 번씩만 또렷하게" 지시를 항상 붙인다.

### 프로모 포스터 패턴 카탈로그 (P1~P8)

레이아웃·타이포 문법 8종. 하나의 요청에는 패턴 1개만 적용한다(팔레트 이중 지정 금지).

| 패턴 | 이름 | 한 줄 시그니처 | 적합 용도 |
|---|---|---|---|
| P1 | 타이포-마스크 | 초대형 글자 획 안에 사진이 마스킹되어 글자와 이미지가 한 몸이 된다 | 매거진 커버, 시즌 홍보물 |
| P2 | 타이포-환경 | 글자가 그래픽이 아니라 물리적 무대(계단·빛기둥·스포트라이트)가 된다 | 하이컨셉 티저, 브랜드 매니페스토 |
| P3 | 오버사이즈 크롭+오클루전 | 캔버스보다 큰 단어를 크롭해 깔고 제품이 글자를 가려 z-레이어 깊이를 만든다 | 단품 홍보, 메뉴/SNS 제품 광고(가장 범용) |
| P4 | 컬러 블로킹 캠페인 | 2색 하드 락 + 카피 공식 1개 + 컷마다 소품 1개만 교체 | 9그리드/캐러셀 시리즈 캠페인 |
| P5 | 메타 UI 디바이스 | 선택박스·SNS 포스트 카드·아카이브 탭 등 UI 요소를 인쇄물에 얹은 척 | 힙한 스튜디오/포트폴리오 톤 |
| P6 | 스트리트 콜라주 | 기울인 사진 + 인물이 프레임을 깨고 튀어나옴 + 헤드라인이 머리 뒤로 지나감 | 이벤트, 팝업, 스트리트 브랜드 |
| P7 | 에디토리얼 회전축 | 사진/타이포가 90도 회전해 세로로 흐르는 3서체 레이아웃 | 룩북 커버, 시즌 캠페인 |
| P8 | 모노크롬 스테이징 | 제품·단상·배경을 한 색 가족의 명도 계단으로 통일 | 코스메틱/테크 액세서리 하이엔드 연출 |

대표 드롭인 블록:

- **P3 (단품형)**: `the product name set vertically in colossal bold letters taller than the canvas, cropped at top and bottom, the hero product photographed with one crisp contact shadow overlapping the middle letters so the word reads behind it, a two-tone field split in the product's own color family, a compact info block with small copy in one lower corner`
- **P4 (시리즈 DNA 문장)**: `flat two-color campaign world where every surface, prop and garment is tinted in the two locked palette colors, the product always in frame, oversized campaign copy interlocking with the objects, small logo chip in one corner` + 컷마다 소품 컨셉 한 문장을 추가.

### 발주서(job spec) 템플릿

에이전시/클라이언트 브리프처럼 라벨 슬롯으로 요청이 들어올 때 그대로 채운다. 6-section 구조와 매핑되지만 커머셜 발주 관행에서는 이 레이블을 그대로 쓰는 편이 소통이 빠르다.

```
Use case: [용도 — 광고/배너/목업/디자인 자산]
Asset type: [최종 산출물 형태, 비율, 해상도]
Primary request: [핵심 요구 한 문장]
Scene: [배경/무대]
Subject: [핵심 피사체]
Style: [렌더 방식/무드]
Composition: [프레이밍, 카피 여백]
Lighting: [광원, 톤]
Color palette: [hex 2~3개]
Constraints: [필수 준수 사항]
Positive-guard: [배제하고 싶은 요소를 Tier-0 긍정문으로 재작성 — 예: "clean unbranded surfaces, single rendering of all copy" (core-grammar §티어형 네거티브)]
```

## 미니 체크리스트

- [ ] 카피가 들어갈 여백을 구도 단계에서 미리 비웠는가(하단 1/3 등)
- [ ] 팔레트가 2~3색으로 하드 락 됐고 hex가 명시됐는가
- [ ] 텍스트는 따옴표로 정확히 고정하고 "한 번씩만 또렷하게"를 붙였는가
- [ ] 실사형 모델이 등장하면 가상 인물 디스클레이머를 넣었는가
- [ ] 발주서형 요청이면 Use case/Constraints/Positive-guard 슬롯이 비어 있지 않은가
- [ ] 프로모 패턴(P1~P8) 중 1개만 선택하고 다른 패턴과 섞지 않았는가
- [ ] 출력 비율/사이즈가 채널 규격(포스터/피드/배너)에 맞는가

## Sources

로컬 커머셜 프롬프트 라이브러리(패션·제품 도감·캠페인 포스터·브랜딩 목업 계열, Scene/Camera/Lighting/Color grading/Texture/Text-in-image 슬롯 관행), 프로모 포스터 레이아웃 라우터(P1~P8 패턴 카탈로그), 이미지 자산 매니페스트의 라벨형 발주 브리프 형식 — 일반 명칭만 표기, 로컬 경로는 이 파일에 포함하지 않는다.
