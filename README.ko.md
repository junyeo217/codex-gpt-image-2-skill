# GPT Image 2 Prompt Skill

한국어 | [English](README.md)

`gpt-image-2` 프롬프트를 설계하는 범용 Codex/Claude Code 스킬입니다. 드라마 스틸, 뮤직비디오 키아트, 광고/제품 광고, 패션·뷰티 화보, 포스터·타이포그래피, 캐릭터 시트, 연속컷/스토리보드, 이미지 편집, 레퍼런스 이미지 역프롬프팅까지 다룹니다.

이 저장소는 **프롬프트 설계 스킬**이지, 이미지 모델도 API 래퍼도 독립 실행형 생성 서비스도 아닙니다. 하나의 거대한 문서 대신, 요청 유형별로 필요한 것만 골라 읽을 수 있도록 계층화된 레퍼런스 세트를 제공합니다.

## 이 스킬의 용도

- 드라마/뮤직비디오/커머셜·제품/에디토리얼 패션 도메인 전반의 제작용 `gpt-image-2` 프롬프트
- 여러 샷에 걸친 캐릭터/아이덴티티 일관성(캐릭터 시트, 히어로 레퍼런스 워크플로우, 드리프트 대응)
- 정지된 한 컷의 시네마틱 설계(미장센, 8슬롯 태그소노미, 필름스톡 그레이딩)
- 연속컷·스토리보드 및 Image-to-Video 핸드오프 고려사항
- 레퍼런스 이미지 기반 편집(인물 교체, 스타일 전이, 가상 피팅, 리라이팅, 오브젝트 추가/제거)
- 이미지 안 정확한 텍스트 렌더링(한글 특유의 실패 패턴 포함)
- 레퍼런스 이미지를 재현 가능한 프롬프트로 바꾸는 역프롬프팅
- 필요할 때만 참조하는 모델 정보·가격·API/Codex 구현 경로

## 구조

Progressive disclosure 원칙: 코어 문법 하나는 항상 적용되고, 나머지는 `SKILL.md`의 라우팅 표를 통해 요청별로만 로드됩니다.

```text
SKILL.md                        진입점 — 라우팅 표, 철칙 요약, 마스터 템플릿, 출력 계약
references/
├── core-grammar.md             항상 적용되는 공통 법: 철칙, 티어형 네거티브, 죽은말 제거,
│                                수치 앵커링, 사이즈 락, 자가점검 체크리스트
├── character-consistency.md    아이덴티티 락, 캐릭터 시트, 히어로 레퍼런스 워크플로우
├── cinematic-stills.md         미장센 6요소, 8슬롯 시네마틱 태그소노미, 필름스톡
├── multi-shot.md               스토리보드 전략, 프레임 변주, I2V 핸드오프
├── edit-workflows.md           change-only-X, 보존 락리스트, 편집 레시피
├── text-in-image.md            Tier-1 텍스트 가드, 존/밴드 문법, 한글 특수 규칙
├── model-facts.md              모델 능력·하드 제약·가격·모델 선택
├── api-and-codex-routes.md     Images API, Responses 툴, Codex CLI 호출 코드
├── lanes/                      코어 파일을 조합하고 도메인 디폴트만 얹는 얇은 프리셋
│   ├── drama.md
│   ├── music-video.md
│   ├── commercial.md
│   └── editorial.md
├── photo-prompt-master/        세부 사진 어휘(카메라/조명/색/장르 등)
├── validated-examples/         검증된 완성 프롬프트 8종 + README
└── local/                      로컬 머신 전용 코퍼스 라우터 — 스킬 라우팅 대상 아님
scripts/
└── compose_prompt.py           슬롯 기반 프롬프트 조립기, 사이즈 검증기
tools/
├── check_prompt.mjs            core-grammar 자가점검을 기계 검증(존재 시)
├── build_corpus_coverage.py    로컬 전용 코퍼스 매니페스트 생성기
├── validate_corpus_coverage.py 로컬 전용 코퍼스 매니페스트 검증기
└── validate_skill.py           frontmatter·레퍼런스 링크 검증기
```

## 설치

Codex skills 디렉토리에 clone합니다.

```bash
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git ~/.codex/skills/gpt-image-2
```

