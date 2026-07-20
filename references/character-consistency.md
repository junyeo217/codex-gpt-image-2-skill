# 캐릭터 일관성 (Character Consistency)

gpt-image-2로 같은 인물이 여러 장의 이미지에 걸쳐 등장해야 할 때(드라마 스틸컷, 뮤직비디오 아티스트 샷, 광고 모델 시리즈, 스토리보드, 웹툰 패널 등) 참조한다. 단일 이미지 생성이거나 인물이 프레임마다 바뀌어도 무방한 경우에는 로드할 필요가 없다.

## 아이덴티티 락 문법

"같은 사람을 유지해줘", "preserve identity", "same character" 같은 추상적 지시는 모델 입장에서 무엇을 고정해야 하는지 알려주지 못합니다. 이런 표현은 장면이 바뀌는 순간 얼굴이 미묘하게 다른 사람으로 수렴하는 드리프트(drift)를 유발합니다. 대신 **얼굴을 구성하는 구체적 파라미터를 나열**해야 합니다.

반드시 명세할 불변항(invariants):

- **얼굴 골격 / 턱선(bone structure / jawline)** — 각진 정도, 턱 끝 모양
- **눈 모양과 눈 사이 간격(eye shape and inter-eye spacing)** — 눈매, 쌍꺼풀 유무, 미간 거리
- **코 높이와 형태(nose bridge height and shape)**
- **입술 형태와 표정 시 비율(mouth shape and expression proportion)** — 웃을 때 입꼬리가 올라가는 정도까지 포함
- **헤어 색상·질감·스타일(hair color, texture, style)** — 염색 색상 코드 수준까지 구체화
- **피부톤과 피부결(skin tone and skin texture)** — 모공, 잡티, 홍조 등 "실제 피부" 디테일
- **체형과 신체 비율(body type and proportions)** — 키, 어깨너비, 체형
- **식별 가능한 특징(distinctive marks)** — 점, 흉터, 문신, 안경 등 캐릭터를 특정 짓는 요소

### 미화 금지 조항 (No-Beautify Clause)

레퍼런스 인물 사진 기반 생성에서 가장 흔한 실패는 모델이 얼굴을 "더 예쁜 일반형"으로 슬쩍 바꿔버리는 것입니다. 이를 막으려면 금지 조항을 명시적으로 넣습니다.

```
Do not replace the face with a generalized, beautified, or idealized face.
Keep the exact bone structure, jawline, eye shape and spacing, and skin
texture from the reference. The character must be instantly recognizable
as the same person even when the scene, distance, or camera angle changes.
Preserve natural skin texture — visible pores, subtle blemishes, and
realistic color — instead of smoothing or airbrushing.
```

한국어로 지시할 때도 동일한 구조를 씁니다: "얼굴 골격, 턱선, 눈 모양과 간격을 모든 장면에서 동일하게 유지한다. 얼굴을 미화된 일반형 얼굴로 교체하지 말고, 장면과 카메라 거리가 달라져도 한 사람으로 즉시 인식되어야 한다."

## 캐릭터 시트 워크플로우

### 1) 3면도 캐릭터 시트 생성

작업의 기준점이 될 중립 캐릭터 시트를 가장 먼저 만듭니다. 배경을 순백색으로 고정해 인물 외형에만 판단이 집중되게 합니다.

```
Standard character design sheet, three-view (front, side, back) of
[character description], pure white background. Close-up bust shot on
the left, full-body three-view on the right: front, side, and back.
Photorealistic style. Strictly maintain character consistency across all
views. Clothing and proportions remain identical in every view. No props,
no background elements, no weapons unless specified.
```

### 2) 중립 시트 승인

이 3면도가 이후 모든 샷의 "정답지"가 됩니다. 바로 다음 단계로 넘어가지 말고, 이 시트가 원하는 얼굴/체형/의상을 정확히 담고 있는지 사람이 먼저 확인하고 승인합니다. 승인 전에 여러 번 재생성해서 고르는 편이, 승인 후 수십 장을 만들고 나서 얼굴이 틀렸다는 걸 발견하는 것보다 훨씬 저렴합니다.

