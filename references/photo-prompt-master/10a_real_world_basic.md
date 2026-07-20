# PART X. 실제 촬영 설정값 (Real-World Numerical Settings)

> 카메라 메뉴에서 실제로 다이얼 돌리는 그 숫자들. 프롬프트에 정확한 값으로 넣으면 모델이 더 구체적인 룩을 잡는다.

---

## 27. ISO 전체 스케일

### 표준 풀스톱 (1 stop씩)
`50 → 100 → 200 → 400 → 800 → 1600 → 3200 → 6400 → 12800 → 25600 → 51200 → 102400 → 204800`

### 1/3 스톱 중간값 (실전에서 가장 흔함)
`50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800`

### 사용 가이드
- `ISO 50/64` — 광고, 풍경, ND 없이 대낮 long exposure (Velvia 50 룩)
- `ISO 100` — 스튜디오 표준, 깨끗한 베이스
- `ISO 200` — 야외 일반
- `ISO 400` — 흐린 날, 실내 자연광 (Tri-X / Portra 400 표준)
- `ISO 800` — 약간 어두운 실내, 결혼식
- `ISO 1600` — 저조도, 살짝 그레인
- `ISO 3200` — 콘서트, 야간 스트리트
- `ISO 6400` — 극저조도, 의도된 그레인
- `ISO 12800+` — 천체, 야간 야생, 다큐 한계
- `dual native ISO 800/4000` — 시네마 카메라 (ARRI/RED/Sony FX)
- `extended ISO (Lo 1.0 / Hi 1.0)` — 확장 감도 (화질 손실)

### 프롬프트 예시
```
ISO 64, base sensitivity, maximum dynamic range, clean shadows
ISO 3200, organic film grain, low-light atmosphere
```

---

## 28. 조리개 (Aperture / f-stops)

### 풀스톱 시퀀스
`f/0.95 → f/1.4 → f/2 → f/2.8 → f/4 → f/5.6 → f/8 → f/11 → f/16 → f/22 → f/32 → f/45 → f/64`

### 1/3 스톱 중간값 (현대 카메라 기본)
`f/1.0, f/1.1, f/1.2, f/1.4, f/1.6, f/1.8, f/2.0, f/2.2, f/2.5, f/2.8, f/3.2, f/3.5, f/4, f/4.5, f/5.0, f/5.6, f/6.3, f/7.1, f/8, f/9, f/10, f/11, f/13, f/14, f/16, f/18, f/20, f/22`

### 1/2 스톱 (일부 빈티지)
`f/1.4, f/1.7, f/2, f/2.4, f/2.8, f/3.4, f/4, f/4.8, f/5.6, f/6.7, f/8`

### 익스트림 / 특수
- `f/0.95` — Leica Noctilux, Mitakon Speedmaster, 극얕은 심도
- `f/1.0` — Canon RF 50mm f/1.0L (단종급), 글로우
- `f/64` — f/64 Group (Adams), 대형 카메라 극심도
- `T-stop (T1.4, T2.8)` — 시네마 렌즈 실투과율 표기

### 사용 가이드 (Sweet Spot)
- `f/1.2~1.4` — 인물 크리미 보케, 한쪽 눈만 초점
- `f/1.8~2.0` — 인물 안전 영역, 양쪽 눈 모두
- `f/2.8` — 화보·저조도 표준
- `f/4` — 그룹 인물, 환경 인물
- `f/5.6` — 대부분 렌즈 sweet spot 시작
- `f/8` — 대부분 렌즈 최고화질, 풍경/제품
- `f/11` — 풍경 hyperfocal
- `f/16` — Sunny 16 표준
- `f/22+` — 회절 한계 진입 (디테일 저하)

### 프롬프트 예시
```
f/1.4 wide open, paper-thin depth of field, swirly background
f/8 sweet spot sharpness, edge-to-edge clarity
f/16 hyperfocal landscape, foreground to infinity sharp
```

---

## 29. 셔터스피드 전체 스케일

