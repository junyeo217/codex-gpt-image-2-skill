# 레인: 뮤직비디오 (Music Video)

**로드 조건**: 뮤직비디오 컷, 퍼포먼스 스틸, 앨범 커버/무드보드, 리듬감 있는 몽타주형 이미지 시리즈를 요청할 때 이 레인을 로드한다. 코어 문법을 재설명하지 않고 필름/렌즈 무드 어휘와 몽타주 시퀀스 디폴트만 얹는다.

## 코어 조합 순서

| 순서 | 코어 레퍼런스 | 이 레인에서의 역할 |
|---|---|---|
| 1 | `../cinematic-stills.md` | 필름 스틸 기본 문법(카메라/렌즈/조명/그레이딩)을 베이스로 가져온다. |
| 2 | `../multi-shot.md` | 몽타주 컷 사이의 룩·렌즈·그레이딩 일관성을 고정한다. |
| 3 | `../character-consistency.md` | 아티스트/퍼포머가 여러 컷에 등장하면 얼굴·의상 앵커를 고정한다. |
| 4 | `../core-grammar.md` | 위 결과를 8슬롯 시네마틱 구조로 조립한다. |
| 5 | `../text-in-image.md` | 타이틀 카드, 로고, 트랙명 텍스트가 필요할 때만 마지막에 적용. |

## 도메인 디폴트

- **기본 비율**: 9:16(숏폼 세로 컷/릴스), 21:9 또는 2.39:1(시네마틱 와이드 무드컷), 1:1(앨범 커버/썸네일).
- **기본 무드**: 필름 그레인 + 하이 콘트라스트 컬러 그레이드가 기본값. 아나모픽 플레어나 빈티지 렌즈 룩은 컷 전체에 하나만 통일해서 적용(중간에 렌즈 계열을 바꾸지 않는다).
- **기본 구도 관행**: 퍼포먼스 히어로 컷은 low-angle로 인물을 압도적으로, 무드컷은 텍스처·디테일 클로즈업으로, 로케이션 컷은 와이드로 분위기부터 설정한다.

## 도메인 어휘/패턴

### 필름/렌즈 무드 어휘 (아나모픽·빈티지 계열)

프리미엄 뮤직비디오 스틸에서 반복 관찰되는 렌즈·필름 어휘. 실재 카메라를 흉내 내는 것이 아니라 결과 톤을 지시하는 언어로 사용한다.

- `anamorphic-style oval bokeh, horizontal lens flare streaks catching the highlights`
- `soft halation bleeding around bright highlights`
- `subtle chromatic aberration at the frame edges`
- `vintage single-coated 40mm/50mm prime lens character, gentle field curvature`
- `fine 35mm film grain with a warm, organic texture`
- `modern digital-cinema sensor look, shallow depth of field, smooth spherical bokeh falling back to a soft anamorphic character in post`

한 컷에는 렌즈 계열 하나(아나모픽 또는 빈티지 단렌즈 중 하나)만 쓰고, 필름 그레인·플레어·비네팅은 결과로 환원된 문장으로 서술한다(장비 브랜드명 나열 대신 "Arri Alexa급 디지털 시네마 센서 감성" 같은 급 표현 정도만 허용).

### 룩 프리셋 드롭인 (뮤직비디오 계열 4종)

| 프리셋 | 한 줄 | 드롭인 |
|---|---|---|
| 시네마틱 그레이드 | 필름 스틸 한 장, 얕은 심도 + 헤이즈 | `single frame from a film, shallow DoF with background falling off softly, warm key against cool shadow pools, faint drifting haze catching the light, fine photographic grain, subtle anamorphic-style horizontal flare` |
| 다크 테크 | 순흑에 가까운 캔버스 + 단일 액센트 글로우 | `near-black canvas, hairline highlights instead of shadows, one restrained accent-color glow, dim secondary elements, crisp surfaces floating with subtle depth, dark technical premium mood` |
| 골드 포일 프리미엄 | 딥 컬러 필드 + 금빛 라이트 모티프 | `deep-color field, warm metallic gold highlights catching a soft raking light, ceremonial premium finish, letterpress-like surface texture` |
| 홍대 인디 | 35mm 플래시 스냅 + 리소 2도 그레인 + 라이트리크 | `raw indie mood — direct on-camera flash with deep near-black falloff, 35mm film grain and halation, a soft light leak bleeding from one corner, duotone accent colors over aged cream, gritty analog finish that still reads as composed` |

