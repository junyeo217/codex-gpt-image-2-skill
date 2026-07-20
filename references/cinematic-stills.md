# 시네마틱 스틸 — 드라마 스틸 / MV 프레임 / 고퀄 단품 공용 프레임워크

이 문서는 gpt-image-2로 "영화 한 컷처럼 보이는" 정지 이미지를 만들기 위한 **상위 구성 원리**를 다룬다. 카메라·렌즈·조명·구도·색감의 개별 어휘 목록은 여기서 반복하지 않는다. 그런 단어가 필요하면 `photo-prompt-master/` 안의 해당 파일을 펼쳐서 골라 쓴다. 이 문서는 그 단어들을 "어떤 틀에 담아야 영화적 컷이 되는가"를 가르친다.

로드 조건: 드라마 스틸컷, 뮤직비디오 한 프레임, 광고/화보성 시네마틱 단품처럼 "정지된 한 장면"을 설계할 때 로드한다. 카메라/렌즈/노출/조명/색감의 세부 어휘 자체가 필요하면 `photo-prompt-master/01_camera_lens_exposure.md`, `02_light.md`, `03_composition.md`, `04_color.md` 등을 직접 참조한다.

---

## 미장센 6요소 프레임워크

미장센(Mise-en-scène)은 "장면 안에 놓기"라는 뜻으로, 프레임 안에 보이는 모든 시각 요소를 감독이 의도적으로 배치한 결과를 가리킨다. 프롬프트를 쓴다는 것은 이 미장센을 텍스트로 지시하는 것과 같다. 아래 6요소로 장면을 먼저 분해한 뒤 문장을 조립하면, "예쁜 이미지"가 아니라 "이유가 있는 이미지"가 나온다.

### 1. 인물의 배치 (Staging & Blocking)
프레임 안에서 인물이 어디에 서 있는가, 어디를 보는가, 타인과 얼마나 떨어져 있는가가 감정적 거리와 권력관계를 전달한다. 인물이 차지하지 않는 "빈 공간"도 미장센의 일부다.

- 한글: 화면 맨 왼쪽 가장자리에 홀로 선 인물이 카메라를 외면한다. 오른쪽은 드넓은 빈 공간으로 가득 차 있다. 초광각 샷, 채도가 낮은 흐린 낮의 빛.
- 영문: `A lone figure standing at the far left edge of the frame, looking away from camera. Vast empty space fills the right side. Extreme wide shot, desaturated overcast daylight.`
- 세부 어휘: `photo-prompt-master/03_composition.md` (시점·앵글·샷 사이즈), `07_subject_direction_environment.md` (포즈·시선)

### 2. 조명 (Lighting)
조명은 시간/장소 정보, 인물의 심리 상태, 장르 신호를 동시에 전달한다. 빛의 방향·질감(부드러움/딱딱함)·색온도 세 가지를 반드시 명시하고, 밝은 빛만 쓰고 그림자를 빠뜨리지 않는다 — 그림자 묘사가 없으면 평면적인 이미지가 나온다.

- 한글: 왼쪽 책상 스탠드의 따뜻한 황색 불빛이 얼굴 절반을 비추고 나머지 절반은 짙은 그림자에 가려진다. 조명이 분할되어, 빛을 받은 쪽은 차분하고 그림자 쪽은 표정을 읽을 수 없다.
- 영문: `Half the face lit by warm amber light from a desk lamp on the left, the other half in deep shadow. Split lighting; the lit side shows a calm expression, the shadow side unreadable.`
- 세부 어휘: `photo-prompt-master/02_light.md` (라이팅 패턴, 광 품질·방향, 조명 장비)

### 3. 색채 (Color)
색은 감정의 언어다. 보색 대비는 인물을 배경에서 분리하고, 유사색은 인물을 환경에 동화시킨다. 이야기가 진행될수록 팔레트가 따뜻→차가움으로 이동하면 관객은 무의식적으로 톤의 하강을 감지한다.

- 한글: 선명한 빨간 코트를 입은 여인이 채도 낮은 회색 도시를 걷는다. 화면에서 유일하게 채도가 높은 색은 빨간 코트뿐이다. 흐린 겨울 햇살.
- 영문: `A woman in a vivid red coat walking through a cold, desaturated gray cityscape. The red coat is the only saturated color in the frame. Overcast winter light.`
- 세부 어휘: `photo-prompt-master/04_color.md` (색채 이론, 색공간, 컬러 그레이딩)

