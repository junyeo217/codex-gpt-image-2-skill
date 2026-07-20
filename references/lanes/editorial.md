# 레인: 에디토리얼 (Editorial)

**로드 조건**: 패션/뷰티 화보, 매거진 에디토리얼, 룩북, 무드보드형 인물·제품 컷을 요청할 때 이 레인을 로드한다. 코어 문법 대신 에디토리얼 컷타입 카탈로그, 스타일 택소노미, 무드 프리셋만 다룬다.

## 코어 조합 순서

| 순서 | 코어 레퍼런스 | 이 레인에서의 역할 |
|---|---|---|
| 1 | `../character-consistency.md` | 룩북/챕터 시퀀스라면 모델 얼굴·헤어·의상 앵커를 먼저 고정한다. |
| 2 | `../cinematic-stills.md` | 카메라/렌즈/조명/컬러그레이딩 어휘를 가져온다. |
| 3 | `../multi-shot.md` | 여러 룩·챕터에 걸친 일관성(동일 인물, 동일 렌즈 캐릭터)을 고정한다. |
| 4 | `../core-grammar.md` | 위 결과를 8슬롯 시네마틱 구조로 조립한다. |
| 5 | `../text-in-image.md` | 매거진 타이틀/캡션/라벨 텍스트가 필요할 때만 마지막에 적용. |

## 도메인 디폴트

- **기본 비율**: 3:4 또는 4:5(단독 인물 화보), 1:1(플랫레이/스와치/제품 도감), 9:16(세로 룩북).
- **기본 무드**: 톤 다운된 뉴트럴 필름룩, 얕은 심도, 자연 확산광(흐린 날 창광) 또는 대형 소프트박스 확산광. 인물 근접 톤은 하드 섀도를 피한다.
- **기본 구도 관행**: 인물 단독컷은 waist-up 미디엄, 85mm급 인물 원근감, eye-level. 컷타입(레비테이션/고스트 마네킹/플랫레이 등)을 먼저 정한 뒤 그 컷타입의 관행을 따른다.

## 도메인 어휘/패턴

### 컷타입 카탈로그 (패션·뷰티 계열)

| 컷타입 | 성격 | 핵심 문장 요소 |
|---|---|---|
| levitation_catalog | 보이지 않는 인체가 입은 듯 의상이 착용 위치에 공중 부양 | "몸은 안 보이고 옷의 곡선·빈 공간으로 실루엣이 떠오른다", 바람에 밑단이 살짝 부품 |
| ghost_mannequin | 단품이 보이지 않는 마네킹에 입혀진 듯 입체적으로 떠 있음 | 칼라·소매가 형태 유지, 내부는 비어 목선 안쪽만 살짝 |
| flatlay_spec | 톱다운 90도 부감으로 한 벌 구성을 그리드로 배치 | 균일 정렬, 얕고 일관된 그림자로 입체감 |
| lookbook_model | 실존/가상 모델이 자연스러운 자세로 룩을 착용 | 캐주얼하지만 절제된 우아함, 배경 흐림 |
| runway_motion | 걷는 순간 직물이 부풀어 조형적 실루엣을 만드는 동세 컷 | low-angle, 강한 키라이트, 배경 어둡게 |
| texture_swatch | 제형/소재 스와치 매크로 비교 | 리더선 + 라벨, 질감 대비를 또렷이 |
| water_droplet / splash_flow | 제품 표면 결로나 액체 스플래시 다이내믹 | 백라이트/림라이트로 투명 굴절 강조 |

컷타입은 요청당 1개로 고정하고, 시퀀스라면 챕터마다 다른 컷타입을 배정해 리듬을 만든다.

### 21스타일 패션 택소노미 (컴팩트 표)