Claude Code에서 쓰려면 같은 저장소를 프로젝트의 `.claude/skills/` 아래에 symlink(또는 clone)해서 다른 스킬과 함께 인식되게 합니다.

```bash
mkdir -p .claude/skills
ln -s ~/.codex/skills/gpt-image-2 .claude/skills/gpt-image-2
```

설치 후 에이전트 세션을 재시작하면 스킬 메타데이터가 다시 로드됩니다.

## 사용 흐름

1. `SKILL.md`의 라우팅 표에서 요청과 매칭되는 행 1개를 찾는다 — 주 레퍼런스 1개.
2. `core-grammar.md`는 항상 적용한다 — 그 자체는 라우팅 대상이 아니다.
3. 총 1-2개 파일만 로드한다. 코어 레퍼런스 8개를 한 요청에 다 읽지 않는다.
4. 매칭된 레퍼런스의 어휘와 core-grammar의 규칙을 결합해 프롬프트를 작성한다.
5. 반환 전 `core-grammar.md`의 9항 자가점검을 통과시킨다.
6. `tools/check_prompt.mjs`가 있으면 `node tools/check_prompt.mjs <file>`로 기계 검증한다.

라우팅 표 요약(전체 표는 `SKILL.md`에 있음):

| 요청 신호 | 레퍼런스 |
|---|---|
| 캐릭터 일관성, 캐릭터 시트 | `character-consistency.md` |
| 시네마틱/필름 스틸 | `cinematic-stills.md` |
| 스토리보드, 연속컷, I2V | `multi-shot.md` |
| 편집, change-only-X, preserve | `edit-workflows.md` |
| 포스터 카피, 헤드라인, 타이포그래피 | `text-in-image.md` |
| 드라마 / 뮤직비디오 / 커머셜 / 에디토리얼 | `lanes/*.md` |
| API, 가격, 모델 선택 | `model-facts.md` + `api-and-codex-routes.md` |
| 검증된 예제가 필요할 때 | `validated-examples/` |

## 검증된 예제

`references/validated-examples/`에는 core-grammar 자가점검을 통과한 완성 프롬프트 8종이, 각각 원 요청과 완성 프롬프트, 핵심 선택의 근거와 함께 정리돼 있습니다. 그대로 붙여 쓰는 템플릿이 아니라 패턴 참고용이므로, 사용 전 그 폴더의 README를 먼저 읽습니다.

## 프롬프트 검증

`tools/check_prompt.mjs`가 존재하면 작성한 프롬프트 파일에 대해 자가점검의 기계적 부분(부정문 개수, HEX 팔레트 존재, 사이즈 화이트리스트 소속, Tier-1 가드 위치)을 검증할 수 있습니다.

```bash
node tools/check_prompt.mjs path/to/prompt.txt
```

## 헬퍼 스크립트

기본 검증 도구는 `tools/check_prompt.mjs`다(위 "프롬프트 검증" 참조) — 작성한 프롬프트는 사용 전 항상 이 도구로 검증한다.

```bash
node tools/check_prompt.mjs path/to/prompt.txt
```

`scripts/compose_prompt.py compose`는 초안 작성용 레거시 스캐폴드일 뿐이다. 라벨이 붙은 슬롯 출력은 core-grammar 규칙에 맞게 다시 써야 하며, 사용 전 `check_prompt.mjs`로 검증해야 한다.

## 출처와 크레딧

이 스킬의 방법론 — 죽은말 환원을 위한 컨셉 변수 축, R축 몸 반응 번역 기법, 긍정문 중심의 티어형 네거티브, 레이아웃 우선 라우팅 패턴 — 은 `gongnyang-prompt-kit` 레퍼런스 접근에서 영감을 받았고, 그 외 공개된 GPT Image 2 커뮤니티 워크플로우와 OpenAI 공식 문서를 함께 참고했습니다. 원본 프롬프트 컬렉션, PDF, 타 저장소 원문은 이 저장소에 복사되어 있지 않으며, 증류된 패턴과 구조만 남겼습니다. 구체적인 로컬 파일 경로는 의도적으로 배제했습니다 — 로컬 머신 전용 코퍼스 라우터는 `references/local/`에 있으며, 스킬 동작에는 필요하지 않습니다.

## 라이선스

MIT
