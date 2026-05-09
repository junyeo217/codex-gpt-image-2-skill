# PART XI. 프롬프트 작성 마스터 팁

### 가중치
1. **앞쪽이 가장 강함** — 모델은 첫 키워드를 가장 신뢰한다.
2. **3~7개 핵심 키워드**가 안정적. 너무 많이 쌓으면 충돌.
3. **카테고리별 1개 원칙** — 광원 1, 카메라 1, 필름 1, 무드 1.

### 충돌 회피
- ❌ `f/1.4` + `everything sharp` (얕은 심도 + 전체 선명)
- ❌ `golden hour` + `harsh midday sun`
- ❌ `Cinestill 800T halation` + `clean digital noise-free`
- ❌ `Hasselblad medium format` + `Kodak Portra 400` (디카+필름 혼동)

### 권장 패턴
- `[카메라 + 렌즈] + [광원/시간대] + [필름/색감] + [구도] + [무드] + [종횡비]`

### 부정 프롬프트 (제거용)
- `oversaturated, plastic skin, HDR halo, overprocessed, AI-generated look, 6 fingers, deformed hands, bad anatomy, cartoonish, low resolution, watermark, signature`

### 디렉팅 키워드 (모델 통제력)
- `from the left / right / above / below` — 광 방향
- `in the foreground / background / middle ground`
- `centered / off-center / left-third`
- `looking at camera / away from camera`

### 스타일 모방 시 주의
- **스타일·룩**은 일반화된 키워드로 (예: "1970s editorial fashion")
- **특정 작가 이름**은 가급적 룩 묘사로 풀어쓰기 (저작권 회피)

### 디테일 강화어
- `hyper-detailed`, `tack sharp`, `gallery print quality`, `8K`
- `clinical sharpness`, `microcontrast`, `tonal gradation`
- `archival quality`, `museum print`

### 계조 / 톤
- `long tonal scale (full Zone 0-X)` — 풍부한 톤
- `short tonal scale (Zone III-VII only)` — 압축된 미드톤
- `lifted blacks (matte)` / `crushed blacks (deep)`

---

## 부록: 체크리스트 (프롬프트 짜기 전 확인)

- [ ] 카메라/포맷 정해졌나? (디지털 vs 필름, 35mm vs 중형)
- [ ] 렌즈 초점거리 + 조리개?
- [ ] 광원 종류 + 방향 + 품질?
- [ ] 시간대 / 날씨?
- [ ] 색감 (필름 스톡 or 그레이딩)?
- [ ] 구도 / 앵글 / 샷 사이즈?
- [ ] 종횡비?
- [ ] 무드 / 감정 톤?
- [ ] 피사체 포즈 / 시선?
- [ ] 환경 / 배경?
- [ ] 후보정 스타일?
- [ ] 충돌하는 키워드 없나?
