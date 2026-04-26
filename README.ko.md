# GPT Image 2 Codex Skill

한국어 | [English](README.md)

GPT Image 2 프롬프트 설계, 역프롬프팅, 이미지 편집 지시문, 제작용 비주얼 브리프 구성을 위한 Codex 스킬입니다.

이 저장소는 **이미지 모델 자체**도 아니고, **API 래퍼**도 아니며, **독립 실행형 이미지 생성 서비스**도 아닙니다. Codex가 막연한 이미지 아이디어, 레퍼런스 이미지, 제작 요구사항을 구조화된 GPT Image 2 프롬프트와 실전 제작 방향으로 바꿀 수 있도록 돕는 스킬입니다.

## 이 스킬의 용도

이 스킬은 다음 작업에 적합합니다.

- GPT Image 2용 고품질 프롬프트와 비주얼 브리프 작성
- 레퍼런스 이미지를 재현 가능한 프롬프트로 역프롬프팅
- 유지할 요소와 변경할 요소를 분리한 이미지 편집 지시문 작성
- 시네마틱 포스터, 인물 사진, 제품 사진, 광고, 썸네일, UI 목업, 인포그래픽, 상세페이지 이미지, 로고, 만화 컷, 다이어그램, 차트, 슬라이드, 캐릭터 콘셉트 제작
- 이미지 안의 텍스트 번역, 가상 의류 착용, 스케치/드로잉의 이미지화, 제품 목업, 오브젝트 제거, 인물 삽입, 조명/날씨 변경, 여러 레퍼런스 이미지 합성 같은 특수 워크플로우
- 프롬프트 검수, 실패 원인 분석, 반복 개선
- Codex, ChatGPT, 또는 다른 GPT Image 2 워크플로우에서 이미지 생성 전 비주얼 브리프 정리

## 핵심 아이디어

이 스킬은 프롬프트 감산 실험에서 얻은 구조를 바탕으로, 이미지를 통제 가능한 시각 슬롯으로 나누어 설계합니다. 막연한 스타일 단어를 늘어놓는 대신 아래 요소를 분리합니다.

```text
[Purpose]
[Core brief]
[Required elements]
[Context / environment]
[Style / rendering]
[Composition / framing]
[Light / material / color]
[Layout / spatial relationships]
[Text rules]
[Constraints / bans / fixed details]
[Output]
```

한국어로는 다음 구조로 이해하면 됩니다.

```text
[목적]
[핵심 브리프]
[필수 요소]
[맥락 / 환경]
[스타일 / 렌더링]
[구도 / 프레이밍]
[빛 / 재질 / 색]
[레이아웃 / 공간 관계]
[텍스트 규칙]
[제약 / 금지 / 고정]
[출력]
```

이 구조는 포스터, 썸네일, 상세페이지, 제품 광고, 인포그래픽, 교육용 이미지, UI 목업, 텍스트가 들어가는 이미지처럼 레이아웃 통제가 중요한 작업에 특히 유용합니다.

## 설치

이 저장소를 Codex skills 폴더에 clone합니다.

macOS / Linux:

```bash
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git ~/.codex/skills/gpt-image-2
```

Windows PowerShell:

```powershell
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git "$env:USERPROFILE\.codex\skills\gpt-image-2"
```

설치 후 Codex를 재시작하면 스킬 메타데이터가 다시 로드됩니다.

## 사용 예시

한국 영화 포스터 프롬프트 만들기:

```text
$gpt-image-2로 비 오는 서울을 배경으로 한 한국 느와르 영화 포스터 프롬프트를 만들어줘.
```

레퍼런스 이미지 역프롬프팅:

```text
$gpt-image-2로 이 이미지를 분석해서 GPT Image 2에서 재현 가능한 프롬프트로 바꿔줘.
```

화장품 상세페이지 이미지 프롬프트:

```text
$gpt-image-2로 메인 비주얼이 아니라 진짜 쇼핑몰 화장품 상세페이지처럼 보이는 이미지 프롬프트를 만들어줘.
```

인포그래픽 프롬프트:

```text
$gpt-image-2로 초보 고객을 위한 스킨케어 5단계 인포그래픽 프롬프트를 만들어줘.
```

부족한 프롬프트 진단:

```text
$gpt-image-2로 이 프롬프트를 개선하고 어떤 시각 슬롯이 빠졌는지 설명해줘.
```

## 역프롬프팅 워크플로우

이 스킬은 원본 이미지의 숨겨진 프롬프트를 정확히 맞히려는 도구가 아닙니다. 대신 눈에 보이는 요소를 분석해서 비슷한 결과를 만들 수 있는 실전 재현 프롬프트를 만듭니다.

분석 항목은 다음과 같습니다.

- 주체와 필수 오브젝트
- 환경과 맥락
- 카메라 각도, 크롭, 구도
- 조명, 색감, 재질, 질감
- 레이아웃과 공간 관계
- 이미지 안의 텍스트 규칙
- 실패를 막는 제약 조건
- 출력 비율과 형식

좋은 요청 예시는 다음과 같습니다.

```text
$gpt-image-2로 이 이미지를 다음 형식으로 역프롬프팅해줘:
1. 관찰 기반 시각 분석
2. GPT Image 2 재현 프롬프트
3. 변형 프롬프트 3개
4. 실패 방지 제약 조건
```

## 이미지 편집 워크플로우

이미지 편집 요청에서는 다음을 분리합니다.

- 유지할 것: 인물 정체성, 포즈, 제품 형태, 레이아웃, 카메라 각도, 방 구조 등
- 변경할 것: 배경, 의상, 색감, 스타일, 오브젝트 배치, 날씨, 조명, 텍스트 등
- 방지할 것: 얼굴 변화, 손 왜곡, 로고 추가, 텍스트 깨짐, 경계선 번짐, 얼룩, 레이아웃 붕괴 등

이렇게 나누면 Codex가 더 명확한 편집 지시문을 만들고, 결과 검수도 쉬워집니다.

## 고급 구현 참고

이 스킬의 주 목적은 프롬프트와 비주얼 디렉션입니다. 다만 고급 사용자를 위해 다음 구현 경로에 대한 작은 참고 문서를 포함합니다.

- Image API에서 `model="gpt-image-2"`를 직접 지정하는 방식
- Responses API / Codex 워크플로우에서 `image_generation` 도구를 사용하는 방식

이 내용은 스킬의 핵심 용도가 아니라 보조 참고입니다. 필요할 때만 [references/api-and-codex-routes.md](references/api-and-codex-routes.md)를 확인하세요.

## 헬퍼 스크립트

구조화 프롬프트를 빠르게 만들거나 GPT Image 2 이미지 사이즈 조건을 확인하는 작은 스크립트가 포함되어 있습니다.

구조화 프롬프트 만들기:

```bash
python scripts/compose_prompt.py compose --brief "rainy Seoul cinematic poster with a red umbrella"
```

이미지 사이즈 검증:

```bash
python scripts/compose_prompt.py check-size --size 1536x1024
```

## 저장소 구조

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── api-and-codex-routes.md
│   ├── prompt-frameworks.md
│   └── source-notes.md
├── scripts/
│   └── compose_prompt.py
├── README.md
├── README.ko.md
└── LICENSE
```

## 주의사항과 한계

- Codex UI나 도구가 실제로 어떤 백엔드 이미지 모델을 쓰는지는 런타임이 명시하지 않으면 단정하지 않습니다.
- API 작업에서 모델을 확정하고 싶다면 `model="gpt-image-2"`를 명시하세요. 단, API 문서는 보조 참고일 뿐 이 스킬의 주 용도는 아닙니다.
- 역프롬프팅은 원본 프롬프트 복원이 아니라 재현 가능한 프롬프트 설계입니다.
- 이 저장소에는 원본 PDF, Notion 전문, Soylab 페이지 전문, 다른 repo의 프롬프트 컬렉션 원문을 포함하지 않습니다.
- 실제 인물, 브랜드, 로고, 저작권 레퍼런스를 사용할 때는 관련 권리와 정책을 확인해야 합니다.

## 출처

이 스킬은 OpenAI 공식 문서, 사용자 제공 프롬프트 감산 실험, Soylab GPT Image 2 가이드, 공개 GPT Image 2 커뮤니티 워크플로우에서 얻은 패턴을 요약·재구성한 것입니다. 요약 메모는 [references/source-notes.md](references/source-notes.md)에 정리되어 있습니다.

## 라이선스

MIT