프리셋은 혼합하지 않는다 — 팔레트/질감이 충돌하면 무드가 죽는다. hex 값이 필요하면 브랜드/트랙 팔레트로 교체.

### 몽타주 시퀀스 템플릿

1. 오프닝 와이드(로케이션, 분위기 설정)
2. 퍼포먼스 히어로(low-angle, 인물 중심)
3. 클로즈업 무드컷(텍스처·표정·디테일)
4. 브레이크 인서트(질감/소품/추상 디테일 1컷)
5. 아웃트로(오프닝과 대비되는 톤 또는 동일 로케이션의 변주)

### 리듬감을 만드는 샷사이즈 대비

한 트랙의 무드보드를 컷 나열이 아니라 몽타주로 읽히게 하려면 인접한 두 컷의 샷사이즈를 의도적으로 대비시킨다: 와이드 다음에는 클로즈업, 정적인 컷 다음에는 모션 블러가 섞인 컷. 동일한 샷사이즈가 3컷 이상 연속되지 않게 배치를 점검한다.

### 앨범 커버·썸네일 전용 노트

1:1 커버아트는 시퀀스가 아니라 단일 히어로 컷이므로 텍스트(아티스트명/트랙명)가 들어갈 경우 `text-in-image.md` 규칙을 따르되, 커버 전체를 지배하는 하나의 룩 프리셋만 적용한다. 세로 숏폼(9:16) 썸네일은 인물이 프레임 하단 2/3, 상단은 타이틀 텍스트 여백으로 비워두는 구도가 안전 기본값이다.

## 미니 체크리스트

- [ ] 아티스트/퍼포머가 여러 컷에 등장하면 얼굴·의상 앵커가 동일한가
- [ ] 렌즈/필름 계열을 컷 전체에서 하나로 통일했는가(아나모픽과 빈티지 단렌즈를 섞지 않았는가)
- [ ] 룩 프리셋을 1개만 선택했는가
- [ ] 퍼포먼스 컷과 무드컷 사이에 샷사이즈 대비가 있는가
- [ ] 시퀀스 순서(오프닝→히어로→무드→브레이크→아웃트로)를 따랐는가
- [ ] 타이틀/트랙명 텍스트가 있다면 `text-in-image.md` 규칙(따옴표 고정, 한 번만 렌더)을 따랐는가
- [ ] 출력 비율이 배포 채널(세로 숏폼 vs 와이드 시네마틱)에 맞는가
- [ ] 인접한 두 컷의 샷사이즈가 대비를 이루는가(동일 샷사이즈 3연속 없음)

## 다른 레인과의 결합

내러티브가 있는 뮤직비디오(스토리텔링형)는 `drama.md`의 감정 리액션 컷 앵글 표를 퍼포먼스 컷 사이에 끼워 넣을 수 있다. 브랜드 협업 앨범 아트/굿즈 목업이 필요하면 `commercial.md`의 카피 여백·팔레트 하드 락 관행을 커버아트 슬롯에만 적용하고, 렌즈/필름 무드는 이 레인 기준을 유지한다.

## Sources

로컬 프롬프트 라이브러리의 패션/뷰티 캠페인 계열(카메라·조명·그레이딩 슬롯 관행), 룩 프리셋 컬렉션(무드 드롭인 블록), 큐레이션된 이미지 프롬프트·설정 갤러리(아나모픽·빈티지 렌즈 어휘만 발췌, 원문 프롬프트는 인용하지 않음) — 일반 명칭만 표기, 로컬 경로는 이 파일에 포함하지 않는다.
