#!/usr/bin/env node
// tools/fixtures/manifest.json에 정의된 모든 픽스처를 check_prompt.mjs로 돌려 기대 결과와 대조한다.
// 사용: node tools/run_fixtures.mjs
// 성공 시 `FIXTURES_OK N/N`을 출력하고 exit 0, 실패가 있으면 상세를 출력하고 exit 1.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkTxtContent, checkJsonlContent } from "./check_prompt.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = resolve(SCRIPT_DIR, "fixtures");

function runOne(entry) {
  const opts = { tier1: (entry.flags || []).includes("--tier1") };
  const filePath = resolve(FIXTURES_DIR, entry.path);
  const raw = readFileSync(filePath, "utf8");
  const { errors, warnings } = entry.mode === "jsonl" ? checkJsonlContent(raw, opts) : checkTxtContent(raw, opts);
  const codes = [...errors, ...warnings].map((f) => f.code);
  const ok = errors.length === 0;
  const missing = (entry.expect.codes || []).filter((c) => !codes.includes(c));
  const pass = ok === entry.expect.ok && missing.length === 0;
  return { pass, ok, codes, missing, errors, warnings };
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
      : `ok=${r.ok}(기대 ${entry.expect.ok})${r.missing.length ? ` 누락코드:${r.missing.join(",")}` : ""} 실코드:${[...new Set(r.codes)].join(",") || "-"}`;
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
