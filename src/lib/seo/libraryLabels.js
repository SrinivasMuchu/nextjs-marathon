/**
 * Display labels for library tags and categories.
 * Acronyms stay uppercase ("CNC", "CAD") and units stay lowercase ("20 mm", not "20Mm").
 */

const ACRONYMS = new Set([
  "2d",
  "3d",
  "3mf",
  "abs",
  "ac",
  "ai",
  "ansi",
  "api",
  "asme",
  "bom",
  "brep",
  "brp",
  "cad",
  "cae",
  "cam",
  "cfd",
  "cnc",
  "dc",
  "din",
  "dlp",
  "dwg",
  "dxf",
  "edm",
  "fdm",
  "fea",
  "gdt",
  "hdpe",
  "hmi",
  "hss",
  "iges",
  "igs",
  "iso",
  "lcd",
  "led",
  "nc",
  "nema",
  "obj",
  "oem",
  "off",
  "pcb",
  "pdf",
  "petg",
  "pla",
  "plc",
  "ply",
  "pom",
  "ptfe",
  "pvc",
  "sla",
  "sls",
  "ss",
  "step",
  "stl",
  "stp",
  "svg",
  "ui",
  "usb",
  "ux",
]);

/** Units that can be glued to a number ("20mm") without eating the next word. */
const MULTI_LETTER_UNITS = [
  "mm",
  "cm",
  "km",
  "nm",
  "μm",
  "µm",
  "um",
  "mil",
  "kg",
  "mg",
  "lb",
  "oz",
  "deg",
  "mpa",
  "kpa",
  "psi",
  "bar",
  "hz",
  "khz",
  "mhz",
  "ghz",
  "rpm",
  "in",
  "ft",
  "yd",
];

const MULTI_LETTER_UNIT_SET = new Set(MULTI_LETTER_UNITS);
const SINGLE_LETTER_UNITS = new Set(["m", "g"]);

const MINOR_WORDS = new Set([
  "and",
  "or",
  "of",
  "the",
  "a",
  "an",
  "to",
  "for",
  "with",
  "from",
  "by",
  "via",
  "on",
  "at",
]);

const GLUED_UNIT_RE = new RegExp(
  `^(.*?)(\\d+(?:\\.\\d+)?)(${MULTI_LETTER_UNITS.join("|")})$`,
  "i"
);
const GLUED_SINGLE_UNIT_RE = /^(\d+(?:\.\d+)?)(m|g)$/i;
const METRIC_THREAD_RE = /^m\d+(?:\.\d+)?$/i;
const NUMBER_RE = /^\d+(?:\.\d+)?$/;

function expandUnitToken(token) {
  const glued = String(token || "").match(GLUED_UNIT_RE);
  if (glued) {
    const parts = [];
    if (glued[1]) parts.push(glued[1]);
    parts.push(glued[2], glued[3]);
    return parts;
  }
  const single = String(token || "").match(GLUED_SINGLE_UNIT_RE);
  if (single) return [single[1], single[2]];
  return [token];
}

function titleCaseWord(word) {
  if (/[a-z]/.test(word) && /[A-Z]/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatToken(token, { titleCase, index, previousIsNumber }) {
  const lower = token.toLowerCase();
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  if (METRIC_THREAD_RE.test(lower)) return `M${lower.slice(1)}`;
  if (NUMBER_RE.test(token)) return token;
  if (MULTI_LETTER_UNIT_SET.has(lower)) return lower;
  if (SINGLE_LETTER_UNITS.has(lower) && previousIsNumber) return lower;
  if (lower === "x" && previousIsNumber) return "x";
  if (titleCase && index > 0 && MINOR_WORDS.has(lower)) return lower;
  if (!titleCase) return token;
  return titleCaseWord(token);
}

function formatLabelTokens(tokens, { titleCase }) {
  const words = [];
  tokens.forEach((token) => {
    expandUnitToken(token).forEach((part) => {
      if (!part) return;
      const previous = words[words.length - 1];
      words.push(
        formatToken(part, {
          titleCase,
          index: words.length,
          previousIsNumber: NUMBER_RE.test(previous || ""),
        })
      );
    });
  });
  return words.join(" ");
}

/** Fix units and known acronyms without rewriting the rest of a product name. */
export function normalizeLibraryUnitsAndAcronyms(value) {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return formatLabelTokens(tokens, { titleCase: false });
}

/** Title-case a tag or category slug/label. "cnc" → "CNC", "20mm spacer" → "20 mm Spacer". */
export function formatLibraryFacetLabel(value) {
  const tokens = String(value || "")
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  return formatLabelTokens(tokens, { titleCase: true });
}
