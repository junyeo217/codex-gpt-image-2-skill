#!/usr/bin/env node
// gpt-image-2 프롬프트 검증기 — references/core-grammar.md + references/text-in-image.md 준수 여부를 검사한다.
// zero-dependency Node ESM (Node >= 18).
//
// 사용:
//   node tools/check_prompt.mjs <file.txt|file.jsonl> [more files...] [--tier1]
//
// .txt  : 주석 라인(#으로 시작) 제거 후 프롬프트 본문을 검사한다. 단, "size:" 선언은
//         주석 안에 있어도 파싱한다(예: `# size: auto`).
// .jsonl: 각 레코드의 prompt(또는 full_prompt)/size/id 필드를 검사한다.
// --tier1: 렌더 텍스트가 있다고 강제 선언 — 따옴표 자동 감지가 실패하는 경우
//          Tier-1 화이트리스트 7종을 자유 네거티브 스캔에서 면제시키는 데 쓴다.
//
// 종료 코드: 에러가 하나라도 있으면 1, 없으면 0(경고만 있어도 0).

import { readFileSync } from "node:fs";

const SIZE_WHITELIST = ["1024x1024", "1024x1536", "1536x1024", "1792x1024", "1024x1792", "2048x2048"];

// text-in-image.md §텍스트 렌더 철칙 4 — 화이트리스트 7종
const TIER1_WHITELIST = [
  "verbatim, no extra characters",
  "no duplicate text",
  "no invented glyphs",
  "no extra words",
  "no extra text",
  "no watermark",
  "no logo",
];
// core-grammar.md §Tier-1 — 정확한 동결 문장(정본)
const TIER1_CANON =
  "All text appears once, perfectly legible — no duplicate text, no extra words, no invented glyphs, no watermark.";
const TIER1_PREFIX = "All text appears once, perfectly legible — ";

// core-grammar.md §죽은말 제거 — 금지 어휘 목록
const DEAD_WORDS = [
  "예쁘게", "고급스럽게", "세련되게", "감도있게", "있어보이게", "멋지게",
  "감성적으로", "간지나게", "힙하게", "톤 앤 매너 있게",
  "beautiful", "stunning", "award-winning", "world-class",
  "어워드 수준으로", "전문가처럼", "최고급",
];

// core-grammar.md §철칙 7 — SD/MJ류 구세대 문법 폐기 어휘
const SD_MJ_VOCAB = [
  "masterpiece", "best quality", "8k", "4k", "uhd",
  "trending on artstation", "ultra-detailed", "ultra detailed",
  "highly detailed", "sharp focus",
];

// core-grammar.md §장비 → 결과 환원 — 장비 브랜드
const GEAR_BRANDS = [
  "Canon", "Sony", "Nikon", "ARRI", "Leica", "Hasselblad",
  "Fujifilm", "RED", "Panasonic", "Zeiss", "Profoto",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── 공통 유틸 ──

function pushFinding(list, code, line, excerptStr, hint) {
  list.push({ code, line, excerpt: excerptStr, hint });
}

function excerpt(text, idx, len = 60) {
  const s = text.slice(Math.max(0, idx), idx + len).replace(/\s+/g, " ").trim();
  return s.length >= len ? s + "…" : s;
}

function nearestSize(size) {
  const m = /^(\d+)x(\d+)$/.exec(size);
  if (!m) return SIZE_WHITELIST[0];
  const w = +m[1], h = +m[2];
  const dist = (s) => {
    const [W, H] = s.split("x").map(Number);
    return Math.abs(W - w) + Math.abs(H - h) + Math.abs(W / H - w / h) * 512;
  };
  return [...SIZE_WHITELIST].sort((a, b) => dist(a) - dist(b))[0];
}

function quotesOf(text) {
  const res = [];
  const re = /"([^"\n]+)"|“([^”\n]+)”/g;
  let m;
  while ((m = re.exec(text))) res.push({ str: m[1] ?? m[2], idx: m.index });
  return res;
}

// bodyLines: [{text, lineNo}] → { text: joined body, offsets: [{start,end,lineNo}] }
function buildIndexedBody(bodyLines) {
  let text = "";
  const offsets = [];
  for (const e of bodyLines) {
    const start = text.length;
    text += e.text;
    offsets.push({ start, end: text.length, lineNo: e.lineNo });
    text += "\n";
  }
  return { text, offsets };
}

