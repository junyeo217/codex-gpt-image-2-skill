# 편집 워크플로우 (gpt-image-2)

`/v1/images/edits`로 기존 이미지를 바꿀 때, 즉 인물 교체·스타일 전이·가상 피팅·오브젝트 추가/제거·리라이팅처럼 "레퍼런스가 있고 일부만 바꿔야 하는" 요청에 이 파일을 로드하세요. 순수 생성이라면 이 파일 대신 `core-grammar.md`(공통 법)과 `cinematic-stills.md`(장면 골격)를 먼저 보세요.

기술적으로 `gpt-image-2`의 편집 입력은 PNG/WebP/JPEG 최대 16장(각 50MB 이하)이며, 마스크를 쓸 경우 마스크는 알파 채널이 있는 PNG(4MB 이하)로 첫 번째 입력 이미지와 해상도가 일치해야 합니다. 마스크의 완전 투명 영역이 "편집 가능" 영역입니다. `input_fidelity`는 지정하지 마세요 — gpt-image-2는 모든 입력을 이미 고정밀로 처리합니다. `background: "transparent"`는 지원되지 않으니 투명 배경이 필요하면 불투명 생성 후 별도 배경 제거 공정을 쓰세요. 마스크가 있어도 아래 원칙과 보존 리스트는 반드시 함께 써야 합니다 — 마스크는 픽셀 단위로 완벽하게 경계를 지키지 않습니다.

## 편집 제1원칙: Change only X

기본 문형은 다음과 같습니다.

```text
Change only [X]. Preserve [A], [B], [C]. Keep everything else unchanged.
```

편집 프롬프트에서 가장 흔한 실패는 "무엇을 바꿀지"만 쓰고 "무엇을 유지할지"를 쓰지 않는 것입니다. 모델은 명시되지 않은 모든 것을 자유롭게 재해석할 수 있습니다. 반드시 잠가야 할 불변항(lock-list)은 다음과 같습니다.

- identity (인물 정체성)
- pose (자세)
- body geometry (신체 비례·골격)
- camera angle (카메라 앵글)
- crop (프레이밍/크롭)
- lighting direction (조명 방향)
- shadows (그림자)
- background objects (배경 사물)
- logos (로고·라벨)

### 추상 보존 지시, 단독으로 쓰면 실패한다

일부 편집 모델(Qwen-Image-Edit 계열) 가이드는 "preserve identity", "keep unchanged" 같은 표현을 "확산 모델이 따를 수 없는 추상 지시"라며 금지합니다. 하지만 같은 계열 가이드 내부에도 "preserve the subject's identity", "preserve facial features and expression" 같은 보존 문구 라이브러리가 존재하고, gpt-image-2 공식 가이드와 FLUX.2 편집 규칙은 정반대로 "무언가를 유지하라고 명시적으로 말하는 것이 언급하지 않는 것보다 훨씬 안정적으로 보존된다"고 명시합니다.

이 모순은 다음과 같이 정리하면 풀립니다.

- **실패하는 것**: "preserve everything", "identity 유지해줘" 처럼 뭉뚱그린 지시 **하나만 단독으로** 쓰는 경우. 모델이 "identity"가 구체적으로 무엇을 가리키는지 알 수 없어 무시하거나 대충 따릅니다.
- **성공하는 것**: identity, pose, body geometry, camera angle, crop, lighting direction, shadows, background objects, logos처럼 **불변항을 항목별로 나열**하는 경우. 각 항목 자체는 다소 추상적이어도, 나열된 리스트는 모델에게 "무엇을 확인해야 하는지"에 대한 구체적 체크포인트를 줍니다.
- **더 강해지는 것**: 특히 얼굴·캐릭터 정체성처럼 실패 리스크가 큰 항목은 "identity"라는 단어에서 멈추지 말고 "같은 얼굴형, 같은 눈동자 색, 같은 헤어스타일"처럼 한 단계 더 구체화하세요.

즉 "추상 보존 지시 단독 금지, 불변항 나열과 결합하면 유효"가 이 스킬의 원칙입니다. Change only X 문형 자체가 이미 이 결합을 강제합니다.

## 보존 락리스트 템플릿

편집 요청마다 아래 블록을 복사해서 대괄호만 채우세요.

```text
Change only [target attribute or object]. Preserve exactly:
- identity: same face shape, same eyes, same hairstyle and hair color, same skin tone
- pose and body geometry: same posture, same limb positions, same proportions
- camera angle, crop, and framing
- lighting direction, color temperature, and shadow placement
- every background object outside the edit target
- all visible logos, labels, and existing text
Keep everything else in the image unchanged.
```

