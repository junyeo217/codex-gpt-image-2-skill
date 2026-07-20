---
name: gpt-image-2
description: Use when the user wants GPT Image 2 / GPT-Image-2.0 prompt design for any image deliverable — drama stills, music-video frames and album art, commercial/product/campaign ads, editorial fashion/beauty shoots, posters, thumbnails, book covers, character sheets and multi-shot storyboards, reference-image or reverse-prompting workflows, image edits (person swap, style transfer, virtual try-on, relight, object add/remove), text-in-image/typography/headline rendering, and Korean-copy visuals. Also use for gpt-image-2 model selection, API/Codex routes, pricing, and size/quality parameter questions.
---

# GPT Image 2

`gpt-image-2` 이미지 프롬프트를 설계하는 범용 스킬이다. 드라마 스틸, 뮤직비디오 키아트, 광고/제품/캠페인, 패션·뷰티 화보, 포스터·썸네일·타이포, 캐릭터 시트, 연속컷/스토리보드, 이미지 편집, API 구현까지 하나의 라우팅 표로 진입한다.

이미 완성된 프롬프트를 그대로 실행만 하면 되는 요청이거나 이미지 생성과 무관한 순수 텍스트 작업이면 이 스킬을 로드할 필요가 없다 — Codex의 imagegen 도구를 바로 호출한다.

## 사용 순서

Progressive disclosure가 원칙이다 — **레퍼런스 8개를 다 읽지 마라. 요청당 1-2개만 로드한다.**

1. 아래 라우팅 표에서 요청 신호와 매칭되는 행을 1개 찾는다.
2. `references/core-grammar.md`는 항상 적용한다 — 이건 라우팅 대상이 아니라 모든 프롬프트의 공통 법이며 스킵할 수 없다.
3. 라우팅 표가 가리키는 파일을 1-2개만 로드한다(주 레퍼런스 1개 + 필요 시 레인 또는 포인터 1개).
4. core-grammar의 철칙과 로드한 레퍼런스의 도메인 어휘를 결합해 프롬프트를 작성한다.
5. 제출 전 `core-grammar.md`의 자가점검 9항을 통과시킨다(아래 요약 참조).
6. `tools/check_prompt.mjs`가 존재하면 `node tools/check_prompt.mjs <file>`로 기계 검증한다.

예: "숏폼 드라마 리액션 컷 4장 스토리보드 만들어줘"는 `lanes/drama.md` + `multi-shot.md` 딱 2개만 로드한다. `drama.md`가 내부에서 character-consistency/cinematic-stills 조합 순서를 이미 지정하므로, 그 파일들을 별도로 다시 로드하지 않는다. 요청이 레인 하나(예: 드라마)와 기능 파일 하나(예: 텍스트 렌더)에 동시에 걸리면 그 둘만 로드한다 — 세 번째 파일은 실제로 필요할 때만 추가한다.

## 라우팅 표

| 요청 신호 (한/영 키워드) | 로드할 파일 |
|---|---|
| 캐릭터 일관성, 캐릭터 시트, 동일 인물 반복 유지, character sheet, same character, identity lock | `references/character-consistency.md` |
| 시네마틱 스틸, 영화 같은 컷, 필름룩, cinematic still, film still | `references/cinematic-stills.md` (+ `references/photo-prompt-master/00_index.md` 포인터) |
| 연속컷, 스토리보드, 여러 샷 시퀀스, I2V 핸드오프, multi-shot, storyboard, consecutive stills | `references/multi-shot.md` |
| 이미지 편집, 인물 교체, 스타일 전이, 가상 피팅, 오브젝트 추가/제거, 리라이팅, edit, change only X, preserve | `references/edit-workflows.md` |
| 포스터 카피, 헤드라인, 타이포그래피, 썸네일 문구, 한글 렌더, text-in-image, typography, headline | `references/text-in-image.md` |
| 드라마, 숏폼 드라마 씬, 대사/리액션 컷 | `references/lanes/drama.md` |
| 뮤직비디오, MV, 퍼포먼스 스틸, 앨범 커버 | `references/lanes/music-video.md` |
| 광고, 제품, 캠페인, 브랜딩 목업, 발주서 | `references/lanes/commercial.md` |
| 패션, 뷰티, 매거진 화보, 룩북, 에디토리얼 | `references/lanes/editorial.md` |
| 순수 사진 어휘(카메라/렌즈/조명/구도/색/장르 콤보)가 별도로 필요할 때 | `references/photo-prompt-master/00_index.md`에서 해당 파일만 |
| API, 비용, 가격, 모델 선택, 파라미터, deprecation | `references/model-facts.md` (+ `references/api-and-codex-routes.md`) |
| 검증된 예제/레퍼런스 프롬프트가 필요할 때 | `references/validated-examples/` |