| ID | 스타일 | ID | 스타일 |
|---|---|---|---|
| STY-01 | minimal_clean | STY-12 | parisian_chic |
| STY-02 | old_money | STY-13 | athleisure_sporty |
| STY-03 | y2k_revival | STY-14 | workwear_utility |
| STY-04 | streetwear | STY-15 | boudoir_editorial |
| STY-05 | avant_garde | STY-16 | bridal_modern |
| STY-06 | vintage_film_90s | STY-17 | resort_beach |
| STY-07 | cyberpunk_neon | STY-18 | corporate_power |
| STY-08 | cottagecore | STY-19 | couture_runway |
| STY-09 | dark_academia | STY-20 | film_noir |
| STY-10 | kpop_idol | STY-21 | kpop_editorial_minimal |
| STY-11 | japanese_mode | | |

요청당 스타일 1개만 선택한다(혼합하면 무드보드가 산만해진다). 인물 노출도가 높은 스타일(예: STY-15, STY-17)은 이 레인의 기본 톤이 아니며 별도의 명시적 안전 검토가 필요하므로, 특별한 요청이 없는 한 STY-01~14, 18~21 범위에서 고른다.

### 룩 프리셋 드롭인 (에디토리얼 계열 5종)

| 프리셋 | 한 줄 | 드롭인 |
|---|---|---|
| 럭셔리 에디토리얼 | 과감한 여백 + 얇은 세리프 + 뮤트 팔레트 | `generous negative space dominating the frame, subject occupying under one third, elegant thin serif type, soft directional daylight with long gentle shadows, muted ivory and taupe palette, matte uncoated paper grain` |
| 미니멀 프로덕트 | 흰 무대 위 제품 히어로, 그림자 하나로 존재감 | `product hero on a seamless white stage, perfectly clean single-subject composition, soft top-light with one crisp contact shadow anchoring the object, true-to-material color, polished surface reflections kept subtle` |
| 스위스 타이포 | 그리드 정직한 타이포 포스터, 글자가 주인공 | `strict modernist grid layout, oversized grotesque sans-serif type as the dominant visual element, flat off-white field, black ink, one signal accent color, flat matte print finish, disciplined alignment` |
| 코리안 레트로 인쇄 | 70~90년대 한국 인쇄물, 오프셋 망점 | `vintage Korean offset-print poster, visible halftone dots and slight ink misregistration, aged cream paper, warm spot-ink accents, bold brush-stroke headline, worn paper texture at the edges` |
| 소프트 파스텔 | 따뜻한 파스텔 카드 틴트 + 라운드 도형 | `warm white canvas, rounded card shapes tinted in soft pastel hues, flat friendly illustration style with simple geometric elements, even soft lighting, paper-smooth matte finish` |

프리셋 혼합 금지, 변형은 hex 교체까지만.

### 가상 모델 디스클레이머

실존 인물처럼 보이는 모델이 등장하면 Scene 슬롯에 `(공인 인물이 아닌 가상의 모델)` 또는 `a fictional model, not a real public figure`를 명시한다. 룩북 시퀀스는 모든 컷에서 동일 문구·동일 앵커 문장을 재사용한다.

## 미니 체크리스트

- [ ] 컷타입(레비테이션/고스트마네킹/플랫레이/룩북 등)을 하나로 정했는가
- [ ] 스타일 택소노미에서 스타일 1개만 선택했는가
- [ ] 모델이 등장하면 가상 인물 디스클레이머를 넣었는가
- [ ] 시퀀스(챕터/룩북)라면 얼굴·헤어·의상 앵커가 컷마다 동일한가
- [ ] 팔레트/컬러그레이딩 hex가 명시됐는가
- [ ] 텍스트(라벨/캡션/타이틀)가 있으면 한 번씩만 또렷하게 렌더하도록 지시했는가
- [ ] 룩 프리셋을 1개만 쓰고 다른 프리셋과 섞지 않았는가

## Sources

로컬 커머셜 프롬프트 라이브러리의 패션·뷰티 계열(컷타입, Scene/Camera/Lighting/Color grading/Texture 슬롯 관행), 패션 에디토리얼 스타일 택소노미(21스타일 카탈로그), 룩 프리셋 컬렉션(무드 드롭인 블록), 큐레이션된 이미지 프롬프트·설정 갤러리(예시 어휘만 발췌) — 일반 명칭만 표기, 로컬 경로는 이 파일에 포함하지 않는다.
