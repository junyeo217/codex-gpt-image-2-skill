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
// --tier1: 렌더 텍스트가 있다고 강제 선언 — 따옴표 자동 감지가 실패하는 경우 쓴다.
//          --tier1이 지정되면 Tier-1 동결 문장이 본문에 byte-exact(em dash 포함)로
//          "실제로" 있어야 하며(없으면 E-TIER1-MISSING), 화이트리스트 7종(no watermark 등)의
//          자유 네거티브 스캔 면제도 그 문장이 실제로 있을 때만 적용된다.
//          --tier1 없이 따옴표/"Text-in-image:" 라벨로 렌더 텍스트가 자동 감지된 경우,
//          정본 문장이 없으면 경고만 낸다(W-TIER1-MISSING, non-poster 프롬프트 오탐 방지).
//
// 종료 코드: 에러가 하나라도 있으면 1, 없으면 0(경고만 있어도 0).
// 빈 본문(주석/공백만 남는 경우)은 E-EMPTY 에러로 처리한다.

import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

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

// 정본 문장 매치 대상 추출 — 공백만 접어(collapse) 정규화한다. 대시 문자(em dash 등)는
// 절대 정규화하지 않는다: 정본 비교는 byte-exact여야 하므로 ASCII " - " 변형은
// 반드시 불일치로 남아야 한다 (E-TIER1-MUTATED).
function normalizeTier1Match(raw) {
  return raw.replace(/\s+/g, " ").trim();
}

function findTier1Matches(text) {
  const re = /All text appears once[^.]*\./g;
  const matches = [];
  let m;
  while ((m = re.exec(text))) matches.push(m);
  return matches;
}

// 본문에서 유효한(byte-exact, em dash 포함) Tier-1 동결 문장이 실제로 차지하는
// 문자 구간(span)들을 전부 반환한다. 화이트리스트 네거티브 면제는 이 구간 "안"에서만
// 적용되어야 한다 — 동결 문장 밖에 따로 있는 같은 어휘(예: 별도 Scene 절의 "no logo")는
// 면제 대상이 아니다.
function getValidTier1Spans(text) {
  return findTier1Matches(text)
    .filter((m) => isValidTier1Sentence(normalizeTier1Match(m[0])))
    .map((m) => ({ start: m.index, end: m.index + m[0].length }));
}

// 본문 어딘가에 유효한(byte-exact, em dash 포함) Tier-1 동결 문장이 실제로 있는지.
function hasValidTier1Sentence(text) {
  return getValidTier1Spans(text).length > 0;
}

// ── 개별 체크 ──