### 3) 히어로 레퍼런스 전략 (Hero Reference)

승인된 시트, 또는 실제 사용할 장면 중 가장 대표성이 높은 한 장을 **최고 품질(quality: high)** 로 다시 생성해 "히어로 이미지"로 삼습니다. 이후 모든 샷은 이 히어로 이미지를 input reference로 재사용합니다.

```
Frame 0 (Hero): 최고 품질로 1장 생성 → hero.png
Frame 1: hero.png를 레퍼런스로 "Same character, medium shot, turns toward window..."
Frame 2: hero.png를 레퍼런스로 "Same character, close-up, hand reaches for the cup..."
```

매 샷을 처음부터 새로 생성하는 대신 히어로 한 장을 앵커로 계속 재사용하면 드리프트가 크게 줄어듭니다.

### 4) 번호 참조법 (Reference by Number)

레퍼런스 이미지를 여러 장 동시에 첨부할 때는 "이 사람", "그 배경" 같은 지시어 대신 이미지 번호로 역할을 명확히 나눕니다.

```
The character from image 1 in the environment from image 2, matching the
lighting and camera angle of image 2 but keeping the face, hairstyle, and
outfit exactly as shown in image 1.
```

레퍼런스가 3장 이상이면 "image 1 = 캐릭터 시트(얼굴/의상 기준), image 2 = 장소 시트(환경/조명 기준), image 3 = 색보정 기준"처럼 **한 이미지가 한 가지 책임만** 지도록 역할을 분리합니다. 두 이미지에 같은 속성(예: 둘 다 얼굴)을 동시에 맡기면 모델이 혼선을 일으킵니다.

## Thinking 모드 일관 생성 — 최대 8장 연속 스틸

gpt-image-2의 Thinking 모드는 "이 장면을 N장의 연속 스틸컷으로 생성해달라"는 요청을 이해하고, **개별 이미지 여러 장(최대 약 8장)을 각각 독립 파일로, 동일 인물·동일 환경을 유지한 채** 생성할 수 있습니다. 그리드 한 장을 자르는 방식과 달리 각 이미지가 원본 해상도를 그대로 유지하므로, 후속 영상화(I2V) 파이프라인에 바로 투입하기에 유리합니다.

요청 템플릿(공유 아이덴티티/환경 전문 + 샷별 지시):

```
이 장면을 [N]장의 연속 시네마틱 스틸컷으로 생성해주세요.
모든 이미지에서 동일 인물([나이대/성별/인종/헤어/체형 요약])과
동일 환경([장소/시간대/조명 요약])을 유지해주세요.

Shot 1: [샷 사이즈]. [행동/구도]. [렌즈/톤].
Shot 2: [샷 사이즈]. [행동/구도]. [렌즈/톤].
...
공통: [필름 스톡/그레인/애스펙트비 등 전체 통일 항목]
```

영어 버전:

```
Generate this scene as [N] consecutive cinematic still frames.
Maintain the same character (same face, hair, build, wardrobe) and the
same environment (same location, time of day, lighting direction) across
every image.

Shot 1: [shot size]. [action/composition]. [lens/tone].
Shot 2: [shot size]. [action/composition]. [lens/tone].
...
Shared: [film stock / grain / aspect ratio / color grade applied to all]
```

핵심은 "공유 아이덴티티 전문"과 "공유 환경 전문"을 매 샷 설명 앞에 한 번만 선언하고, 샷별 지시는 변하는 것(포즈, 앵글, 감정)만 나열하는 것입니다. 매 샷마다 얼굴 묘사를 반복하면 프롬프트가 길어질 뿐 아니라 미세한 표현 차이가 오히려 드리프트를 유발할 수 있습니다.

## 변수 통제 — 한 번에 하나만 바꾼다

여러 장을 이어 생성할 때 가장 안정적인 방식은 **씬 변수를 한 번에 하나씩만** 바꾸는 것입니다. 인물의 포즈, 카메라 앵글, 조명, 의상, 배경을 동시에 다 바꾸면 어느 변화가 얼굴 드리프트를 유발했는지 추적할 수 없고, 실패율도 누적됩니다.

권장 순서:

1. 중립 아이덴티티 시트를 먼저 승인한다.
2. 승인된 시트를 첫 번째 레퍼런스로 고정 재사용한다.
3. 매 요청마다 아이덴티티 불변항 문구를 반복한다.
4. 씬 변수(포즈 → 앵글 → 조명 → 의상 순으로) 하나씩만 바꿔가며 생성한다.
5. 시드를 고정할 수 있는 환경이라면 동일 시드를 보조 수단으로 사용한다(단, 프롬프트가 크게 바뀌면 시드 고정만으로는 취약하다).

## BAD / GOOD 예시

**BAD:**
```
Keep the same character in all images.
```
→ 무엇을 고정할지 모델이 판단해야 하므로 장면마다 인물이 조금씩 다른 사람이 됩니다.

**GOOD:**
```
Maintain identical facial bone structure, jawline, eye shape and spacing,
nose bridge height, hair color and style, and skin tone across all
frames. Do not beautify or genericize the face.
```

---

**BAD:**
```
Same person, but now she's smiling and standing in a cafe with different
lighting and a new outfit and a different camera angle.
```
→ 다섯 가지 변수를 동시에 바꿔서, 실패했을 때 원인 분리가 불가능합니다.

**GOOD:**
```
Same character, same outfit, same lighting direction. Only change: she is
now smiling instead of neutral expression. Camera and location unchanged.
```
(이후 별도 요청으로 배경, 그다음 요청으로 앵글을 순차적으로 바꿉니다.)

---

**BAD:**
```
사진 속 사람으로 예쁘게 만들어줘.
```
→ "예쁘게"라는 지시가 미화(beautify)를 유발해 원본 정체성을 훼손합니다.

**GOOD:**
```
사진 속 인물의 얼굴 골격, 턱선, 눈 모양과 간격, 피부결을 정확히 유지하고
미화하지 않는다. 조명과 구도만 시네마틱하게 재구성한다.
```

## 실패 모드 — 드리프트 감지 시 대응

멀티 샷 세트를 생성하다 보면 특정 장에서 얼굴이 "다른 사람"처럼 보이는 드리프트가 발생합니다. 대응 순서:

1. **재발생 지점 격리** — 드리프트가 시작된 샷의 프롬프트에서 무엇이 새로 바뀌었는지 확인한다(변수 통제 원칙 위반 여부).
2. **히어로 레퍼런스로 재앵커링** — 드리프트된 샷을 처음부터 다시 만들지 말고, 히어로 이미지를 레퍼런스로 다시 첨부해 해당 샷만 재생성한다.
3. **불변항 문구 재삽입** — 프롬프트가 길어지며 아이덴티티 불변항 문구가 뒤로 밀렸다면, 문구를 프롬프트 앞부분으로 옮긴다. gpt-image-2는 긴 프롬프트도 끝까지 보존하는 편이지만, 핵심 지시는 앞쪽에 배치하는 것이 안전합니다.
4. **커스터마이즈 대신 전량 재생성 판단** — 여러 샷이 동시에 드리프트했다면 개별 수정보다 시퀀스 전체를 히어로 레퍼런스 기준으로 재생성하는 편이 빠릅니다.
5. **선별 후 재조합** — 여러 장을 한 번에 뽑는 시도(그리드/스택 방식)에서는 일부 패널만 성공해도 그 패널을 남겨두고 실패한 패널만 개별로 재생성해 조합합니다.

## Sources

- GPT-Image-2 활용 가이드 (멀티패널·연속 스틸·Thinking 모드 일관성 섹션)
- 시네마틱 이미지 생성 가이드 (인물 교체·구도 유지 템플릿, 스토리보드 디렉터 연속성 체크)
- OpenMontage 이미지 생성 사용법 (Hero Reference Image, 번호 참조법)
- Alibaba 이미지 모델 스킬 가이드 (중립 아이덴티티 시트 승인 → 변수 순차 변경 워크플로우)
- AI 이미지 프롬프트 스킬 레퍼런스 — comic-storyboard 컬렉션 (3면도 캐릭터 시트 패턴)
- 만화/일러스트 프롬프트 원문 모음 (얼굴 정체성 고정 문구 패턴)