function lineAt(offsets, idx) {
  for (const o of offsets) if (idx >= o.start && idx <= o.end) return o.lineNo;
  return offsets.length ? offsets[offsets.length - 1].lineNo : 1;
}

// ── 긍정 재작성 힌트 (gongnyang REWRITE_MAP 스타일) ──

const REWRITE_MAP = {
  "no people": "빈 배경, 인물 없는 구성 — one person in frame, solo subject 등으로 직접 서술",
  "no crowd": "one person in frame, solo subject",
  "no clutter": "clean minimal background, nothing on the surface",
  "no blur": "sharp focus on the subject, catchlight in the eyes",
  "no blurry": "sharp focus on the subject, catchlight in the eyes",
  "no text": "글자 없는 컷은 텍스트 관련 절 자체를 프롬프트에서 생략 — \"글자 없음\"이라고 쓰는 순간 렌더 후보가 된다",
  "no watermark": "렌더 텍스트가 있는 컷이면 Tier-1 동결 문장을 쓰고, 없으면 \"clean, brand-free, unbranded finish\"로 재작성",
  "no logo": "렌더 텍스트가 있는 컷이면 Tier-1 동결 문장을 쓰고, 없으면 \"clean, brand-free, unbranded finish\"로 재작성",
  "no background": "seamless studio backdrop in a single flat color, nothing else in frame",
  "no shadow": "soft diffuse wraparound light, gentle gradient shadows",
  "no low": "quality는 API 파라미터(quality: high)의 영역 — 문장에는 원하는 질감·마감만 서술",
  without: "뺄 요소 대신 원하는 요소만 구체 명사로 서술",
  avoid: "피할 상태 대신 원하는 상태를 직접 서술",
};

function rewriteHint(phrase) {
  const words = phrase.split(/\s+/);
  const two = words.slice(0, 2).join(" ");
  const one = words[0];
  const to =
    REWRITE_MAP[two] || REWRITE_MAP[one] || "빼려는 요소 대신 원하는 결과 상태를 구체 명사로 서술 (core-grammar.md §Tier-0 표 참고)";
  return `긍정형 재작성 제안: "${phrase}" → ${to}`;
}

// ── Tier-1 동결 문장 부분집합 검증 ──
// "All text appears once, perfectly legible — " 뒤에 화이트리스트 7종 중 일부가
// 콤마로 이어지고(순서 무관, 새 어휘 없음, 중복 없음) 마침표로 끝나면 유효한 부분집합이다.
function matchesWhitelistSequence(body) {
  let remaining = body;
  const used = new Set();
  const items = [...TIER1_WHITELIST].sort((a, b) => b.length - a.length);
  while (remaining.length > 0) {
    const hit = items.find((it) => remaining.startsWith(it) && !used.has(it));
    if (!hit) return false;
    used.add(hit);
    remaining = remaining.slice(hit.length);
    if (remaining.startsWith(", ")) remaining = remaining.slice(2);
    else if (remaining.length > 0) return false;
  }
  return used.size > 0;
}

function isValidTier1Sentence(normalized) {
  if (normalized === TIER1_CANON) return true;
  if (!normalized.startsWith(TIER1_PREFIX) || !normalized.endsWith(".")) return false;
  const body = normalized.slice(TIER1_PREFIX.length, -1);
  return matchesWhitelistSequence(body);
}

// ── 개별 체크 ──

function checkNegatives(text, offsets, tier1Required, errors) {
  const negLabelRe = /\bNegative\s*:/gi;
  let m;
  while ((m = negLabelRe.exec(text))) {
    pushFinding(
      errors, "E-NEG-FREE", lineAt(offsets, m.index), excerpt(text, m.index, 50),
      "`Negative:` 라벨 섹션 금지 — 전부 긍정형 서술로 흡수한다 (core-grammar.md §철칙 1)."
    );
  }

  let scanText = text;
  if (tier1Required) {
    for (const phrase of TIER1_WHITELIST) {
      const re = new RegExp(esc(phrase), "gi");
      scanText = scanText.replace(re, (s) => " ".repeat(s.length));
    }
  }

  const freeRe = /\b(no|without|avoid)\s+[A-Za-z][A-Za-z'’-]*(?:\s+[A-Za-z'’-]+){0,2}/gi;
  const seen = new Set();
  while ((m = freeRe.exec(scanText))) {
    const phrase = m[0].replace(/\s+/g, " ").toLowerCase().trim();
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    pushFinding(errors, "E-NEG-FREE", lineAt(offsets, m.index), excerpt(text, m.index, 60), rewriteHint(phrase));
  }
}