상황별로 추가할 항목:

- **인물 편집**: 표정 상태(expression), 피부 질감, 액세서리(안경·귀걸이) 유무
- **제품/오브젝트 편집**: 재질(material), 반사(reflection), 접촉 그림자(contact shadow), 바닥/표면과의 접점
- **텍스트가 있는 장면**: 기존 문구의 폰트·자간·정렬·색상 ("EXACT, verbatim"로 재확인)
- **다중 레퍼런스 사용 시**: 어떤 이미지가 배경/카메라/크롭을 통제하는지 한 문장으로 명시 (`Image 1 controls camera, crop, and background.`)

## 레퍼런스 편집 레시피

### 인물 교체 (person swap / insertion)

```text
Image 1 is the base and controls composition, camera angle, crop, and lighting.
Image 2 is the person reference.
Replace only the person in Image 1 with the person from Image 2, matching
Image 1's exact pose, hand position, and facial expression.
Preserve Image 1's camera angle, crop, background, and lighting direction and
color exactly. Apply Image 2's face shape, eye color, and skin tone.
Keep everything else in Image 1 unchanged.
```

주의: 자세·표정·상처나 붕대 같은 세부 상태는 "Image 1을 따른다"고 명시하지 않으면 새 인물 특유의 표정으로 리셋되기 쉽습니다.

### 스타일 전이 (style transfer)

```text
Preserve everything in Image 1 exactly — subject, pose, composition, and crop.
Apply only the color tone and grading style of Image 2 to Image 1.
Do not change Image 1's identity, geometry, or background objects.
```

주의: "스타일"을 단어 하나(예: cinematic, moody)로 남기면 모델이 임의 해석합니다. 색조/그레인/대비처럼 눈에 보이는 속성으로 구체화하고, 레퍼런스 이미지 순서(무엇이 "첫 번째"인지)를 프롬프트 문장과 반드시 일치시키세요.

### 가상 피팅 (virtual try-on)

```text
Image 1 is the person. Image 2 is the garment reference.
Replace only the person's current outfit with the garment from Image 2,
matching the person's exact pose, body proportions, and body geometry.
Preserve the person's identity, face, hair, skin tone, camera angle, crop,
lighting direction, and background exactly. Fit the garment naturally to
the body with realistic drape, contact shadow, and fabric fold.
```

주의: 몸통이 회전되거나 가려진 자세일수록 드레이프가 깨지기 쉬우니, 정면에 가까운 레퍼런스 자세를 쓰거나 "fit follows the body silhouette of Image 1"을 추가하세요.

### 오브젝트 추가 / 제거 (object add / remove)

```text
Add [object] at [precise location], matching the scene's existing lighting
direction, perspective, and scale. Include a contact shadow where [object]
meets [specific surface]. Preserve every other object, the camera angle,
crop, and background exactly. Do not alter unrelated areas.
```

```text
Remove [object] from [precise location]. Fill the area using the
surrounding background texture and lighting so no gap or seam remains.
Preserve every other object, the camera angle, crop, and background exactly.
```

주의: 추가할 오브젝트는 접촉면(바닥·테이블·손)까지 지정해야 그림자와 크기가 맞습니다. 제거는 "무엇으로 채울지"를 말하지 않으면 원치 않는 새 오브젝트가 그 자리에 생길 수 있습니다.

### 리라이팅 (relight)

```text
Change only the lighting: light source is [window light / neon / golden
hour sun], direction is [camera-left / backlit / overhead], color
temperature is [warm amber / cool blue]. Recompute shadow direction and
contact shadows to match. Preserve identity, pose, body geometry, camera
angle, crop, background objects, and all colors of the subject's clothing
and skin unchanged except for the new light's color cast.
```

주의: 조명만 바꾸는 지시는 그림자·반사까지 같이 재계산하라고 명시하지 않으면 새 광원 방향과 기존 그림자가 물리적으로 어긋난 결과가 나옵니다.

## 실패 메커니즘

### 1) 의상 드리프트 — 색으로만 지칭해야 하는 이유

여러 인물을 구분할 때 "옷 종류 + 색"으로 지칭하면, 모델이 그 옷 자체를 새로 생성하려 들어 레퍼런스가 실제로 입고 있는 옷과 다른 옷으로 바뀝니다.

