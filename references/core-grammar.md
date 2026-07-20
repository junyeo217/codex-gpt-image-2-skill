# 코어 문법 (Core Grammar)

모든 프롬프트 작성 전 항상 적용되는 공통 법이다. 캐릭터 레퍼런스·시네마틱 레퍼런스·에디트 레퍼런스·텍스트 레퍼런스·레인별 레퍼런스는 전부 이 파일을 전제로 그 위에 도메인 어휘만 얹는다. 드라마 스틸이든 뮤직비디오 키아트든 광고 배너든 에디토리얼 화보든, 여기 적힌 규칙은 동일하게 적용된다. 다른 레퍼런스에서 "철칙 참조"라고만 적혀 있으면 이 문서를 가리키는 것이다.

## 철칙

1. **모든 장면 배제는 긍정문으로 쓴다.** gpt-image-2는 "no crowd", "no clutter" 같은 장면 네거티브를 부정하지 않고 오히려 렌더하는 경향이 있다 — 부정어 자체가 그 개념을 프롬프트 안에 다시 심는 것과 비슷하게 작동한다. 빼고 싶은 요소는 항상 "그 대신 무엇이 있는가"로 재서술한다. 예외는 딱 하나 — 텍스트 렌더 가드(Tier-1) — 이며, 이는 우회가 아니라 명시적으로 허용된 화이트리스트 문구다.
2. **죽은말(dead word)을 쓰지 않는다.** "예쁘게/고급스럽게/세련되게/감도있게", 무대 지정("어워드 수준으로/전문가처럼/최고급") 전부 기준이 프롬프트 밖에 있어 모델이 가장 무난한 평균값을 낸다. 수치·몸 반응·구체 예시 세 경로 중 하나로 항상 환원한다(아래 §죽은말 제거 참조).
3. **핵심 수치는 프롬프트에 직접 박는다.** HEX 팔레트(컷당 3~5색), 색온도(켈빈 또는 warm/neutral/cool), 조명비(key:fill), 여백 비율(%), 텍스트 위계 단수 — 형용사가 아니라 숫자로 고정한다. 숫자가 없는 미감 지시는 재현 불가능하다고 간주한다.
4. **장비 스펙이 아니라 결과로 쓴다.** gpt-image-2는 카메라 기종·렌즈 스펙·조명기 브랜드를 시각 개념으로 학습하지 않았다. "Canon R5, 50mm f/1.4" 대신 그 장비가 만드는 시각적 결과(얕은 심도, 부드러운 배경 뭉개짐)를 서술한다.
5. **사이즈는 락(lock)된 값만 쓴다.** 하드 제약을 만족하는 안전 부분집합 6종 안에서 고른다. 임의 커스텀 사이즈나 `auto`는 쓰지 않으며, 챕터·시퀀스 내에서는 사이즈를 통일한다.
6. **1행 = 1컷 = 1 API 호출.** 한 캔버스에 여러 컷을 그리드/매트릭스로 우겨넣지 않는다. 여러 컷이 필요하면 별도 행(별도 호출)으로 쪼갠다. 한 번의 배치 호출도 상한이 있다 — 초과분은 호출 자체를 나눈다.
7. **SD/MJ류 구세대 문법을 쓰지 않는다.** `masterpiece / best quality / 8k / 4k / uhd / trending on artstation / ultra-detailed / highly detailed / sharp focus` 같은 품질 태그, `(word:1.3)` 가중치 문법, `--ar / --v` 같은 플래그, 본문 안 `§` 기호는 전부 이 모델 문법이 아니다 — 넣어도 무시되거나 문자 그대로 텍스트로 렌더될 위험만 있다. 이런 태그가 하고 싶었던 일은 대부분 §수치 앵커링과 §장비 → 결과 환원으로 이미 해결된다: "8k, ultra-detailed" 대신 "visible pores, fine peach fuzz, subtle film grain", `--ar 3:4` 대신 프롬프트 끝의 `AR 3:4` 토큰.
8. **텍스트를 렌더할 땐 반드시 가드 문장을 붙인다.** 따옴표 카피가 하나라도 있으면 Tier-1 동결 문장을 정확히 1회, 프롬프트 끝(AR 토큰 직전)에 넣는다. 텍스트가 없는 컷에는 절대 붙이지 않는다.
9. **이상적/플라스틱 피부를 금지한다.** 인물이 있으면 "natural skin texture, visible pores, fine peach fuzz" 류로 질감을 실사화한다 — 매끈한 CG 피부는 죽은말과 마찬가지로 기본값 쏠림을 만든다.
10. **실재 상표·실존 인물을 참조하지 않는다.** 항상 가상 브랜드/가상 페르소나(original character)로 대체한다. 유명인·실존 브랜드명을 그대로 쓰지 않는다.
11. **생성 후 이미지 위에 코드로 글자를 합성하지 않는다.** 텍스트는 반드시 프롬프트 안에서 모델이 직접 렌더하게 한다. PIL·ImageMagick·SVG/HTML·캔버스로 사후 합성한 글자는 폰트·커닝·톤이 이미지와 겉돌아 이질감이 난다. 글자 오류가 나면 프롬프트를 고쳐 재생성한다.

