/**
 * Listing copy for pages that stay indexable after filter pruning.
 * Industry, part, category, and tag pages each get a different sentence,
 * so a shared "download STEP, STL, IGES" template is not repeated.
 */

export function clipMetaDescription(text, max = 155) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const cut = slice.lastIndexOf(" ");
  const base = (cut > 80 ? slice.slice(0, cut) : slice)
    .replace(/[\s,;:–—-]+$/u, "")
    .replace(/\.+$/u, "");
  return `${base}.`;
}

/** Industry meta is a spun "entire {sector} ecosystem" sentence. Use the sector summary. */
export function industryMetaDescription(data) {
  const unique = String(data?.description || data?.usage || "").trim();
  return clipMetaDescription(unique || data?.meta_description || "");
}

export function partMetaDescription({ partName, industryName, shortDescription }) {
  const part = String(partName || "This part").trim();
  const industry = String(industryName || "").trim();
  const short = String(shortDescription || "").replace(/\s+/g, " ").trim();
  if (short) {
    const lead = industry ? `${part} for ${industry}` : part;
    return clipMetaDescription(`${lead}: ${short}`);
  }
  const where = industry ? `${part} in ${industry}` : part;
  return clipMetaDescription(
    `Check the ${where} model in the browser before you send it to someone without CAD.`
  );
}

export function categoryListingDescription(categoryLabel) {
  return clipMetaDescription(
    `${categoryLabel} collects models for that discipline. It is the shelf for the kind of product, separate from a part tag.`
  );
}

export function tagListingDescription(tagLabel) {
  return clipMetaDescription(
    `${tagLabel} pulls models from every category that carries this feature, standard, or material.`
  );
}

export function categoryTagListingDescription(tagLabel, categoryLabel) {
  return clipMetaDescription(
    `${tagLabel} models that also belong in ${categoryLabel}. Narrower than the ${tagLabel} tag and smaller than the ${categoryLabel} shelf.`
  );
}

export function tagHeroDescription(tagLabel) {
  return `${tagLabel} is a feature or spec, so these models come from more than one discipline. Open one and download the file that matches the job.`;
}

export function categoryHeroDescription(categoryLabel) {
  return `${categoryLabel} is organized as a discipline, not as a single feature tag. Preview the models, then take the file into your CAD tool.`;
}

export function categoryTagHeroDescription(tagLabel, categoryLabel) {
  return `Only ${tagLabel} models inside ${categoryLabel}. This is the overlap, not the full ${tagLabel} tag and not the whole ${categoryLabel} shelf.`;
}

export function twoDCategoryDescription(categoryLabel) {
  return clipMetaDescription(
    `${categoryLabel} drawing sets, grouped by discipline. Each set is sheets from a 3D model, not a feature tag.`
  );
}

export function twoDTagDescription(tagLabel) {
  return clipMetaDescription(
    `Sheets tagged ${tagLabel}, from whichever discipline used that feature. Read the PDF or take SVG and DXF back into CAD.`
  );
}

export function twoDCategoryTagDescription(tagLabel, categoryLabel) {
  return clipMetaDescription(
    `${tagLabel} sheets that belong to ${categoryLabel} only. Not every ${tagLabel} drawing, and not the rest of ${categoryLabel}.`
  );
}

export function twoDTagHeroDescription(tagLabel) {
  return `Drawings tagged ${tagLabel} across disciplines. The sheets are PDF for review and SVG or DXF when the geometry has to go back into CAD.`;
}

export function twoDCategoryHeroDescription(categoryLabel) {
  return `${categoryLabel} drawing sets, kept together as a discipline. Open the sheets rather than hunting a single part tag.`;
}

export function twoDCategoryTagHeroDescription(tagLabel, categoryLabel) {
  return `${tagLabel} sheets inside ${categoryLabel} only. Leave the full ${tagLabel} tag and the rest of ${categoryLabel} for their own pages.`;
}
