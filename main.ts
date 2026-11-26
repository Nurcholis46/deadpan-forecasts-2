// Deadpan Forecasts for Cities That Do Not Exist — entry program.
//
// Writes one invented-city weather line to /output/entry.txt.
// Gate (from the kit RULES): UTF-8 text of 1 to 160 characters,
// not only whitespace. The file must stay readable by every user
// (mode 0644), because the grader collects outputs as another user.

import { chmodSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const LINE =
  "In New Throstle, overnight lows of minus 3, with frost forming exclusively on the left side of parked cars.";

const OUT_DIR = "/output";
const OUT_FILE = "/output/entry.txt";

function charCount(text: string): number {
  // Count Unicode code points, the way the gate counts characters.
  return [...text].length;
}

function assertGate(text: string): void {
  const n = charCount(text);
  if (n < 1 || n > 160) {
    throw new Error(`entry must be 1-160 characters, got ${n}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

assertGate(LINE);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, LINE, "utf8");
chmodSync(OUT_FILE, 0o644);

// Read the file back and prove it holds exactly the intended line,
// byte for byte, at a mode every user can read. A silent short write
// or a restrictive mode would fail the gate on the grading machine,
// so catch both here instead of trusting the write call.
const written = readFileSync(OUT_FILE);
const expected = Buffer.from(LINE, "utf8");
if (!written.equals(expected)) {
  throw new Error(
    `read-back mismatch: file holds ${written.length} bytes, expected ${expected.length}`,
  );
}
const mode = statSync(OUT_FILE).mode & 0o777;
if (mode !== 0o644) {
  throw new Error(`expected mode 0644 on ${OUT_FILE}, got 0${mode.toString(8)}`);
}

console.log(`wrote ${charCount(LINE)} chars to ${OUT_FILE} (mode 0644, verified)`);