## 티어형 네거티브 시스템

빼고 싶은 것의 종류에 따라 레인이 다르다. 기본은 항상 Tier-0(전부 긍정문), 렌더 텍스트가 있을 때만 Tier-1이 추가된다.

### Tier-0 — 장면 배제는 전부 긍정 재서술

장면 안의 사람·사물·배경·소품·상태를 빼고 싶을 때 쓰는 유일한 방법이다. "~없이"·"no ~"를 쓰지 말고, 원하는 최종 상태를 직접 서술한다. 부정문 개수는 항상 0이다.

| 금지하고 싶었던 것 (죽은 네거티브) | 긍정 재서술 |
|---|---|
| no crowd / 사람 많이 안 나오게 | one person in frame, solo subject — 인물 한 명, 프레임 안에 단독 |
| no clutter / 배경 지저분하지 않게 | clean minimal background, nothing on the surface — 깨끗한 단색 배경, 표면에 군더더기 없음 |
| no blurry face / 얼굴 흐릿하지 않게 | sharp focus on the face, catchlight in the eyes — 얼굴에 선명한 초점, 눈동자에 캐치라이트 |
| no plastic skin / 인공적인 피부 아니게 | natural skin texture, visible pores, fine peach fuzz |
| no logo / 로고 안 보이게 (장면 요소로서) | clean, brand-free, unbranded finish — 브랜드 없는 클린 마감 |
| no harsh shadow / 그림자 세게 안 지게 | soft diffuse wraparound light, gentle gradient shadows |
| no extra limbs / no distorted hands | 손·팔의 정확한 위치를 직접 지정 — "one hand resting flat on the table, the other lightly holding the cup handle" |
| no low quality / no pixelation | 화질은 프롬프트 문장이 아니라 API 파라미터(quality: high, 락 사이즈)의 영역 — 문장에는 원하는 질감·마감만 |
| no busy background / 배경 산만하지 않게 | 배경을 단일 표면·단색으로 직접 지정 — "seamless studio backdrop in a single flat color, nothing else in frame" |
| no text / 글자 안 들어가게 | 글자가 없는 컷은 애초에 텍스트 관련 절 자체를 프롬프트에 안 넣는다 — "글자 없음"이라고 쓰는 순간 그 단어가 렌더 후보가 된다 |
| no duplicate objects / 같은 소품 중복 안 되게 | 개수를 숫자로 못박는다 — "exactly one mug on the table, nothing else on the surface" |
| no stiff/awkward pose / 어색한 포즈 아니게 | 원하는 자세를 직접 지정 — "shoulders relaxed, chin tilted slightly down, weight resting on the back foot" |
| no oversaturated colors / 색 너무 쨍하지 않게 | 채도를 형용사가 아니라 팔레트+톤으로 지정 — "muted desaturated palette #B8AD9E #6E6558, low-contrast midtones" |
| no generic stock-photo look / 흔한 스톡사진처럼 안 되게 | 구체적인 소재·구도·조명 조합으로 특정화(경로 3와 동일 원리) — 일반화된 부정 대신 원하는 장면 그 자체를 서술 |

규칙: `Negative:` 라벨 섹션 자체를 만들지 않는다. 빼고 싶은 것은 항상 본문 안의 긍정 절 하나로 흡수시킨다. 표에 없는 새 배제 요청이 들어와도 패턴은 동일하다 — "무엇을 빼고 싶은가"를 "무엇이 대신 있어야 하는가"로 뒤집어 서술한다.

