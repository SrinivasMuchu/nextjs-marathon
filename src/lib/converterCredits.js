export function formatConverterCreditsLabel(credits) {
  const n = Number(credits);
  const count = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  return `${count} credit${count === 1 ? "" : "s"}`;
}

export function hasConverterCredits(credits) {
  return Number(credits) > 0;
}