- BAD: `the man in the blue shirt and the woman in the green sweater`
- GOOD: `the man in blue and the woman in green`

옷이 실제로 바뀌는 장면에서만 옷 종류를 명시하세요 (`now wearing a new red dress she just changed into`).

### 2) 접촉점 오배치 — 신체 부위로 앵커링

인물이 서로 또는 사물에 가까이 갈 때 가구나 막연한 영역을 기준점으로 쓰면, 접촉 위치가 엉뚱한 신체 부위로 그려집니다. 반드시 구체적 신체 부위를 지정하세요.

- BAD: `leaning over his bed` → GOOD: `leaning over his lap`
- BAD: `reaching toward the table` → GOOD: `reaching toward the cup on the table`
- BAD: `her face close to him` → GOOD: `her face close to his lips`

### 3) 메타 지시 무력 — 단독 추상 지시는 무시된다

"preserve identity", "keep it natural" 같은 지시를 다른 구체적 정보 없이 한 문장으로만 던지면 모델이 실질적으로 무시합니다.

- BAD: `Change her hair to blonde. Preserve identity.`
- GOOD: `Change her hair to platinum blonde with subtle warm undertones, keeping the same face shape, eye color, expression, lighting direction, pose, and background unchanged.`

핵심은 "preserve"라는 단어의 유무가 아니라, 그 뒤에 무엇을 지켜야 하는지 나열되어 있는가입니다.

### 4) 재언급 유발 변형 — 불변 요소를 이름으로 다시 부르지 않기

편집 대상이 아닌 요소를 "보존하라"는 의도로 다시 묘사하면, 오히려 그 명사가 재생성 트리거가 되어 원본과 미묘하게 다른 버전으로 다시 그려질 수 있습니다. 확산 기반 편집 모델은 프롬프트에 등장하는 명사를 "이 위치에 이걸 그려라"는 신호로 받아들이는 경향이 있기 때문입니다.

- BAD: `Keep the vintage brass lamp on the desk unchanged.` (램프를 다시 묘사 → 다른 램프로 재생성될 위험)
- GOOD: `Do not alter anything outside the masked area.` 또는 위치만으로 지칭: `leave the desk objects outside the edit region untouched`

편집 대상이 아닌 사물은 이름을 다시 부르기보다, 영역(마스크·위치)으로 통째로 보호하는 편이 안전합니다. 반드시 이름으로 불러야 한다면 마스크나 "outside the edit target" 같은 영역 한정어와 함께 쓰세요.

## 편집 검수 체크리스트

생성된 결과를 원본과 나란히 놓고 대조하세요.

- [ ] 요청한 변경(X)이 정확히 반영되었는가
- [ ] identity — 얼굴형·눈동자·헤어스타일·피부톤이 원본과 동일한가
- [ ] pose / body geometry — 자세와 신체 비례가 그대로인가
- [ ] camera angle / crop — 앵글과 프레이밍이 바뀌지 않았는가
- [ ] lighting direction / shadows — 광원 방향과 그림자가 일치하는가 (리라이팅 편집 제외)
- [ ] background objects — 편집 영역 밖 사물이 그대로인가
- [ ] logos / label copy — 로고·문구가 왜곡 없이 유지되는가
- [ ] 마스크를 썼다면, 마스크 경계 밖에 변화가 없는가 (diff 이미지로 확인)
- [ ] 새로 추가한 오브젝트에 올바른 그림자·스케일·원근이 적용되었는가
- [ ] 드리프트가 보이면 실패한 결과물이 아니라 마지막으로 승인된 원본에서 다시 편집했는가

네거티브 프롬프트 일반론과 품질(Tier) 선택 전략은 이 문서가 아니라 `core-grammar.md`를 참고하세요.

## Sources

- OpenAI GPT Image 공식 스킬 문서의 편집 파라미터·마스크 규칙·"Make edits surgical" 절
- GPT-Image-2 활용 가이드의 "Change X, Preserve Everything Else" 원칙과 유지 목록 체크리스트
- 시네마틱 이미지 생성 가이드의 인물 교체·구도 차용 템플릿
- Qwen Image Edit 프롬프팅 가이드의 편집 분류법과 보존 언어 라이브러리
- FLUX 이미지 편집 2차 패스 가이드의 의상 드리프트 방지·색상 전용 구분·접촉점 앵커링 규칙
- 이미지 편집용 프롬프트 강화 가이드 모음(Qwen/FLUX용)의 신체 부위 앵커링·정지 프레임 서술 규칙