### 4. 공간과 세트 (Setting & Space)
장소는 배경이 아니라 이야기의 참여자다. 좁은 방은 억압, 넓은 들판은 자유나 고립을 상징한다. 전경/중경/후경을 명시적으로 분리하면 평면적이지 않은 깊이감이 생긴다.

- 한글: 전경 — 커피잔을 쥔 손. 중경 — 테이블 건너편에 앉은 여성(초점 약간 흐림). 배경 — 빗줄기 흐르는 창문과 흐릿한 도시 불빛. 깊은 심도 구도, 따뜻한 실내와 차가운 실외 대비.
- 영문: `Foreground: a hand gripping a coffee cup. Midground: a woman sitting across the table, slightly out of focus. Background: rain-streaked window with blurred city lights. Deep depth of field, warm interior vs. cold exterior contrast.`
- 세부 어휘: `photo-prompt-master/07_subject_direction_environment.md` (환경·로케이션), `08_time_weather_mood.md` (시간대·날씨)

### 5. 의상과 소품 (Costume & Props)
인물이 입은 것과 손에 든 것은 대사 없이 캐릭터를 설명한다. "예쁘게 보이려고"가 아니라 "이야기를 전달하려고" 존재해야 하며, 재질과 상태(닳음, 얼룩, 주름)까지 써야 구체성이 산다.

- 한글: 세월의 흔적이 묻은 손이 빛바랜 사진을 쥔 클로즈업. 사진은 갈라지고 누렇게 변색됐다. 약지에 심플한 금색 결혼반지. 부드럽고 따뜻한 측면광, 얕은 심도로 배경은 완전히 흐릿하다.
- 영문: `Close-up of weathered hands holding a faded, cracked, yellowed photograph. A plain gold wedding ring on the ring finger. Soft warm side lighting, shallow depth of field, background completely blurred.`
- 세부 어휘: `photo-prompt-master/07_subject_direction_environment.md` (스타일링·소품)

### 6. 구도 (Composition)
위 다섯 요소가 결합되는 최종 설계도. 삼등분 법칙, 대칭 구도, 선도선(leading lines), 프레임 안의 프레임(문틀·창문·거울) 같은 원리를 목적에 맞게 고른다.

- 한글: 완벽하게 대칭적인 구도. 양쪽에 동일한 문이 있는 긴 복도가 소실점으로 모인다. 한 사람이 복도 끝 정중앙에 서 있다. 눈높이 샷, 형광등 조명, 은은한 녹색 색조.
- 영문: `Perfectly symmetrical composition. A long corridor with identical doors on both sides, converging at a vanishing point. A single figure stands dead center at the far end. Eye-level shot, fluorescent overhead lighting, muted green palette.`
- 세부 어휘: `photo-prompt-master/03_composition.md` (컴포지션 & 시각이론)

**체크리스트**: 프롬프트를 쓰기 전에 6요소를 각각 한 문장으로 답할 수 있는지 확인한다. 답할 수 없는 요소는 프레임에 있을 이유가 없다.

**흔한 실수 두 가지**
- 감정만 쓰고 시각 정보를 빠뜨린다 — "슬프고 외로운 분위기"는 AI가 시각화할 방법이 없다. 조명·색감·프레이밍으로 번역해야 한다.
- 한 프롬프트에 여러 순간을 욱여넣는다 — "대화하다가 한 명이 일어나 나가고, 남은 사람이 창밖을 본다"는 하나의 이미지가 아니라 서너 개의 컷이다. 정지화 한 장에는 하나의 순간만 담는다.

이 6요소는 "왜 이것을 프레임에 넣는가"에 답하는 상위 레이어다. 실제로 문장을 조립할 때는 아래 8슬롯 태그소노미로 옮겨 담으면 빠뜨리는 슬롯 없이 완성도가 올라간다.

---

## 스틸 = 정지화 원칙

시네마틱 스틸은 "영상에서 잘라낸 한 프레임"이 아니라 **액션이 시작되기 직전, 완전히 멈춘 한 장의 사진**이다. 이 구분은 영상 파이프라인으로 핸드오프할 때 특히 중요하다: 이미지 프롬프트는 초기 상태(initial state)만 보여주고, 전환·동작은 후속 video 프롬프트가 담당한다.