function checkTier1(text, offsets, errors) {
  const re = /All text appears once[^.]*\./g;
  let m;
  while ((m = re.exec(text))) {
    const normalized = m[0].replace(/\s+/g, " ").trim().replace(/\s[-–]{1,2}\s/g, " — ");
    if (!isValidTier1Sentence(normalized)) {
      pushFinding(
        errors, "E-TIER1-MUTATED", lineAt(offsets, m.index), excerpt(text, m.index, 100),
        `Tier-1 동결 문장이 원문과 다르게 변형됨 — text-in-image.md의 정확한 문구를 그대로 인용: "${TIER1_CANON}"`
      );
    }
  }
}

function checkSdMj(text, offsets, errors) {
  const flagRe = /--\s*(ar|v|style|niji|no)\b/gi;
  let m;
  while ((m = flagRe.exec(text)))
    pushFinding(
      errors, "E-SDMJ-SYNTAX", lineAt(offsets, m.index), excerpt(text, m.index, 40),
      "Midjourney식 플래그 금지 — 사이즈는 API size 파라미터로, 종횡비는 프롬프트 끝의 `AR x:y` 토큰으로 표현한다."
    );

  const weightRe = /\([^()]*:\s*[01]?\.\d+\s*\)/g;
  while ((m = weightRe.exec(text)))
    pushFinding(
      errors, "E-SDMJ-SYNTAX", lineAt(offsets, m.index), excerpt(text, m.index, 40),
      "SD식 가중치 문법 `(word:1.3)` 금지 — 강조하려는 특징을 구체 수치·서술로 직접 풀어쓴다."
    );

  const vocabRe = new RegExp(`\\b(${SD_MJ_VOCAB.map(esc).join("|")})\\b`, "gi");
  while ((m = vocabRe.exec(text)))
    pushFinding(
      errors, "E-SDMJ-SYNTAX", lineAt(offsets, m.index), excerpt(text, m.index, 40),
      `SD-era 품질 태그 폐기: "${m[0]}" — 대신 §수치 앵커링으로 질감을 구체 서술 (예: visible pores, fine peach fuzz, subtle film grain).`
    );
}

function checkBracketPrefix(text, offsets, errors) {
  const head = text.slice(0, 120);
  const m = /^\s*\[([^\]\n]{0,100})\]/.exec(head);
  if (m && /(AR\s*\d+\s*:\s*\d+|SIZE|size\s*\d)/i.test(m[1])) {
    pushFinding(
      errors, "E-BRACKET-PREFIX", lineAt(offsets, 0), excerpt(text, 0, 60),
      "앞머리 `[AR x:y SIZE wxh]` 브래킷 금지 — size는 API 파라미터로 넘기고, 프롬프트 본문 끝에는 `AR x:y` 토큰 하나만 남긴다."
    );
  }
}

function checkMixedRenderStrings(text, offsets, errors) {
  for (const q of quotesOf(text)) {
    if (/[가-힣]/.test(q.str) && /[A-Za-z]/.test(q.str)) {
      pushFinding(
        errors, "E-MIXED-RENDER-STRING", lineAt(offsets, q.idx), `"${q.str}"`,
        `렌더 문자열 하나에 한글+영문 혼재 — 역할별로 줄을 나눠 단일 스크립트로: Korean text: "…" / English text: "…" (core-grammar.md §한/영 혼용 규칙).`
      );
    }
  }
}

