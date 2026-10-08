import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const rawPath = path.join(
  root,
  "src/app/standard-terms-and-conditions-of-engagement/engagement-terms.raw.txt",
);
const outPath = path.join(
  root,
  "src/app/standard-terms-and-conditions-of-engagement/EngagementTermsBody.tsx",
);

const H2_SECTIONS = new Set([
  "INTERPRETATION",
  "BASIS OF CONTRACT",
  "PROVISION OF SERVICES BY THE COMPANY",
  "CLIENT’S OBLIGATIONS",
  "FEES",
  "AMENDMENT AND VARIATION",
  "INDEMNITIES",
  "LIMITATION OF LIABILITY",
  "PREPARATION OF SITE",
  "INTELLECTUAL PROPERTY RIGHTS",
  "INSURANCE",
  "CONFIDENTIALITY",
  "TERMINATION",
  "SUSPENSION OF AGREEMENT",
  "GENERAL",
  "GOVERNING LAW AND JURISDICTION",
]);

const H3_UNDER_GENERAL = new Set([
  "Assignment and sub-contracting",
  "Notices",
  "15.3  Waiver",
  "Severance",
  "Third Parties",
  "Force Majeure",
]);

function escapeJsx(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");
}

function isDefinitionLine(line) {
  return /^[\u201c"]/.test(line) && /\s+(means|shall mean)\s+/.test(line);
}

function parseDefinition(line) {
  const m = line.match(/^[\u201c"](.+?)[\u201d"]\s+(means|shall mean)\s+(.*)$/);
  if (!m) return { term: line, def: "" };
  return { term: m[1], def: `${m[2]} ${m[3]}`.trim() };
}

function emitParagraph(text, out) {
  const trimmed = text.trim();
  if (!trimmed) return;
  out.push(`      <p className="min-w-0 break-words">${escapeJsx(trimmed)}</p>`);
}

function emitList(items, out) {
  if (!items.length) return;
  out.push(`      <ul className="min-w-0 list-disc break-words pl-5">`);
  for (const item of items) {
    out.push(`        <li className="min-w-0 break-words">${escapeJsx(item)}</li>`);
  }
  out.push(`      </ul>`);
}

function collectListItems(lines, startIndex) {
  const items = [];
  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    if (H2_SECTIONS.has(line) || H3_UNDER_GENERAL.has(line)) break;
    if (isDefinitionLine(line)) break;
    if (/^The (Company|Client) shall/.test(line) && !line.endsWith(":")) break;
    if (/^If the provision/.test(line)) break;
    if (/^All interpretations/.test(line)) break;
    if (/^The Company shall be entitled to terminate/.test(line) && items.length > 0) break;
    if (/^The Company shall be entitled to terminate the Agreement,/.test(line) && items.length > 0) break;
    if (/^Without limiting its other rights/.test(line) && items.length > 0) break;
    if (/^On termination/.test(line) && !line.endsWith(":")) break;
    if (line.endsWith(":") && items.length > 0) break;
    items.push(line);
    i++;
  }
  return { items, nextIndex: i };
}

function parse(raw) {
  const lines = raw.split(/\r?\n/).map((l) => l.trim());
  if (lines[0]?.startsWith("STANDARD TERMS")) {
    lines.shift();
  }

  const out = [];
  let i = 0;
  let inInterpretation = false;
  let inDl = false;

  const closeDl = () => {
    if (inDl) {
      out.push(`      </dl>`);
      inDl = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }

    if (H2_SECTIONS.has(line)) {
      closeDl();
      inInterpretation = line === "INTERPRETATION";
      out.push(`      <h2 className="min-w-0 break-words">${escapeJsx(line)}</h2>`);
      i++;
      continue;
    }

    if (H3_UNDER_GENERAL.has(line)) {
      closeDl();
      const label = line === "15.3  Waiver" ? "15.3 Waiver" : line;
      out.push(`      <h3 className="min-w-0 break-words">${escapeJsx(label)}</h3>`);
      i++;
      continue;
    }

    if (inInterpretation && isDefinitionLine(line)) {
      if (!inDl) {
        out.push(`      <dl className="min-w-0 space-y-3 break-words">`);
        inDl = true;
      }
      const { term, def } = parseDefinition(line);
      out.push(
        `        <dt className="min-w-0 break-words font-semibold text-pelagic-charcoal">“${escapeJsx(term)}”</dt>`,
      );
      out.push(`        <dd className="min-w-0 break-words pb-2">${escapeJsx(def)}</dd>`);
      i++;
      continue;
    }

    closeDl();

    if (line === "The Client shall:") {
      emitParagraph(line, out);
      i++;
      const items = [];
      while (i < lines.length) {
        if (!lines[i]) {
          i++;
          continue;
        }
        if (!/^(provide|co-operate|comply)/.test(lines[i])) break;
        items.push(lines[i]);
        i++;
      }
      emitList(items, out);
      continue;
    }

    if (line === "On termination of the Agreement for any reason:") {
      emitParagraph(line, out);
      i++;
      const items = [];
      while (
        i < lines.length &&
        /^(The Client shall immediately|The Company shall be entitled to retain|The accrued rights|Clauses which expressly)/.test(
          lines[i],
        )
      ) {
        items.push(lines[i]);
        i++;
      }
      emitList(items, out);
      continue;
    }

    if (
      line.endsWith(" in respect of:") ||
      line.endsWith("for the following:") ||
      line.endsWith("other Party if:")
    ) {
      emitParagraph(line, out);
      i++;
      const { items, nextIndex } = collectListItems(lines, i);
      emitList(items, out);
      i = nextIndex;
      continue;
    }

    emitParagraph(line, out);
    i++;
  }

  closeDl();
  return out.join("\n");
}

const raw = fs.readFileSync(rawPath, "utf8");
const body = parse(raw);

const file = `export function EngagementTermsBody() {
  return (
    <div className="min-w-0 break-words">
${body}
    </div>
  );
}
`;

fs.writeFileSync(outPath, file, "utf8");
console.log("Wrote", outPath);
