#!/usr/bin/env node
// tools/fixtures/manifest.json에 정의된 모든 픽스처를 check_prompt.mjs "CLI"로(자식 프로세스로
// 실제 spawn해서) 돌려 기대 결과와 대조한다. 라이브러리 함수를 직접 import해서 검사하면
// runCli()/인자 파싱/exit code 같은 CLI 진입점 자체의 회귀는 커버되지 않으므로, 반드시
// `node check_prompt.mjs <file> [--tier1]`를 child_process로 실행해 exit code + stdout을
// 그대로 검증한다.
// 사용: node tools/run_fixtures.mjs
// 성공 시 `FIXTURES_OK N/N`을 출력하고 exit 0, 실패가 있으면 상세를 출력하고 exit 1.

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 이 러너 자신의 경로 기준으로 checker/fixtures 경로를 잡는다 — tools/ 디렉터리 전체가
// 다른 위치로 복사되는 시나리오(예: 공백/한글 섞인 경로)에서도 항상 "복사된 트리 안"의
// check_prompt.mjs를 가리켜야 하며, 원본 저장소 경로나 PATH 상의 다른 node 스크립트를
// 잘못 집어서는 안 된다.
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = resolve(SCRIPT_DIR, "fixtures");
const CHECKER_PATH = resolve(SCRIPT_DIR, "check_prompt.mjs");

// CLI stdout에서 실제로 "ERROR <code>"/"WARN  <code>" 라인으로 출력된 코드만 뽑는다.
// excerpt/hint 텍스트 안에 우연히 "E-" 패턴이 섞여도 오탐하지 않도록 라인 접두사를 고정한다.
function extractCodes(stdout) {
  const codes = [];
  for (const line of stdout.split(/\r?\n/)) {
    const m = /^\s*(?:ERROR|WARN)\s+([EW]-[A-Z0-9-]+)\b/.exec(line);
    if (m) codes.push(m[1]);
  }
  return codes;
}

function runOne(entry) {
  const filePath = resolve(FIXTURES_DIR, entry.path);
  const args = [CHECKER_PATH, filePath, ...(entry.flags || [])];
  const res = spawnSync(process.execPath, args, { encoding: "utf8" });

  if (res.error) {
    return {
      pass: false, ok: false, codes: [], missing: entry.expect.codes || [],
      stdout: "", stderr: String(res.error), spawnError: res.error,
    };
  }

  const stdout = res.stdout || "";
  const exitCode = res.status;
  const ok = exitCode === 0;
  const codes = extractCodes(stdout);
  const missing = (entry.expect.codes || []).filter((c) => !codes.includes(c));
  const pass = ok === entry.expect.ok && missing.length === 0;
  return { pass, ok, codes, missing, stdout, stderr: res.stderr || "", exitCode };
}

function main() {
  const manifest = JSON.parse(readFileSync(resolve(FIXTURES_DIR, "manifest.json"), "utf8"));
  let fails = 0;
  const rows = manifest.map((entry) => {
    const r = runOne(entry);
    if (!r.pass) fails++;
    return { entry, r };
  });

  const wp = Math.max(...rows.map(({ entry }) => entry.path.length), 4);
  console.log(`RESULT  ${"PATH".padEnd(wp)}  MODE   DETAIL`);
  for (const { entry, r } of rows) {
    const status = r.pass ? "PASS" : "FAIL";
    const detail = r.pass
      ? `ok=${r.ok} codes=${[...new Set(r.codes)].join(",") || "-"}`
      : `ok=${r.ok}(기대 ${entry.expect.ok})${r.missing.length ? ` 누락코드:${r.missing.join(",")}` : ""} 실코드:${[...new Set(r.codes)].join(",") || "-"}${r.spawnError ? ` spawn오류:${r.spawnError.message}` : ""}`;
    console.log(`${status.padEnd(6)}  ${entry.path.padEnd(wp)}  ${entry.mode.padEnd(5)}  ${detail}`);
  }

  const total = rows.length;
  const pass = total - fails;
  if (fails === 0) {
    console.log(`\nFIXTURES_OK ${pass}/${total}`);
    process.exitCode = 0;
  } else {
    console.log(`\nFIXTURES_FAIL ${pass}/${total}`);
    process.exitCode = 1;
  }
}

main();