### 풀스톱 시퀀스
`1/8000 → 1/4000 → 1/2000 → 1/1000 → 1/500 → 1/250 → 1/125 → 1/60 → 1/30 → 1/15 → 1/8 → 1/4 → 1/2 → 1s → 2s → 4s → 8s → 15s → 30s → BULB`

### 1/3 스톱 중간값
`1/8000, 1/6400, 1/5000, 1/4000, 1/3200, 1/2500, 1/2000, 1/1600, 1/1250, 1/1000, 1/800, 1/640, 1/500, 1/400, 1/320, 1/250, 1/200, 1/160, 1/125, 1/100, 1/80, 1/60, 1/50, 1/40, 1/30, 1/25, 1/20, 1/15, 1/13, 1/10, 1/8, 1/6, 1/5, 1/4, 0.3s, 0.4s, 0.5s, 0.6s, 0.8s, 1s`

### 사용 가이드
- `1/8000s` — 한낮 f/1.4 사용, 최고속 액션 정지
- `1/4000s` — 액션 스포츠
- `1/2000s` — 빠른 움직임 정지
- `1/1000s` — 일반 액션, 조류
- `1/500s` — 어린이, 동물
- `1/250s` — 일상 손떨림 안전 + 플래시 동조 한계
- `1/125s` — 표준 손떨림 마지노선 (50mm)
- `1/60s` — 1/(focal length) 원칙 50mm
- `1/30s` — IS 도움 필요, 살짝 모션
- `1/15s` — 패닝 시작 영역
- `1/8s ~ 1/4s` — 인텐셔널 모션 블러
- `1s ~ 30s` — 야간, 광궤
- `30s+` (BULB) — 별 궤적, light painting

### 안전 셔터 룰
- `1 / focal length` — 손떨림 방지 (50mm → 1/50s 이상)
- IS 5-stop 적용 시 50mm → 1/2s까지 가능

### 프롬프트 예시
```
1/8000s, frozen mid-air droplet, sharp action
1/15s panning blur, sharp subject, streaked background
30 second exposure, smooth water surface, light trails
```

---

## 30. 색온도 (Kelvin) 전체 스케일

### 광원별 정확한 K값
| Kelvin | 광원 |
|--------|------|
| 1000K | 촛불 |
| 1500K | 매치 / 라이터 |
| 1700K | 나트륨 가로등 (오렌지) |
| 1850K | 일출/일몰 직후 |
| 2000K | 새벽 / 황혼 |
| 2700K | 백열 전구 (warm) |
| 3000K | 할로겐 |
| 3200K | **텅스텐 스튜디오 표준** |
| 3500K | 아침/저녁 햇빛 |
| 4000K | 형광등 (warm white) |
| 4100K | 달빛 |
| 4500K | 흐린 일출 |
| 5000K | 수평선 직사광 (D50, 인쇄 표준) |
| 5500K | **정오 직사광 / 데이라이트 필름 표준** |
| 5600K | **HMI / 시네마 데이라이트 표준** |
| 6000K | 정오 살짝 흐림 |
| 6500K | **흐린 날 (D65, 모니터 표준)** |
| 7000K | 옅은 그늘 |
| 7500K | 짙은 그늘 |
| 8000K | 짙게 흐린 날 |
| 9000K | 푸른 시간대 (blue hour) |
| 10000K | 맑은 푸른 하늘 |
| 20000K | 고산 푸른 하늘 |

### Tint 축 (Magenta ↔ Green)
- `+10 magenta` — 형광등 보정
- `0 neutral`
- `-10 green` — 텅스텐 + 마젠타 캐스트 보정

### 의도적 색온도 미스매치 (시네마 룩)
- `daylight scene shot at tungsten WB (3200K)` → 푸른 캐스트 (Cinestill 800T 룩)
- `tungsten lit shot at daylight WB (5500K)` → 호박색 캐스트
- `mixed temperature: 3200K interior + 5600K window` → 영화적 듀얼 톤

### 프롬프트 예시
```
white balance set to 3200K tungsten, blue cast on daylit street
mixed lighting: 5600K HMI key + 3200K practical lamps in background
warm 2700K incandescent ambient, white balance left uncorrected to preserve the warm cast
```

