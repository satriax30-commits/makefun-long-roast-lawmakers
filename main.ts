// The Long Roast: Lawmakers and the File They Cannot Convert
// Writes one satirical sentence to /output/entry.txt.
// Node 22, standard library only. Deterministic: no clock, no randomness,
// no network, no environment input — the same entry, byte for byte, every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The lawmakers who just wrote the rules for artificial intelligence " +
  "still print the bill, sign it in pen, and hand it to an intern to " +
  "scan it back into the computer as a PDF.";

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

// Gate guard: the sealed scorer requires UTF-8 text of 1 to 320
// characters, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 320) {
  throw new Error(`entry length ${ENTRY.length} is outside the 1-320 gate`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Self-check: read the file back and confirm it is byte-identical to the
// entry, a single line, and still inside the gate.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt does not match the entry exactly");
}
if (written.length < 1 || written.length > 320 || written.trim().length === 0) {
  throw new Error("entry.txt fails the 1-320 gate on read-back");
}
if (written.includes("\n") || written.includes("\r")) {
  throw new Error("entry.txt is not a single line");
}
// One sentence only: exactly one terminal period, at the very end, and no
// other sentence-ending punctuation anywhere in the line.
const sentenceEnders = (written.match(/[.!?]/g) ?? []).length;
if (sentenceEnders !== 1 || !written.endsWith(".")) {
  throw new Error("entry.txt must be exactly one sentence");
}

console.log(`Wrote ${written.length} characters to ${OUTPUT_PATH}`);