- 옷이 벗겨지는 장면이면 이미지에서는 아직 입고 있다. 누가 들어오는 장면이면 이미지에서는 방이 비어 있다.
- **금지 어휘**: walking, running, reaching, turning, dancing, gesturing 같은 동작 동사. "떨어지는 중", "흩날리는", "미소 짓기 시작하는" 같은 진행형·전이 묘사도 모션이다.
- **허용 어휘**: 정지된 포즈만 — `standing with arms crossed`, `seated at desk`, `leaning against railing`, `mid-stride frozen`(스틸 사진 특유의 동결된 순간을 의도적으로 쓸 때만) 등.
- 인물을 참조 이미지에서 유지할 때는 캐릭터를 이름이 아니라 시각 특징 + 소스 이미지로 앵커링한다: "the woman with the short bob from the second image".
- 사고법: "카메라 셔터가 지금 눌렸다면 무엇이 프레임에 얼어붙어 있는가"를 묻는다. 그 답만 문장으로 옮긴다.

---

## 8슬롯 시네마틱 태그소노미

고퀄 시네마틱 단품에서 반복적으로 관찰되는 슬롯 구조는 아래 8개다. 슬롯 순서를 지키면 빠뜨리는 정보 없이 프롬프트를 채울 수 있다.

| 슬롯 | 채우는 내용 | 채우기 규칙 |
| --- | --- | --- |
| 1. 인물 | 연령대·인종·체형·기본 외형 | 특정 인물 일관성이 필요하면 레퍼런스 이미지 앵커링 문구를 여기 배치 |
| 2. 포즈 및 표정 | 정지된 자세, 시선 방향, 표정 근육의 상태 | 모션 동사 금지 — "정지화 원칙" 참조 |
| 3. 의상 | 아이템, 색상, 재질, 상태(닳음/얼룩/주름) | "a jacket"이 아니라 "a worn leather jacket with frayed cuffs" 수준까지 |
| 4. 헤어·메이크업 | 헤어 컬러/스타일, 피부 톤, 메이크업 톤 | 조명 슬롯과 모순되지 않게(예: 로우키 조명인데 하이라이트 메이크업 강조는 어색) |
| 5. 조명 및 빛 방향 | 광원의 위치·질감·색온도, 그림자 형태 | 반드시 "동기(motivated)"를 부여 — 빛의 출처를 명시 |
| 6. 질감과 색감 무드 | 필름 질감, 컬러 그레이딩, 전반적 팔레트 | 필름스톡명 또는 HEX 팔레트로 구체화(아래 절 참조) |
| 7. 필름/카메라/렌즈/심도/앵글 | 카메라 모델, 렌즈 모델, 심도, 앵글, 종횡비 | **스펙 슬롯 패턴**으로 명시 |
| 8. 배경 요소 (옵션) | 공간의 종류, 후경 디테일 | 인물과의 전경/중경/후경 관계로 서술 |

**스펙 슬롯 패턴**: 7번 슬롯은 키:값 슬롯 구조를 유지하되, 값은 실제 촬영 장비명이 아니라 그 장비가 만드는 시각적 결과로 서술한다(장비명을 그대로 나열하면 core-grammar §철칙4 위반). 초점거리 mm 수치는 유지해도 되지만, 브랜드·모델명은 쓰지 않는다.

```
sensor look: digital cinema large-format rendering, subtle highlight rolloff, film LUT applied
lens character: 40mm-equivalent vintage prime — gentle halation, low micro-contrast, soft field edges + anamorphic flare in post
depth of field: shallow, f/2.8-f/4
angle: low-angle medium shot
aspect ratio: 2.39:1
```

6번 슬롯의 팔레트도 같은 방식으로 HEX 값을 나열해 재현성을 높일 수 있다:

```
color palette (HEX): #0d1318, #162025, #cbe7f4, #2c3331, #b0d9ea
```

문장형으로 풀어 쓰지 않고 "sensor look / lens character / HEX" 같은 키:값 슬롯으로 명시하면, 모델이 각 값을 독립적으로 해석해 서로 다른 슬롯의 정보가 섞이지 않는다. 세부 카메라·렌즈 어휘는 `photo-prompt-master/01_camera_lens_exposure.md`를 참조.