도메인이 달라져도 패턴은 그대로 이식된다. 느와르 드라마 키아트에서 "다른 인물이 배경에 안 나오게, 그림자 너무 진하지 않게"라는 요청은 → "형사 한 명이 골목 중앙에 단독으로 서 있고, 뒤쪽은 흐릿하게 빠진 빈 골목, key:fill 1:2로 얼굴 절반만 부드럽게 그림자"로 재서술한다. 뮤직비디오 커버에서 "군중 신 아니게, 로고 겹치지 않게"는 → "보컬 한 명이 프레임 중앙 단독, 하단 우측 여백에 워드마크 하나만"으로 재서술한다. 두 경우 다 부정문은 0개다.

### Tier-1 — 텍스트 렌더 가드 (렌더 텍스트가 있을 때만)

이미지 안에 렌더되는 글자(따옴표 카피, 라벨, 로고 워드마크 등)가 하나라도 있으면 아래 결합 공식을 프롬프트 맨 끝, `AR x:y` 토큰 바로 앞에 **정확히 1회** 붙인다. 한 단어도 바꾸지 않는 동결 문장이다.

텍스트 렌더는 장면 렌더와 실패 양상이 다르다 — 글자가 중복되거나, 없는 글자가 끼어들거나(invented glyphs), 워터마크성 잔여 텍스트가 붙는 식으로 실패한다. 이 실패들은 Tier-0의 "장면 요소를 긍정 재서술"로는 못 막는다(글자 자체가 이미 카피 절에 명시돼 있으므로). 그래서 텍스트에 한해서만 화이트리스트 부정문이 별도로 허용된다.

```
All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs, no watermark.
```

이 문장은 7개 화이트리스트 어휘의 조합형이다. 필요에 따라 이 7개 중 일부만 뽑아 쓸 수도 있지만, 새 어휘를 끼워 넣지는 않는다.

**화이트리스트 7종**: `no extra words` · `no duplicate text` · `no invented glyphs` · `no watermark` · `no logo` · `no extra text` · `verbatim, no extra characters`

텍스트가 없는 컷에는 이 문장을 절대 붙이지 않는다(불필요한 부정문 추가 = 규칙 위반).

사용 예 — 헤드라인 하나짜리 포스터 컷 끝부분:
```
… Color grading: 딥네이비 #0F1D30, 크림 #F7F4EC, 로즈골드 #B76E79.
Text-in-image: "봄밤 야시장" 상단 중앙, 굵은 세리프.
All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs, no watermark.
AR 4:5
```
동결 문장은 항상 텍스트 관련 절 바로 뒤, AR 토큰 바로 앞이라는 위치가 고정이다 — 중간에 다른 절을 끼워 넣지 않는다.

## 죽은말 제거

**금지 어휘 목록**: 예쁘게 / 고급스럽게 / 세련되게 / 감도있게 / 있어보이게 / 멋지게 / 감성적으로 / 간지나게 / 힙하게 / 톤 앤 매너 있게 / beautiful / stunning / award-winning / world-class / 어워드 수준으로 / 전문가처럼 / 최고급. 전부 기준이 사람마다 다른 무대 지정어라, 모델은 가장 안전하고 무난한 평균 이미지로 수렴한다. 스스로 점검할 때는 문장에서 형용사만 지워봤을 때도 장면이 그대로 복원되는지 본다 — 형용사를 지워도 수치·반응·구체 예시가 남아 있으면 통과, 아무것도 안 남으면 그 문장은 아직 죽은말에 기대고 있는 것이다.