---

## 31. 노출값 (EV / Exposure Value)

### 노출 보정 범위 (-3 ~ +3 EV)
`-3.0, -2.7, -2.3, -2.0, -1.7, -1.3, -1.0, -0.7, -0.3, 0, +0.3, +0.7, +1.0, +1.3, +1.7, +2.0, +2.3, +2.7, +3.0`

### EV 차트 (장면별 광량, ISO 100 기준)
| EV | 장면 |
|----|------|
| -6 | 별빛만 (성운) |
| -4 | 보름달 풍경 |
| -2 | 야간 도시 스카이라인 |
| 0 | 어두운 실내 / 촛불 한 개 |
| 3 | 일반 실내 조명 |
| 5 | 밝은 실내 / 야경 네온 |
| 7 | 화려한 네온 거리 |
| 8 | 야간 스포츠 경기장 |
| 10 | 일출/일몰 |
| 11 | 흐린 야외 |
| 12 | 흐린 밝은 날 |
| 13 | 약간 흐린 야외 |
| 14 | 옅게 흐린 햇빛 |
| 15 | **맑은 햇빛 (Sunny 16)** |
| 16 | 눈/모래 + 강한 햇빛 |

### 프롬프트 예시
```
exposed at +1 EV, slightly overexposed, dreamy high-key
exposed at -1.3 EV, protected highlights, moody
ETTR (expose to the right), histogram pushed but not clipped
```

---

## 32. 초점거리 표준값

### 풀프레임 기준 (35mm equivalent)
- `8mm fisheye` — 180° 원형 어안
- `14mm` — 극광각, 풍경/건축
- `15mm fisheye` — 대각선 어안
- `16mm` — 초광각
- `20mm` — 광각 풍경
- `24mm` — 표준 광각 (저널리즘)
- `28mm` — 다큐멘터리 (Cartier-Bresson, Winogrand)
- `35mm` — 영화 표준, 환경 인물
- `40mm` — 클래식 (Leica CL)
- `50mm` — **표준 (사람 눈에 가장 가까움)**
- `55mm` — Zeiss Otus
- `58mm` — Helios, 구 표준
- `75mm` — 짧은 망원
- `85mm` — **인물 표준**
- `90mm` — 매크로 (Leica Apo-Summicron)
- `100mm` — 매크로 표준
- `105mm` — 인물 망원 (Pentax 67 105/2.4)
- `135mm` — 화보 망원
- `150mm` — 중형 표준
- `180mm` / `200mm` — 압축 인물, 스포츠
- `300mm` — 야생, 스포츠
- `400mm` / `500mm` / `600mm` — 슈퍼 망원
- `800mm` / `1200mm` — 야생 전문

### 화각 (Angle of View, 풀프레임)
| 초점거리 | 대각선 화각 |
|---------|------------|
| 14mm | 114° |
| 24mm | 84° |
| 35mm | 63° |
| 50mm | 47° |
| 85mm | 28° |
| 200mm | 12° |
| 400mm | 6° |

---

## 33. 센서 크기 (실제 mm)

| 포맷 | 크기 (mm) | 크롭팩터 |
|------|-----------|----------|
| **8x10 필름** | 203 × 254 | 0.13x |
| **4x5 필름** | 102 × 127 | 0.27x |
| **6x9 중형 필름** | 56 × 84 | 0.43x |
| **6x7 중형 필름** | 56 × 69 | 0.50x |
| **6x6 중형 필름** | 56 × 56 | 0.55x |
| **6x4.5 중형 필름** | 56 × 41.5 | 0.62x |
| **중형 디지털 53.4×40 (IQ4)** | 53.4 × 40 | 0.64x |
| **중형 디지털 44×33 (GFX)** | 44 × 33 | 0.79x |
| **풀프레임 (35mm)** | 36 × 24 | 1.0x |
| **APS-H (Canon 1D)** | 28.7 × 19 | 1.3x |
| **APS-C (Nikon/Sony/Fuji)** | 23.6 × 15.7 | 1.5x |
| **APS-C (Canon)** | 22.3 × 14.9 | 1.6x |
| **마이크로 포서드 (M43)** | 17.3 × 13 | 2.0x |
| **1-inch (Sony RX, iPhone Pro)** | 13.2 × 8.8 | 2.7x |
| **1/1.7" (콤팩트)** | 7.6 × 5.7 | 4.6x |
| **스마트폰 메인** | ~7.0 × 5.3 | 5.5x |