**AI 인공물 방지 (선택)**: 8슬롯 뒤에 원치 않는 결과를 `no ~` 부정문으로 나열하지 않는다(core-grammar.md §철칙 1, §Tier-0) — 대신 원하는 마감 상태를 긍정 절로 직접 덧붙이면 AI스러운 인공물을 줄일 수 있다. 예: `natural skin texture, visible pores, fine peach fuzz`(플라스틱 피부 대신), `soft natural micro-contrast with gentle film-like tonal rolloff`(과도한 샤프닝 대신), `balanced low-contrast dynamic range, gentle highlight rolloff`(HDR룩 대신), `clean, brand-free, unbranded finish`(워터마크·로고 대신). 글자가 없는 컷이면 텍스트 관련 절 자체를 프롬프트에 넣지 않는다 — 렌더 텍스트가 있는 컷이면 이 절과 별개로 Tier-1 동결 문장(core-grammar.md §Tier-1)을 쓴다. 톤·질감 계열 어휘는 `photo-prompt-master/05_mood_postprocessing.md`(후보정·프린팅)를 참조.

**6요소 ↔ 8슬롯 대응**: 슬롯 1-4(인물/포즈/의상/헤어메이크업)는 미장센 1요소(배치)와 5요소(의상·소품)를 인물 쪽에서 세분화한 것이고, 슬롯 5-6(조명/색감)은 미장센 2·3요소를 그대로 옮긴 것이며, 슬롯 7(필름·카메라)은 미장센 6요소(구도)를 장비 스펙으로 구체화한 것이고, 슬롯 8(배경)은 미장센 4요소(공간·세트)에 대응한다. 즉 6요소로 "왜"를 정한 다음 8슬롯으로 "어떻게 쓸지"를 채우면 두 프레임워크가 어긋나지 않는다.

---

## 필름스톡 & 그레이딩 활용법

필름스톡명을 프롬프트에 넣으면 해당 필름의 색 재현 특성이 반영된다. "cinematic, 8K, masterpiece" 같은 추상적 품질어보다 실제 스톡명이 훨씬 효과적이다.

- **Kodak Portra 400** — 따뜻한 피부톤, 부드러운 대비. 인물 중심 드라마 스틸의 기본값.
- **Kodak Vision3 500T** — 텅스텐 밸런스, 야간 인공광에 강함. 블랙이 살짝 들리고(lifted blacks) 그림자가 차분한 청회색. 도시 야경·실내 야간 씬에 적합.
- **Fuji Pro 400H** — 시원한 그린 톤, 파스텔에 가까운 채도. 담담한 다큐/일상 톤에 적합.
- **Ilford HP5** — 흑백, 다큐멘터리 질감. 강한 콘트라스트와 그레인으로 시대극·느와르에 적합.
- **Kodak 5219 (500T) + 푸시 프로세싱** — 네온이 많은 사이버펑크·야간 씬에서 그레인을 강조하고 채도를 밀어붙일 때.

그레이딩 조합 예: `Kodak Vision3 500T film stock color rendering with lifted blacks and muted cool shadows` 처럼 스톡명 + 결과 묘사를 함께 쓰면 팔레트가 안정적으로 재현된다.

---

## Worked examples

### 예시 1 — 한국 시골 SF 드라마 스틸

```
16mm film still, Korean independent cinema aesthetic.
A young East Asian woman in her late 20s sits alone on the wooden
porch of an old countryside house, late afternoon. She stares at
her own hands with quiet confusion, seated still, her body held in
complete stillness.
Faded floral cotton dress, bare feet, a subtle mechanical seam
along her wrist joint. Warm golden hour sunlight through persimmon
trees, dust particles suspended in the light beam. 85mm telephoto
compression, shallow depth of field, blurred rice paddies and
distant mountains behind her. Muted earth tone grading, desaturated
greens, warm amber highlights, authentic 16mm grain and halation.
Motivated lighting from natural sun only. Intimate medium close-up.
```
슬롯 매핑: 인물(1) → 포즈·표정(2, 정지된 응시) → 의상(3) → 조명(5, 동기 = 태양광) → 질감/색감(6, 16mm 그레인+earth tone) → 카메라/렌즈(7, 85mm telephoto/shallow DoF) → 배경(8, 감·논밭).