function checkDeadWords(text, offsets, warnings) {
  const re = new RegExp(`(${DEAD_WORDS.map(esc).join("|")})`, "gi");
  let m;
  const seen = new Set();
  while ((m = re.exec(text))) {
    const key = m[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    pushFinding(
      warnings, "W-DEAD-WORD", lineAt(offsets, m.index), excerpt(text, m.index, 40),
      `죽은말 "${m[0]}" — 수치화 / 몸 반응 번역(R축) / 구체 예시 3경로 중 하나로 환원 (core-grammar.md §죽은말 제거).`
    );
  }
}

function checkHex(text, warnings) {
  const count = (text.match(/#[0-9A-Fa-f]{6}\b/g) || []).length;
  if (count === 0) {
    pushFinding(
      warnings, "W-NO-HEX", 1, "(HEX 팔레트 미검출)",
      "HEX 팔레트 0개 — 핵심색 2~3개는 HEX로 못박기를 권장 (텍스트 아트/편집 프롬프트는 예외일 수 있으나 이 경우도 warn만)."
    );
  }
}

function checkGearSpec(text, offsets, warnings) {
  const brandRe = new RegExp(`\\b(${GEAR_BRANDS.map(esc).join("|")})\\b`, "gi");
  let m;
  while ((m = brandRe.exec(text))) {
    const windowText = text.slice(m.index, m.index + 60);
    if (/f\s*\/?\s*\d+(\.\d+)?/i.test(windowText) || /\b\d{2,4}\s*mm\b/i.test(windowText)) {
      pushFinding(
        warnings, "W-GEAR-SPEC", lineAt(offsets, m.index), excerpt(text, m.index, 60),
        "장비 브랜드+스펙 대신 그 장비가 만드는 시각적 결과로 서술 (core-grammar.md §장비 → 결과 환원, 예: shallow depth of field, background falls off softly into creamy blur)."
      );
    }
  }
}

function checkVagueRef(text, offsets, warnings) {
  const re = /\b(reference|refer to)\s+(the\s+)?(reference\s+)?(image|photo|picture)\b/gi;
  let m;
  while ((m = re.exec(text))) {
    pushFinding(
      warnings, "W-VAGUE-REF", lineAt(offsets, m.index), excerpt(text, m.index, 50),
      "무역할 레퍼런스 지칭 — 레퍼런스의 어떤 요소(구도/색/포즈/재질 등)를 어떻게 반영할지 역할을 구체적으로 지정한다."
    );
  }
}

function checkSizeDeclarations(rawLines, errors) {
  const re = /\bsize\s*[:=]?\s*(\d{3,4}x\d{3,4}|auto)\b/gi;
  const seen = new Set();
  rawLines.forEach((line, i) => {
    const localRe = new RegExp(re.source, "gi");
    let m;
    while ((m = localRe.exec(line))) {
      const val = m[1].toLowerCase();
      const key = `${i + 1}:${val}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (val === "auto" || !SIZE_WHITELIST.includes(val)) {
        pushFinding(
          errors, "E-SIZE-LOCK", i + 1, line.trim().slice(0, 60),
          val === "auto"
            ? `size "auto" 금지 — 6종 화이트리스트(${SIZE_WHITELIST.join(", ")}) 중 하나를 명시한다.`
            : `size ${val}는 6종 화이트리스트 밖 — 가장 가까운 허용값: ${nearestSize(val)}.`
        );
      }
    }
  });
}

// ── 프롬프트 본문 통합 검증 ──

function validateBody(bodyLines, opts) {
  const errors = [], warnings = [];
  const { text, offsets } = buildIndexedBody(bodyLines);
  const tier1Required = quotesOf(text).length > 0 || /Text-in-image\s*:/i.test(text) || !!opts.tier1;

  checkNegatives(text, offsets, tier1Required, errors);
  checkTier1(text, offsets, errors);
  checkSdMj(text, offsets, errors);
  checkBracketPrefix(text, offsets, errors);
  checkMixedRenderStrings(text, offsets, errors);
  checkDeadWords(text, offsets, warnings);
  checkHex(text, warnings);
  checkGearSpec(text, offsets, warnings);
  checkVagueRef(text, offsets, warnings);

  return { errors, warnings };
}

// ── .txt 진입점 ──

export function checkTxtContent(raw, opts = {}) {
  const rawLines = raw.replace(/^﻿/, "").split(/\r?\n/);
  const bodyLines = [];
  rawLines.forEach((line, i) => {
    if (!line.trim().startsWith("#")) bodyLines.push({ text: line, lineNo: i + 1 });
  });
  const { errors, warnings } = validateBody(bodyLines, opts);
  checkSizeDeclarations(rawLines, errors); // 주석의 `# size: ...` 선언도 파싱
  return { errors, warnings };
}

// ── .jsonl 진입점 ──

export function checkJsonlContent(raw, opts = {}) {
  const errors = [], warnings = [];
  const ids = new Set();
  const lines = raw.split(/\r?\n/);

  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const lineNo = i + 1;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch (e) {
      pushFinding(errors, "E-JSONL-PARSE", lineNo, line.slice(0, 60), `JSON 파싱 실패: ${e.message}`);
      return;
    }

    if (rec.id === undefined || rec.id === null || rec.id === "") {
      pushFinding(errors, "E-JSONL-FIELD", lineNo, JSON.stringify(rec).slice(0, 60), "필수 필드 누락: id.");
    } else if (ids.has(rec.id)) {
      pushFinding(errors, "E-JSONL-DUPID", lineNo, `id=${rec.id}`, `중복 id: ${rec.id} — 레코드마다 고유 id가 필요하다.`);
    } else {
      ids.add(rec.id);
    }

    const promptField =
      typeof rec.prompt === "string" ? rec.prompt : typeof rec.full_prompt === "string" ? rec.full_prompt : null;
    if (promptField === null) {
      pushFinding(errors, "E-JSONL-FIELD", lineNo, JSON.stringify(rec).slice(0, 60), "필수 필드 누락: prompt.");
    } else {
      const bodyLines = promptField.split(/\r?\n/).map((t, idx) => ({ text: t, lineNo: idx + 1 }));
      const sub = validateBody(bodyLines, opts);
      for (const e of sub.errors) errors.push({ ...e, line: lineNo });
      for (const w of sub.warnings) warnings.push({ ...w, line: lineNo });
    }

    if (rec.size === undefined || rec.size === null || rec.size === "") {
      pushFinding(errors, "E-JSONL-FIELD", lineNo, JSON.stringify(rec).slice(0, 60), "필수 필드 누락: size.");
    } else if (typeof rec.size === "string") {
      const val = rec.size.toLowerCase();
      if (val === "auto" || !SIZE_WHITELIST.includes(rec.size)) {
        pushFinding(
          errors, "E-SIZE-LOCK", lineNo, `size=${rec.size}`,
          val === "auto"
            ? `size "auto" 금지 — 6종 화이트리스트 중 하나를 명시한다.`
            : `size ${rec.size}는 6종 화이트리스트 밖 — 가장 가까운 허용값: ${nearestSize(rec.size)}.`
        );
      }
    }
  });

  return { errors, warnings };
}

export function checkFile(path, opts = {}) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (e) {
    return { errors: [{ code: "E-INPUT", line: 0, excerpt: path, hint: `파일을 읽을 수 없음: ${e.message}` }], warnings: [] };
  }
  return path.toLowerCase().endsWith(".jsonl") ? checkJsonlContent(raw, opts) : checkTxtContent(raw, opts);
}

// ── 출력 ──

function printFileResult(label, errors, warnings) {
  if (errors.length === 0) {
    console.log(`PASS ${label}`);
    for (const w of warnings) console.log(`  WARN  ${w.code}  line:${w.line}  "${w.excerpt}"\n        HINT: ${w.hint}`);
  } else {
    console.log(`FAIL ${label}`);
    for (const e of errors) console.log(`  ERROR ${e.code}  line:${e.line}  "${e.excerpt}"\n        HINT: ${e.hint}`);
    for (const w of warnings) console.log(`  WARN  ${w.code}  line:${w.line}  "${w.excerpt}"\n        HINT: ${w.hint}`);
  }
}

function runCli() {
  const argv = process.argv.slice(2);
  const files = [];
  let tier1 = false;
  for (const a of argv) {
    if (a === "--tier1") tier1 = true;
    else files.push(a);
  }
  if (files.length === 0) {
    console.error("usage: node tools/check_prompt.mjs <file.txt|file.jsonl> [more files...] [--tier1]");
    process.exit(2);
  }

  let totalErrors = 0, totalWarnings = 0;
  for (const f of files) {
    const { errors, warnings } = checkFile(f, { tier1 });
    totalErrors += errors.length;
    totalWarnings += warnings.length;
    printFileResult(f, errors, warnings);
  }

  if (totalErrors > 0) {
    console.log(`CHECK_FAIL errors=${totalErrors} warnings=${totalWarnings}`);
    process.exitCode = 1;
  } else {
    console.log(`CHECK_OK files=${files.length}`);
    process.exitCode = 0;
  }
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) runCli();
