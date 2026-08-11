/** Static converter credit balance until the credits API is wired. */
export const STATIC_CONVERTER_CREDITS = 0;

export function getConverterCredits() {
  return STATIC_CONVERTER_CREDITS;
}

export function hasConverterCredits() {
  return getConverterCredits() > 0;
}

export function formatConverterCreditsLabel(credits = getConverterCredits()) {
  const n = Number(credits);
  const count = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  return `${count} credit${count === 1 ? "" : "s"}`;
}