### 예시 2 — 느와르 재즈 클럽 (미장센: 이중성 조명 + 프레임 안의 프레임)

```
35mm black and white film still, 1930s noir aesthetic.
Interior of a smoky jazz club booth. A woman in a silk evening
gown sits still, half her face lit by a single overhead tungsten
bulb, the other half lost in deep shadow — chiaroscuro, split
lighting. She holds an unlit cigarette between her fingers, eyes
fixed off-screen, calculated stillness. A man's silhouette occupies
the foreground bokeh. Smoke hangs static in the cone of light.
lens character: vintage spherical prime — creamy rolloff, mild veiling flare, rounded bokeh, soft halation on highlights.
Diagonal shadow lines across the frame. High-contrast silver
gelatin print aesthetic. Over-the-shoulder framing.
```
미장센 대응: 조명(2번 요소, 스플릿 라이팅) + 구도(6번 요소, 대각선 그림자·오버더숄더). 인물은 정지 상태로 담배를 "물고" 있을 뿐 어떤 동작도 진행 중이지 않다.

### 예시 3 — 인물 없는 다큐멘터리 풍경 스틸

```
16mm documentary film still, Korean rural landscape at dawn.
An empty dirt road stretches between rice paddies, morning mist
rising from the water. A single pair of worn rubber shoes left
abandoned at the road's edge — the only human trace, static, no
one in frame. Mountains emerging from fog layers in the background.
camera: telephoto compression flattening mist and mountain layers.
film stock: Kodak Vision3 500T, lifted blacks, muted cool shadows.
Motivated lighting from an overcast pre-dawn sky only. Contemplative
wide shot, the shoes as focal anchor in the lower third.
aspect ratio: 2.39:1
```
설정과 소품(5번 요소, 버려진 고무신)만으로 서사를 전달하는 사례 — 인물이 없어도 미장센 6요소는 그대로 적용된다.

---

## 실패 모드

**접촉점 오배치** — 두 인물 혹은 인물과 사물이 닿는 장면에서 접촉 지점을 가구/배경에 붙이면 신체 부위가 엉뚱하게 렌더링된다. "leaning over his lap"이라고 써야 할 자리에 "leaning over his bed"라고 쓰면 안 된다. 접촉은 반드시 해부학적 부위로 명시한다("her face close to his lips"이지 "close to him"이 아니다).
  - 오배치: `she rests against the sofa while he sits close`
  - 정배치: `she rests her head against his shoulder while he sits close, her hand resting on his forearm`

**무드어 남발** — "sad, lonely, mysterious, epic, cinematic" 같은 감정 형용사만 쌓으면 AI가 그것을 어떤 시각 정보로 번역할지 결정하지 못한다. 무드는 반드시 조명·색감·프레이밍으로 번역해야 한다("슬프다" → `low-key lighting, desaturated cool tones, character small in frame, wide shot`). 형용사를 겹쳐 쓸수록 오히려 각 단어의 영향력이 희석되는 죽은말(생명력 없는 상투어) 현상이 발생하므로, 판별 규칙은 `core-grammar.md`를 상호 참조한다.

**모션 어휘 혼입** — walking, reaching, turning 같은 동작 동사나 "~하기 시작하는" 같은 전이 묘사가 섞이면 "스틸 = 정지화 원칙"이 깨지고, 영상 파이프라인에서 image_prompt와 video_prompt의 역할이 겹쳐 후속 단계가 어색해진다. 정지된 포즈 동사(standing, seated, leaning)만 사용하고, 동작의 "결과 상태"만 묘사한다(예: "문이 열리는 중"이 아니라 "문이 열려 있다").

---

## Sources

- 시네마틱 이미지 생성 가이드 (미장센 6요소 프레임워크, 한/영 프롬프트 쌍, 체크리스트)
- GPT-Image-2 활용 가이드 (시네마틱 키워드 표, 필름스톡별 완성 프롬프트)
- BLANC 이미지 프롬프트 갤러리 (8슬롯 시네마틱 태그소노미, 카메라/렌즈/HEX 스펙 슬롯 패턴 — 구조만 증류, 원문 미인용)
- Maestro 영상 파이프라인 가이드 (스틸=정지화 원칙, 접촉점 앵커링 규칙)