레인(`lanes/`) 파일은 코어 레퍼런스 조합 순서와 도메인 디폴트만 얹는 얇은 파일이다 — 레인을 로드해도 그 레인이 지목하는 코어 레퍼런스(character-consistency/cinematic-stills/multi-shot/text-in-image)는 라우팅 표를 다시 거치지 않고 레인 안의 조합 순서를 그대로 따른다.

## 레퍼런스 지도

라우팅 표를 못 쓰는 애매한 요청이면 아래 한 줄 요약으로 판단한다.

| 파일 | 한 줄 역할 |
|---|---|
| `core-grammar.md` | 모든 프롬프트 공통 법 — 철칙/티어형 네거티브/죽은말 제거/수치 앵커링/사이즈 락/자가점검 |
| `character-consistency.md` | 여러 컷에 걸친 동일 인물 유지 — 아이덴티티 락 문법, 히어로 레퍼런스, 드리프트 대응 |
| `cinematic-stills.md` | 정지된 한 컷을 영화적으로 설계하는 상위 원리 — 미장센 6요소, 8슬롯 태그소노미 |
| `multi-shot.md` | 한 장면을 여러 컷/패널로 쪼개는 전략 — 개별 스틸 vs 그리드, I2V 핸드오프 |
| `edit-workflows.md` | 레퍼런스 있는 편집(교체/전이/피팅/추가삭제/리라이팅) — 보존 락리스트 문법 |
| `text-in-image.md` | 이미지 안 정확한 텍스트 렌더 — Tier-1 가드, 존/밴드 문법, 한글 특수 규칙 |
| `model-facts.md` | 모델 능력·제약·가격·모델 선택 지식 레이어 |
| `api-and-codex-routes.md` | 실제 호출 코드(Images API, Responses 이미지 툴, Codex CLI) |
| `photo-prompt-master/` | 카메라/조명/구도/색/장르 세부 사진 어휘 사전 — `00_index.md`부터 진입 |
| `lanes/` | 도메인 디폴트만 얹는 얇은 프리셋(드라마/MV/커머셜/에디토리얼) |
| `validated-examples/` | 검증된 완성 프롬프트 8종 + 사용법 README |

## 철칙 요약

1. 장면에서 빼고 싶은 요소는 전부 긍정문으로 재서술한다("no crowd" 대신 "one person, solo subject"). 부정문이 허용되는 유일한 예외는 렌더 텍스트가 있을 때 붙이는 Tier-1 동결 문장뿐이다.
2. "예쁘게/고급스럽게/감성적으로" 같은 죽은말을 쓰지 않는다 — 수치, 몸 반응 번역, 구체 예시 중 하나로 환원한다.
3. 팔레트(HEX 3-5개)·색온도(K 또는 warm/neutral/cool)·조명비(key:fill)·여백(%)은 형용사가 아니라 숫자로 못박는다.
4. 카메라/렌즈/조명기 브랜드명 대신 그 장비가 만드는 시각적 결과를 서술한다.
5. 사이즈는 6값 화이트리스트 안에서만 고르고 `auto`는 쓰지 않으며, 1행 = 1컷 = 1 API 호출 원칙을 지킨다(예외 3종은 core-grammar 참조).
6. SD/MJ류 구문(`masterpiece`, `--ar`, `(word:1.3)`)과 사후 텍스트 합성(PIL/캔버스로 글자 얹기)은 쓰지 않는다 — 텍스트는 항상 모델이 프롬프트 안에서 직접 렌더한다.
7. 인물이 있으면 자연스러운 피부결(모공/솜털)을 명시하고, 인물이 여러 컷에 반복되면 민족+연령→헤어→눈매→특징→입술→의상→배경→카메라거리 순서로 신원을 고정한다. 실존 인물·실재 상표는 참조하지 않는다.