function checkNegatives(text, offsets, validTier1Spans, errors) {
  const negLabelRe = /\bNegative\s*:/gi;
  let m;
  while ((m = negLabelRe.exec(text))) {
    pushFinding(
      errors, "E-NEG-FREE", lineAt(offsets, m.index), excerpt(text, m.index, 50),
      "`Negative:` 라벨 섹션 금지 — 전부 긍정형 서술로 흡수한다 (core-grammar.md §철칙 1)."
    );
  }

  // 화이트리스트 7종(no watermark 등)의 자유 네거티브 스캔 면제는 실제로 유효한 Tier-1
  // 동결 문장이 차지하는 구간 "내부"에서만 적용한다. 그 구간을 공백으로 지워 스캔에서
  // 제외하면, 문장 밖에 별도로 존재하는 같은 어휘는 그대로 아래 freeRe에 걸려
  // E-NEG-FREE로 잡힌다.
  let scanText = text;
  for (const span of validTier1Spans) {
    scanText = scanText.slice(0, span.start) + " ".repeat(span.end - span.start) + scanText.slice(span.end);
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
  for (const m of findTier1Matches(text)) {
    // 정본 비교는 raw 텍스트 기준(byte-exact, em dash 필수) — 공백만 접어 정규화하고
    // 대시 문자는 절대 바꾸지 않는다. ASCII " - " 등으로 변형된 문장은 반드시 실패해야 한다.
    const normalized = normalizeTier1Match(m[0]);
    if (!isValidTier1Sentence(normalized)) {
      pushFinding(
        errors, "E-TIER1-MUTATED", lineAt(offsets, m.index), excerpt(text, m.index, 100),
        `Tier-1 동결 문장이 원문과 다르게 변형됨 — text-in-image.md의 정확한 문구를 그대로(em dash 포함) 인용: "${TIER1_CANON}"`
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
  const tier1Explicit = !!opts.tier1;
  const renderTextDetected = quotesOf(text).length > 0 || /Text-in-image\s*:/i.test(text);
  const validTier1Spans = getValidTier1Spans(text);
  const canonicalPresent = validTier1Spans.length > 0;

  // 화이트리스트 7종(no watermark 등)을 자유 네거티브 스캔에서 면제하는 것은 정본 문장이
  // "실제로" 본문에 있을 때, 그리고 그 문장이 차지하는 구간 "안"일 때만이다 — --tier1
  // 플래그 자체는 면제 사유가 아니고, 동결 문장 밖의 같은 어휘도 면제 대상이 아니다.
  checkNegatives(text, offsets, validTier1Spans, errors);
  checkTier1(text, offsets, errors);

  if (tier1Explicit && !canonicalPresent) {
    pushFinding(
      errors, "E-TIER1-MISSING", lineAt(offsets, 0), excerpt(text, 0, 60),
      `--tier1 지정됨 — Tier-1 동결 문장이 본문에 없음(byte-exact, em dash 필수). text-in-image.md의 정확한 문구를 그대로 인용: "${TIER1_CANON}"`
    );
  } else if (!tier1Explicit && renderTextDetected && !canonicalPresent) {
    pushFinding(
      warnings, "W-TIER1-MISSING", lineAt(offsets, 0), excerpt(text, 0, 60),
      `렌더 텍스트가 감지됨(따옴표 또는 "Text-in-image:" 라벨) — Tier-1 동결 문장이 없음. 실제 렌더 컷이면 다음 문장을 그대로 추가 권장: "${TIER1_CANON}"`
    );
  }

  checkSdMj(text, offsets, errors);
  checkBracketPrefix(text, offsets, errors);
  checkMixedRenderStrings(text, offsets, errors);
  checkDeadWords(text, offsets, warnings);
  checkHex(text, warnings);
  checkGearSpec(text, offsets, warnings);
  checkVagueRef(text, offsets, warnings);

  return { errors, warnings };
}

// 주석(#으로 시작하는 라인) 제거 후 남는 본문 라인들을 만든다. .txt와 jsonl의
// prompt/full_prompt 필드 양쪽에서 공유하는 로직 — 어느 쪽이든 "주석/공백만 남는" 경우는
// 동일하게 E-EMPTY여야 한다.
function stripComments(raw) {
  const rawLines = raw.replace(/^﻿/, "").split(/\r?\n/);
  const bodyLines = [];
  rawLines.forEach((line, i) => {
    if (!line.trim().startsWith("#")) bodyLines.push({ text: line, lineNo: i + 1 });
  });
  return { rawLines, bodyLines };
}

// 주석/공백만 남아 본문이 완전히 비어 있는지.
function isBodyEmpty(bodyLines) {
  return bodyLines.every((line) => line.text.trim() === "");
}

// ── .txt 진입점 ──

export function checkTxtContent(raw, opts = {}) {
  const { rawLines, bodyLines } = stripComments(raw);

  // 주석(#)과 공백을 제거한 뒤 본문이 완전히 비어 있으면 그 자체가 에러다.
  if (isBodyEmpty(bodyLines)) {
    return {
      errors: [{
        code: "E-EMPTY",
        line: 1,
        excerpt: "(본문 없음)",
        hint: "prompt body is empty after comment stripping",
      }],
      warnings: [],
    };
  }

  const { errors, warnings } = validateBody(bodyLines, opts);
  checkSizeDeclarations(rawLines, errors); // 주석의 `# size: ...` 선언도 파싱
  return { errors, warnings };
}

// ── .jsonl 진입점 ──

export function checkJsonlContent(raw, opts = {}) {
  const errors = [], warnings = [];
  const ids = new Set();
  const lines = raw.split(/\r?\n/);
  let recordCount = 0;

  lines.forEach((line, i) => {
    if (!line.trim()) return;
    recordCount++;
    const lineNo = i + 1;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch (e) {
      pushFinding(errors, "E-JSONL-PARSE", lineNo, line.slice(0, 60), `JSON 파싱 실패: ${e.message}`);
      return;
    }

    // JSON.parse는 "null"/"123"/"\"str\""/"[1,2]" 같은 비-객체 값도 유효하게 파싱한다.
    // 아래 필드 체크들은 rec가 plain object라고 가정하므로, 그렇지 않으면 raw TypeError로
    // 죽기 전에 여기서 명시적으로 E-JSONL-FIELD를 내고 이 레코드 처리를 중단한다.
    if (rec === null || typeof rec !== "object" || Array.isArray(rec)) {
      pushFinding(errors, "E-JSONL-FIELD", lineNo, line.slice(0, 60), "record must be a JSON object");
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
      const { bodyLines } = stripComments(promptField);
      if (isBodyEmpty(bodyLines)) {
        // prompt/full_prompt 필드는 존재하지만 빈 문자열이거나 공백/주석만 남는 경우 —
        // .txt 진입점과 동일하게 E-EMPTY로 잡는다(그 전까지는 validateBody를 그냥 통과했다).
        pushFinding(
          errors, "E-EMPTY", lineNo, JSON.stringify(rec).slice(0, 60),
          "prompt(또는 full_prompt) 필드가 비어 있음(공백/주석만 존재) — 레코드에 유효한 프롬프트 본문이 필요하다."
        );
      } else {
        const sub = validateBody(bodyLines, opts);
        for (const e of sub.errors) errors.push({ ...e, line: lineNo });
        for (const w of sub.warnings) warnings.push({ ...w, line: lineNo });
      }
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
    } else {
      // size 필드가 존재하지만 문자열이 아님(예: 숫자 123, boolean, object) — 화이트리스트
      // 비교는 문자열 전용이라 타입 체크를 건너뛰면 값이 그대로 통과해버린다. 타입 자체가
      // 이미 위반이므로 값 비교 없이 바로 E-SIZE-LOCK.
      pushFinding(
        errors, "E-SIZE-LOCK", lineNo, `size=${JSON.stringify(rec.size)}`,
        `size 필드는 문자열이어야 함(현재 타입: ${typeof rec.size}) — 6종 화이트리스트(${SIZE_WHITELIST.join(", ")}) 중 하나를 문자열로 명시한다.`
      );
    }
  });

  if (recordCount === 0) {
    pushFinding(errors, "E-EMPTY", 1, "(레코드 없음)", "jsonl contains no records — 공백 라인만 존재해 유효한 레코드가 하나도 없음.");
  }

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

// 경로에 공백/한글이 섞이면 import.meta.url은 percent-encode되지만 process.argv[1]은
// raw string이라 URL 문자열끼리 직접 비교하면 항상 불일치로 샌다. 또 macOS의
// /tmp → /private/tmp 같은 심볼릭 링크가 경로에 끼면 기본적으로 ESM 로더가
// import.meta.url을 realpath로 정규화해버리는데, `node --preserve-symlinks-main`
// (또는 NODE_OPTIONS=--preserve-symlinks-main)이 켜지면 반대로 import.meta.url이
// 심볼릭 링크 경로 그대로 유지되면서 argv[1]만 realpath로 풀리는 비대칭이 생겨
// 두 값이 다시 어긋난다. 그래서 URL 문자열이 아니라 "실제 파일시스템 경로"로
// 양쪽을 fileURLToPath/path.resolve로 정규화한 뒤 realpathSync로 심볼릭 링크까지
// 풀어서 비교한다(경로가 존재하지 않는 등 realpath가 실패하면 정규화된 경로로
// 폴백 — 이 폴백 자체가 무조건 매치를 의미하지는 않는다).
function safeRealpath(p) {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}
const self = safeRealpath(fileURLToPath(import.meta.url));
const invoked = process.argv[1] ? safeRealpath(path.resolve(process.argv[1])) : null;
const isMain = invoked !== null && self === invoked;
if (isMain) runCli();