---

## 34. 해상도 / 메가픽셀

- `12MP` — Sony A7S III (저조도 특화)
- `20MP` — Canon 1DX III (스포츠)
- `24MP` — 풀프레임 표준 (A7 IV, R6)
- `33MP` — 중급
- `45MP` — Canon R5
- `50MP` — Sony A1
- `61MP` — Sony A7R V
- `100MP` — Hasselblad H6D-100c, GFX100 II
- `150MP` — Phase One IQ4 150
- `400MP / 240MP` — 픽셀시프트 합성 (Sony / Hasselblad multi-shot)

### 출력 사이즈 환산
- `300dpi 인쇄 기준`
- `24MP → A2 (42×60cm) 인쇄 가능`
- `100MP → 갤러리 대형 프린트`

---

## 35. 비트 뎁스 / 다이나믹 레인지

### 비트
- `8-bit` — JPEG, 256 단계 / 채널 (16.7M 컬러)
- `10-bit` — HEIF, HDR 비디오 (1.07B 컬러)
- `12-bit RAW` — 보급 RAW
- `14-bit RAW` — 프로 표준
- `16-bit RAW` — 중형 디지털 (Phase One, Hasselblad)

### 다이나믹 레인지 (Stops)
- `8 stops` — 구형 디지털 / JPEG
- `10 stops` — 중급 디지털
- `12 stops` — 표준 풀프레임
- `13~14 stops` — 현대 미러리스 (A7R V, R5)
- `15+ stops` — 시네마 카메라 (ARRI Alexa, RED V-Raptor)
- `16~17 stops` — 중형 디지털 (Phase One IQ4)

---

## 36. 파일 포맷 / 코덱

### 정사진
- `RAW`: CR3 (Canon), NEF (Nikon), ARW (Sony), RAF (Fuji), ORF (Olympus), RW2 (Panasonic), DNG (Adobe/Leica), 3FR/FFF (Hasselblad), IIQ (Phase One)
- `JPEG`: Q100 (max), Q90 fine, Q80 normal
- `HEIF / HEIC`: 10-bit, 더 작은 용량
- `TIFF 16-bit`: 무손실, 후작업
- `PSD / PSB`: 레이어 작업
- `DNG`: 호환 RAW

### 영상
- `ProRes 422 / 422 HQ / 4444` — Apple, 편집 표준
- `BRAW (Blackmagic RAW)`
- `RED RAW (R3D, Log3G10)`
- `ARRIRAW`
- `H.264 / H.265 (HEVC)` — 배포
- `XAVC S / XAVC HS` — Sony
- `All-Intra vs Long-GOP` — 압축 방식

---

## 37. 영상 / 시네마 설정값

### 프레임레이트
| fps | 용도 |
|-----|------|
| 23.976 / 24 | **시네마 표준** |
| 25 | PAL 방송 |
| 29.97 / 30 | NTSC 방송 |
| 48 | HFR (Peter Jackson Hobbit) |
| 50 / 60 | 부드러운 모션, 스포츠 |
| 100 / 120 | 4x / 5x 슬로모션 |
| 240 | 10x 슬로모션 |
| 480 / 1000+ | 하이스피드 (Phantom) |

### 셔터 앵글
- `180°` — **표준 시네마 모션 블러 (= 1/(2×fps))**
- `90°` — 짧은 셔터, 스타카토 (Saving Private Ryan)
- `45°` — 더 짧은, Gladiator 전투씬
- `360°` — 가장 긴 노출, 몽환적

### 비트레이트
- `100 Mbps` — 4K H.264 표준
- `200~400 Mbps` — 4K All-Intra
- `600 Mbps` — 8K
- `1.8 Gbps` — RAW 시네마

---