죽은말(철칙 #2)과 SD-era 폐기 어휘(철칙 #7)는 겉보기엔 둘 다 "형용사·태그를 빼라"는 규칙 같지만 원인이 다르다. 죽은말은 기준이 사람마다 달라서 실패하고(모델이 평균으로 회귀), SD-era 태그는 이 모델이 애초에 그 문법을 학습한 적이 없어서 실패한다(그냥 무시되거나 문자로 렌더). 그래서 처방도 다르다 — 죽은말은 아래 3경로로 환원하고, SD-era 태그는 환원할 것도 없이 그냥 지운다.

환원 경로는 3개다. 하나를 골라 반드시 구체화한다.

**경로 1 — 수치화.** 형용사를 여백 비율·컬러 비율·위계 단수로 바꾼다.
> "잘 예쁘게 만들어줘" → "여백 60%, 메인 컬러 #F5F1E8 60 / 보조 #1C1A17 30 / 포인트 #8C7B6B 10, 텍스트 위계 3단"
> "감성적인 색감으로" → "warm 3200K-feel, key:fill 1:3, 팔레트 #2E2A26 #8A7A66 #F5F0E8 채도 낮게"

**경로 2 — 몸 반응 번역(R축).** 형용사 대신 보는 사람의 몸이 어떻게 반응하는지를 서술하면, 모델이 그 반응을 만들기 위해 구도·여백·색온도를 거꾸로 설계한다. "그림을 설명하지 말고 반응을 설명한다." 대표 8종:

| 죽은 단어 | 몸 반응 | 드롭인 |
|---|---|---|
| 눈에 띄는 | 눈이 여기저기 튀어다닌다 | `busy rhythmic composition that keeps the eye bouncing between focal points, dense with things to discover, high-contrast accents` |
| 고급스러운 | 목소리를 낮추고 조용히 보게 된다 | `hushed composition the viewer lowers their voice for — generous negative space, every element aligned, nothing decorative left` |
| 귀여운·위트 있는 | 입가가 아주 작게 올라간다 | `one playfully misaligned element and a tiny unexpected object that rewards a second look, restraint everywhere else` |
| 대담한 | 뭐 주나 싶어 목이 앞으로 빠진다 | `oversized focal subject cropped past the frame edge, scale that physically pulls the viewer forward` |
| 신뢰 가는 | 어깨가 내려가고 호흡이 느려진다 | `calm symmetric structure on a steady horizon, low-saturation composed palette, slow-breathing stability` |
| 식욕 도는 | 침이 고인다 | `glistening surfaces and rising steam, cross-section detail close enough to reach for` |
| 긴장감 있는 | 숨을 잠깐 참게 된다 | `breath-holding stillness — unstable diagonal, tight claustrophobic crop, deep shadow pools` |
| 청량한 | 어깨에 소름이 살짝 돋는다 | `goosebump-cold crisp highlights, condensation droplets, air that reads several degrees cooler` |

브랜드 로고·워드마크처럼 "보는 사람의 몸 반응"을 쓰기 애매한 대상이면, 반응 대신 **발화 장면**으로 변형한다 — "이 브랜드가 길에서 자기 이름을 외친다면 목소리 크기·발음·자세는 어떨까"를 한 줄로 정하고 그 장면을 시각 토큰으로 옮긴다. 원리는 동일하다: 형용사를 상상 속 구체 행동으로 바꿔서, 모델이 그 행동을 구현하도록 역설계시킨다.

**경로 3 — 구체 예시 치환.** 무대 지정어를 실제로 원하는 장면·마감 그 자체로 바꿔 쓴다. 목표 상태를 직접 서술하면 "수준"이라는 외부 기준이 필요 없어진다.
> "어워드 수준으로" → 실제로 원하는 결과를 그대로 서술: "상단 1/3에 여백을 남기고 메인 카피는 하단에, 그리드는 완벽히 정렬, 인쇄 톤의 매트한 마감"
> "전문가처럼 찍어줘" → 그 전문가가 실제로 할 법한 구체 행동으로: "피사체를 화면 3분의 1선에 배치, 손 위치를 카메라 방향으로 살짝 열어 시선을 유도, 배경 한 톤 더 어둡게"

세 경로 중 어느 것을 택하든 결과는 **모델이 실제로 읽을 수 있는 구체 토큰**이어야 한다. 형용사 하나를 다른 형용사로 바꾸는 건 환원이 아니다. 여러 죽은말이 한 문장에 동시에 걸리면("감성적이면서 세련되게") 평균을 내지 말고, 층(형태/팔레트/타이포/질감/조명/소품)별로 한쪽 성질씩 나눠 배정한다 — 한 레이어 안에서 두 성질을 섞지 않는다.

## 수치 앵커링

- **팔레트**: 항상 HEX 3~5개로 못박는다. 색 이름("차분한 베이지")만으로 끝내지 않는다.
- **색온도**: 켈빈 수치("3200K") 또는 "warm / neutral / cool" 3단 중 하나로 명시한다. "따뜻한 느낌" 같은 형용사 단독 사용 금지.
- **조명비(key:fill)**: `1:1`(평탄한 균질광) / `1:2`(자연스러운 명암) / `1:3`(드라마틱한 하이콘트라스트) — 숫자 비율 뒤에 결과 서술을 병기한다. 예: `key:fill 1:2, moderate shadow contrast`.
- **색 조화**: 팔레트를 고를 때도 감으로 고르지 않고 이름 있는 관계로 고정한다 — 보색(complementary) / 유사색(analogous) / 삼색(triadic) 중 하나를 명시하면 HEX 값들이 서로 충돌하지 않는다.
- **여백·위계**: 카피가 있는 컷은 여백 비율(%)과 텍스트 위계 단수(헤드라인/서브/캡션 = 3단 등)를 함께 적는다.
- **카메라 거리**: "가까이서" 대신 미터 단위로 명시한다("카메라-피사체 거리 약 1.2m").

조명 패턴 이름(Rembrandt·butterfly·split·clamshell)은 장비 브랜드명이 아니라 광원 배치 하나를 가리키는 표준 어휘라 그대로 써도 된다 — 다만 안정성을 더 올리려면 그 뒤에 결과 서술을 한 번 더 붙인다. 예: "butterfly lighting, a soft nose shadow directly below" (코밑에 나비 모양 그림자가 지는 배치라는 뜻까지 서술).

미니 예시: `팔레트 #F5F0E8 #D8CBB8 #8A7A66 #2E2A26, warm 3200K-feel, key:fill 1:2` — 형용사 없이도 조명·색이 완전히 재현 가능한 상태다. 이 네 가지(팔레트/색온도/조명비/여백)는 컷마다 매번 다시 정하는 게 아니라, 시퀀스·챕터 단위로 한 번 고정한 뒤 그 값을 전 컷에 반복 삽입해 톤을 통일한다.

**종합 전-후 예시** — 여러 철칙을 한 번에 적용하는 흐름을 보여준다:

> 원문 요청: "카페에서 커피 마시는 여자, 고급스럽고 감성적으로, 필름카메라로 찍은 느낌, 8k 디테일로."

> 컴파일: "20대 후반 여성이 창가 자리에 앉아 두 손으로 컵을 감싸 쥔 모습, hushed composition the viewer lowers their voice for — generous negative space, every element aligned, warm luminous skin and soft pastel midtones like Portra film, natural skin texture with visible pores, 팔레트 #F5F0E8 #D8CBB8 #8A7A66, warm 3200K-feel, key:fill 1:2, AR 4:5"

바뀐 지점: "고급스럽고 감성적으로"(죽은말) → 몸 반응 드롭인, "필름카메라로 찍은 느낌"(장비 지칭) → 필름 결과 서술, "8k 디테일로"(SD 태그) → 피부·팔레트·조명비 수치, 끝에 `AR` 토큰만 남기고 앞머리 브래킷·사이즈 언급 제거.

## 장비 → 결과 환원

카메라 기종·렌즈 스펙·조명기 브랜드 명은 모델이 학습한 시각 개념이 아니다. 모델은 "이미지가 어떻게 보이는가"를 설명한 캡션으로 학습했지, 그 이미지를 찍은 장비의 메타데이터로 학습하지 않았다 — 그래서 "Canon R5, f/1.4"라고 써도 모델 안에 그 렌즈가 만드는 특정한 보케 커브가 저장돼 있지 않다. 장비명을 아무리 정확히 적어도 그 장비가 실제로 만드는 빛·심도·질감으로 환원해서 쓰지 않으면 반영되지 않는다.

| BAD (장비 나열) | GOOD (결과 서술) |
|---|---|
| shot on Canon R5, 50mm f/1.4 | shallow depth of field, background falls off softly into creamy blur |
| studio strobe, Profoto B10, 90cm softbox | soft diffuse wraparound light, gentle gradient shadows, key:fill 1:2 |
| Helios 44-2 vintage lens | swirly painterly bokeh, gentle vintage rendering |
| Kodak Portra 400 필름으로 찍은 느낌 | warm luminous skin, soft pastel midtones, gentle highlight roll-off |
| Tri-X 필름, 흑백 그레인 강조 | high-contrast monochrome, visible grain |
| CineStill 800T 텅스텐 필름 룩 | tungsten night palette, soft red halation around highlights |
| ring light 로 찍은 듯 | catchlight ring in the eyes, flat even front light |
| drone wide shot | wide field of view, environment fully visible, deep focus front-to-back |

필름 시뮬레이션도 이름만 대지 않는다 — 이름 뒤에는 항상 그 필름이 만드는 결과(스킨/섀도/하이라이트 3파트)를 붙인다: `[필름 emulation] — [스킨 결과], [섀도 결과], [하이라이트 결과]`.

예외는 하나뿐이다 — 패션/시네마틱 레퍼런스에서 `Lens character:` `Director signature:` 같은 라벨을 쓸 때는 라벨 자체가 "이건 장비명이 아니라 결과+창작 앵커"라는 신호이므로 허용된다. 그 경우도 라벨 뒤에는 여전히 결과 서술이 온다("Lens character: compressed perspective, subject lifted from a soft background"), 장비 스펙이 오지 않는다.

결과 토큰은 장르별로 묶어 재사용할 수 있다 — 아래는 즉시 조합 가능한 번들 예시다:
- **패션 에디토리얼**: soft diffuse key + neutral palette + shallow DoF + magazine margins
- **네온 누아르**: practical neon glow + teal & orange grading + wet reflective street + low-angle dutch angle
- **스트리트 다큐**: available light + slightly desaturated + candid framing + deep focus
- **제품 히어로**: clean softbox gradient + single hero spotlight + cool rim light + HEX 단색 배경
- **한국 웹툰/드라마 일러스트**: soft cel shading + glossy dewy highlights + vertical-friendly composition + saturated but limited palette

이런 번들은 장르 이름 자체를 프롬프트에 쓰라는 뜻이 아니다 — 장르 이름은 다시 죽은말이 될 수 있으므로, 번들 안의 결과 토큰들을 그대로 문장에 풀어 쓴다.

## 사이즈 & 배치

### 하드 제약 (gpt-image-2)

| 제약 | 값 |
|---|---|
| 최대 변 | 3840px 미만 |
| 변 배수 | 각 변 16의 배수 |
| 종횡비 | 긴 변:짧은 변 ≤ 3:1 |
| 총 픽셀량 | 655,360 ~ 8,294,400 |

네 제약은 서로 독립이 아니라 함께 걸린다 — 변을 16의 배수로 맞추다 보면 총 픽셀량 하한(655,360)을 못 채우는 극단적 좁은 비율이 나올 수 있고, 종횡비 3:1을 꽉 채우면 최대 변 제약에 먼저 걸린다. 예를 들어 `1024x4096`은 배율은 16의 배수를 만족해도 최대 변(3840px 미만)을 넘어서 무효고, `640x640`은 16의 배수·비율은 통과해도 총 픽셀량 하한을 못 채워 무효다. 그래서 실무에서는 이 네 제약을 매번 손계산하지 않고, 이미 네 제약을 전부 만족하도록 검증된 아래 6종 화이트리스트 안에서만 고른다.

투명 배경은 gpt-image-2가 지원하지 않는다. 투명 PNG가 필요하면 별도 폴백 경로가 필요하다.

### 사이즈 락 화이트리스트 (6종)

하드 제약을 항상 만족하는 안전 부분집합이다. 실무에서는 이 6개 값만 쓴다.

| AR | size |
|---|---|
| 1:1 | 1024x1024 |
| 2:3 / 3:4 / 4:5 (세로 근사) | 1024x1536 |
| 3:2 / 4:3 | 1536x1024 |
| 16:9 | 1792x1024 |
| 9:16 | 1024x1792 |
| 밀집 텍스트 / 다요소 컷 | 2048x2048 |

`2:3`만 정확 비율이고 `3:4`·`4:5`는 세로 근사값이다. 요청받은 값이 6종 밖이면(`1024x1280` 등) 가장 가까운 락 값으로 반올림한다. `auto`는 쓰지 않는다.

### 품질 파라미터

`quality`는 형용사가 아니라 API 파라미터다. 기본 컷은 `medium`, 작거나 밀집된 텍스트가 들어가는 컷·다요소 컷은 `high`로 올린다. `auto`는 사이즈와 마찬가지로 쓰지 않는다 — 매 컷 명시값을 준다. 텍스트 정확도가 안 나오면 우선순위는 캔버스를 키우는 것(2048x2048) → quality를 high로 올리는 것 → 카피 분량을 줄이는 것 순이다.

시안을 여러 장 뽑아 고르는 단계라면 `low`~`medium`으로 빠르게 여러 컷을 훑고, 방향이 정해지면 그 컷만 최종 사이즈·`high` 품질로 다시 뽑는다 — 시안 단계부터 전부 `high`로 돌리는 것은 비효율이다.

### 1컷 = 1콜 원칙과 예외

원칙: 프롬프트 하나는 이미지 한 장을 만든다. 한 캔버스 안에 여러 장면을 그리드나 매트릭스로 나눠 담지 않는다. 여러 컷이 필요하면 프롬프트를 여러 행(각 행 = 별도 API 호출)으로 쪼갠다. 앞머리에 `[AR x:y SIZE wxh]` 같은 브래킷을 달지 않고, 사이즈는 API 파라미터로만 넘기며 프롬프트 본문 끝에는 `AR x:y` 토큰 하나만 남긴다.

배치로 여러 컷을 뽑을 때도 한 번의 호출에는 상한이 있다. 상한을 넘는 수량은 여러 번의 호출로 나눠 보낸다 — 한 호출 안에 더 많은 컷을 우겨넣는 방향으로 상한을 우회하지 않는다.

예외는 "그리드 자체가 그 컷의 피사체"인 컷 타입에 한정된다 — 이 경우는 원칙을 어기는 게 아니라 애초에 1컷의 정의 범위 안에 있다:

1. **만화 멀티패널** — 만화 스트립처럼 여러 칸이 하나의 완성된 산출물로 요청된 경우. 예: "4컷짜리 만화 스트립 한 장" 자체가 요청이면 그 4칸이 곧 1컷.
2. **비교 그리드(comparison_grid)** — before/after, 스펙 비교표처럼 한 이미지 안에 여러 상태·항목을 나란히 놓는 것 자체가 목적인 컷 타입. 예: "리터칭 전/후를 한 장에 나란히"라는 요청 그 자체가 산출물의 정의.
3. **카드뉴스 내부 그리드** — 카드 한 장 안에 아이콘+캡션 모듈이 격자로 배치되는 것이 그 포맷의 정의인 경우. 같은 원리로 브랜드 스타일가이드 시트(로고·컬러칩·타이포 샘플의 단일 레이아웃)도 여기에 속한다.

세 예외 모두 "여러 컷을 절약하려고 합쳤다"가 아니라 "그 컷 타입의 정의상 원래 하나의 장면이 여러 칸으로 구성된다"는 뜻이다. 단순히 컷 수를 줄이고 싶어서 여러 독립 장면을 한 캔버스에 욱여넣는 것은 원칙 위반이다.

배치를 레코드 단위(jsonl 등)로 관리할 때는 프롬프트 순수 서술과 메타데이터를 분리한다 — 사이즈·퀄리티·티어·팔레트 같은 값은 레코드 필드로 따로 두고, 실제로 모델에 넘어가는 프롬프트 본문(`full_prompt`에 해당하는 문자열)에는 순수 서술과 끝의 `AR x:y` 토큰만 남긴다. 앞머리 브래킷이나 `Negative:` 섹션이 본문에 남아 있으면 그 자체가 §철칙 위반 신호다.

## 한/영 혼용 규칙

프롬프트 한 문장 안에서도 어떤 요소는 한국어가, 어떤 요소는 영어가 이긴다.

| 이기는 언어 | 영역 |
|---|---|
| **한국어** | 장면 서사 골격(누가·어디서·무엇을) · 무드 형용(아련한, 서늘한) · 문화 부하 명사(청순, 물오른 같은 번역 손실이 큰 개념) · 렌더될 한글 카피 |
| **영어** | 심도(shallow DoF, deep focus) · 조명 기술어(rim light, key:fill 1:2, clamshell) · 필름 에뮬레이션(Portra emulation, halation) · 포즈 술어(contrapposto, over-the-shoulder) · 티어 동결 문구(Tier-1 결합 공식) · HEX 주변 기술 토큰(gradient, duotone) |

문화 부하 명사는 영어로 번역하는 순간 뜻이 새는 단어들이다 — "청순"을 그냥 "innocent"로 옮기면 결이 사라지고, "물오른"을 "in bloom"으로 옮기면 한국어 화자가 떠올리는 특정 생기·윤기의 뉘앙스가 빠진다. 이런 단어는 억지로 영역하지 말고 한국어 그대로 서사 골격 문장 안에 남긴다.

**하이브리드 패턴** = 한국어 골격 문장 안에 영어 기법 토큰을 그대로 삽입한다.
- 예 1: "창가의 아침빛 아래 선 인물, soft window light from camera left, shallow DoF, 배경은 크림 #F7F4EC 단색."
- 예 2: "옥상에서 노을을 등지고 앉은 두 사람, rim light separating their silhouettes, compressed perspective, 팔레트 #E85D1F #101A2E #F2B705."

조명 서술을 온전히 한국어로("부드러운 실내 자연광과 약한 필라이트") 쓸 수도 있지만, 한 문장 안에서 골격 언어를 섞어 반쪽짜리 번역체로 만드는 것은 피한다 — 한 문장은 한쪽 골격 언어로 통일하고, 그 위에 영어 기법 토큰만 얹는다.

**렌더 텍스트는 한 줄 한 언어.** 실제로 이미지 안에 글자로 렌더되는 따옴표 문자열 안에서는 한글과 영문을 한 문자열에 섞지 않는다. 헤드라인이 한글이면 그 헤드라인 문자열 전체가 한글, 서브카피가 영문이면 그 서브카피 문자열 전체가 영문 — 역할(헤드라인/서브/캡션)별로 문자열을 분리해서 각각 단일 스크립트로 렌더한다. 카피가 둘 이상이면 롤 라벨(headline/subhead/callout)로 분리하고 롤별로 위치·크기·폰트를 따로 지정한다.

**신원 고정(identity lock).** 인물이 등장하는 컷은 신원을 항상 같은 순서로 서술해 챕터/시퀀스 내내 드리프트 없이 반복한다:

```
민족+연령 → 헤어 → 눈매(쌍꺼풀·홍채색) → 특징(점 등) → 입술 마감 → 의상(소재+HEX) → 배경 HEX → 카메라 거리
```

예: "20대 후반 한국 여성, 다크브라운 로우 번 헤어, 짙은 쌍꺼풀에 브라운 홍채, 왼쪽 입가 아래 작은 점, 매트 베이지 립, 아이보리 울 코트 #F5F0E8, 배경 #2E2A26, 카메라 거리 약 1.5m" — 이 블록을 컷마다 글자 단위로 거의 동일하게 반복해야 같은 인물로 인식된다. 실재 인물·상표 참조 대신 항상 가상 페르소나(original character)/가상 브랜드를 쓴다.

이 문서는 어휘 사전이 아니라 법이다. 캐릭터 레퍼런스는 위 §신원 고정 순서 위에 얼굴·표정·바디랭귀지 어휘를 얹고, 시네마틱 레퍼런스는 §장비 → 결과 환원과 §수치 앵커링 위에 샷 사이즈·앵글·렌즈 캐릭터 어휘를 얹으며, 에디트 레퍼런스는 §철칙(특히 사이즈 락·1컷=1콜)을 편집·합성 워크플로에 그대로 상속한다. 텍스트 레퍼런스는 §티어형 네거티브 시스템의 Tier-1을 카피·타이포 어휘로 확장하고, 레인별 레퍼런스는 이 문법 위에 도메인 디폴트와 어휘만 얹는다. 어떤 레퍼런스를 읽든 §철칙과 §티어형 네거티브 시스템의 Tier-0/Tier-1은 예외 없이 먼저 적용된 상태로 간주하고, 그 위에 도메인 어휘만 참고한다.

**제출 전 자가 점검**(전 도메인 공통):
1. 부정문이 있는가? 있다면 Tier-1 화이트리스트 문구뿐인가?
2. 문장에서 형용사만 지웠을 때도 장면이 그대로 복원되는가(수치·반응·구체 예시가 남아 있는가)?
3. 카메라·렌즈·조명기 브랜드명이 그대로 남아 있지 않은가 — 남아 있다면 결과 서술로 바꿨는가?
4. HEX 팔레트 3~5개가 실제로 프롬프트 문장 안에 있는가?
5. 사이즈가 6종 화이트리스트 안인가, `auto`가 남아 있지 않은가?
6. 텍스트가 있다면 Tier-1 동결 문장이 `AR` 토큰 직전에 정확히 1회 있는가, 텍스트가 없는데 그 문장이 붙어 있지 않은가?
7. 앞머리 브래킷(`[AR x:y SIZE wxh]`)이나 `Negative:` 라벨 섹션이 남아 있지 않은가?
8. 한 캔버스에 여러 독립 장면이 그리드로 욱여넣어져 있지 않은가(§1컷=1콜 예외 3종은 제외)?
9. 렌더되는 따옴표 문자열 하나 안에 한글과 영문이 섞여 있지 않은가?

## Sources

- gongnyang-prompt-kit 레퍼런스 — 컨셉 변수 축(죽은말 환원 3경로·R축 몸 반응 번역), 사진 어휘 풀(장비→결과 환원, 조명/필름/색 결과 토큰, 한/영 혼용 규칙), 에디토리얼 레인(Tier-0 긍정 재서술·Tier-1 텍스트 렌더 가드 네거티브 체계)
- gpt-image-2 공식 문서·쿡북 기반 정리 — 사이즈 하드 제약 4종, 사이즈 락 6종 화이트리스트, 품질 파라미터, jsonl 배치 규약(1행=1레코드, full_prompt 계약)