전체 규칙과 근거는 `references/core-grammar.md`를 참조한다. 제출 전 9항 자가점검을 압축하면: 부정문은 Tier-1뿐인가, 형용사를 지워도 장면이 복원되는가, 장비 브랜드명이 남아있지 않은가, HEX가 실제로 문장 안에 있는가, 사이즈가 6종 안인가, 텍스트 가드가 정확히 1회 위치에 있는가, 브래킷·`Negative:` 섹션이 없는가, 그리드 남용이 없는가, 렌더 문자열 하나에 한/영이 섞이지 않았는가.

## 마스터 템플릿

두 가지 골격 중 요청 성격에 맞는 것 하나만 쓴다. 둘 다 core-grammar의 수치 앵커링·티어형 네거티브 위에 얹는 것이지, 둘 중 하나가 core-grammar를 대체하지 않는다.

- **8슬롯 시네마틱 구조** — 인물 중심 단품(드라마/MV/에디토리얼, 캐릭터가 주인공인 컷)에 쓴다. 인물/포즈·표정/의상/헤어메이크업/조명/질감·색감/카메라·렌즈·심도·앵글/배경 순서. 상세는 `cinematic-stills.md`.
- **6-section 구조** — 발주서형 커머셜/제품/캠페인 요청에 쓴다. `Scene / Camera / Lighting / Color grading / Texture / Text-in-image` + 끝에 `AR x:y`. 상세는 `lanes/commercial.md`.

여기서 슬롯을 다시 나열하지 않는다 — 실제 문장을 채울 때는 해당 레퍼런스를 로드한다.

## 출력 계약

- 완성된 프롬프트 본문만 출력한다. 발주서형 요청(6-section)이 아니면 슬롯 라벨을 그대로 노출하지 않는다.
- 사이즈는 6값 화이트리스트(`1024x1024` / `1024x1536` / `1536x1024` / `1792x1024` / `1024x1792` / `2048x2048`)만 쓴다. `auto`나 임의 커스텀 사이즈는 쓰지 않는다.
- 앞머리 브래킷이나 `Negative:` 라벨 섹션을 남기지 않는다 — 프롬프트 끝에 `AR x:y` 토큰 하나만 남긴다.
- `quality`는 형용사가 아니라 API 파라미터다. 초안은 `low`~`medium`, 밀집 텍스트·정밀 인물·최종본은 `high`로 명시값을 준다. `auto`는 쓰지 않는다.
- Codex 환경에서 실제 비트맵 이미지 생성/편집이 요청되면 imagegen 네이티브 도구를 먼저 쓴다(First choice). 이 스킬은 프롬프트·비주얼 디렉션 설계가 주 목적이며 API 래퍼가 아니다. 구현 코드나 모델/파라미터 확정이 필요하면 `references/model-facts.md`와 `references/api-and-codex-routes.md`를 참조한다.
- 레퍼런스 이미지를 분석해 재현 프롬프트를 만드는 리버스 프롬프팅 요청도 동일한 라우팅 표를 따른다 — 관찰한 결과물의 성격(시네마틱/커머셜/텍스트 등)으로 매칭 행을 고른 뒤 그 레퍼런스의 어휘로 재구성한다.
