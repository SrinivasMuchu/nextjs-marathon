# Conversion pricing text changes — "First 2 downloads free"

**New plan:** every user's first 2 CAD file downloads are free, any file size. From the 3rd file, each download costs 1 credit or a one-time payment. A free download or credit is used **only when the user clicks Download**. Converting never uses anything. Free downloads are used before purchased credits, and re-downloading an unlocked file is free.

Base URL: `https://marathon-os.com`

---

## 1. Pages and URLs where text changed

| Page / URL | What changed | Frontend file(s) |
|---|---|---|
| **Home page**<br>`/` | Pricing panel lead: now mentions the first 2 free downloads; credits are used only on Download. | `src/Components/HomePages/ConversionPricing/ConversionPricingPanel.js` |
| **Home page FAQ**<br>`/` | "How much does a standard CAD format conversion cost?" now starts with "Your first 2 file downloads are free…" | `src/Components/HomePages/ConversionFaq/ConversionFaq.js` |
| **Converter hub**<br>`/tools/3d-cad-file-converter` | Badge "Files under 5 MB free" → "First 2 downloads free". Pricing note and FAQ answer "Is the converter free to use?" rewritten. | `src/data/converterHubPage.js`, `src/data/cadToolFaqs.js` (`cadConverterFaqQuestions`) |
| **Converter hub, upload box**<br>`/tools/3d-cad-file-converter` | Pricing line under the Convert button; banner after choosing a file ("Free — downloading this file will use 1 of your 2 free downloads (N left)…" / "You've used your 2 free downloads. Downloading this file costs $X (incl. tax) or 1 credit, charged only when you click Download."). Removed the "Files under 5 MB" fallback. | `src/Components/CadUploadingHome/CadFileConversion/CadUploadDropDown.js`, `src/Components/CadUploadingHome/CadFileConversion/ConverterPricingDisplay.js`, `src/lib/converterPricing.js` |
| **Converter pricing section** (hub + every pair page) | Heading "First 2 downloads free, simple credits after"; summary line; "After your free downloads, each file costs one credit… used only when you click Download." | `src/Components/CadUploadingHome/CadFileConversion/ConverterPricingSection.js`, `src/lib/converterPricing.js` |
| **Every pair converter page**<br>`/tools/convert-<from>-to-<to>`<br>(e.g. `/tools/convert-step-to-stl`) | Default SEO title "Free up to 5 MB" → "First 2 Free"; default meta description; default badge; FAQ "Is the X to Y converter free?"; comparison table "Price" row. | `src/app/tools/[tool]/page.js`, `src/Components/CadUploadingHome/CadFileConversion/ConvertPairPage.js`, `src/data/cadToolFaqs.js` (`getConverterFaqQuestions`) |
| `/tools/convert-stl-to-step` | Meta description, badge, FAQ answer, how-to text, comparison "Cost" and "Price" rows. | `src/data/converterPairUniquePages.js`, `src/Components/CadUploadingHome/CadFileConversion/StlToStepSections.js` |
| `/tools/convert-step-to-stl` | Title, meta description, badges ("No signup for free files" → "Any file size"), FAQ answer, how-to text. | `src/data/converterPairUniquePages.js`, `src/Components/CadUploadingHome/CadFileConversion/ConvertPairPage.js` |
| `/tools/convert-stl-to-iges` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-stl-to-brep` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-step-to-iges` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-obj-to-step` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-obj-to-iges` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-dxf-to-dwg` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-3dm-to-step` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| `/tools/convert-iges-to-step` | Title, meta description, badge, FAQ answer. | `src/data/converterPairUniquePages.js` |
| **Conversion progress screen** (shown while a file converts, on converter pages) | A user with credits no longer sees "Covered by your credits" when the file is actually free. With credits after the free downloads are used: "1 credit will be used only when you click Download". Removed the false "this file downloads itself" line. | `src/Components/CommonJsx/Loaders/ConverterProgressLoader.js` |
| **Dashboard – converted files**<br>`/dashboard?cad_type=CAD_CONVERTER` | Badges: "Free · N left" (will use a free download), "Free" (already unlocked), "Paid", or price. Buttons: "Download · free", "Download · uses 1 credit", "Download · $X or 1 credit". Footnote: re-downloading an unlocked file is free. | `src/Components/History/CadConvertorFiles.js`, `src/Components/History/CadComparisonPopup.js`, `src/lib/converterPricing.js` |
| **Dashboard – after clicking Download**<br>`/dashboard?cad_type=CAD_CONVERTER` | New toasts: "Free download used. You have 1 free download left." / "…That was your last one…" / "1 credit used for this file. N credits left. Re-downloading it is free." | `src/Components/History/FileHistoryCards.js` |
| **"Buy credits" popup** (top nav credits pill, every page) | Subtitle: "Your first 2 file downloads are free (any size) and are used before your credits… A credit is used only when you click Download." | `src/lib/converterPricing.js` (`getCreditPlansSubtitle`) |

> `src/Components/CadUploadingHome/CadFileConversion/ConverterUploadPricingNote.js` was also updated but is not used on any page right now.

---

## 2. Shared message helpers (frontend)

All in `src/lib/converterPricing.js`. These follow the admin setting, so the number of free downloads updates automatically.

| Function | Example text now |
|---|---|
| `getConverterFreePlanSummary` | "Your first 2 file downloads are free, any file size. From file 3 on, each download costs 1 credit or a one-time payment, charged only when you click Download." |
| `getFreeConversionsStatusText` | "You have 1 of 2 free downloads left. Free downloads are used before your credits." / "You've used your 2 free downloads. Each new file now costs 1 credit or a one-time payment when you download it." |
| `getFreeConversionUseText` | "Free — downloading this file will use 1 of your 2 free downloads (1 left). Nothing is used until you click Download, and re-downloading it later stays free." |
| `getPaidConversionReasonText` | "You've used your 2 free downloads. Downloading this file costs …" |
| `getConverterFreePlanHeading` | "First 2 downloads free, simple credits after" |
| `getCreditPlansSubtitle` | see "Buy credits" popup above |
| `getConverterFileBadge` *(new)* | "Free · 1 left", "Free", "Paid", "$2.99" |
| `getConverterDownloadLabel` *(new)* | "Download · free", "Download · uses 1 credit", "Download · $2.99 or 1 credit" |

**Note:** the SEO and marketing text in `src/data/*.js`, `ConvertPairPage.js`, `StlToStepSections.js`, `ConversionFaq.js` and `ConversionPricingPanel.js` says "2" as fixed text. If the admin changes the free count, those need editing by hand.

---

## 3. Emails (backend, `api_server`)

| Email | What changed | File |
|---|---|---|
| "Your Converted CAD File is Ready" | Price row: "Free (2 of 2 free downloads left)", or "1 credit (you have N)", or "$X". A note explains what will be used, and that it is used only on Download. | `server/v1/cadViewer/cadViewer.controller.js` |
| "Complete Your Payment to Download" (daily reminder) | Intro says the free downloads are used up and nothing is charged until Download. "Amount due" → "To download" ("$X or 1 credit" / "1 credit (you have N)"). Button: "Download File". Only sent to users who have used their free downloads; any file size. | `server/scripts/cad_pay_and_download/cad_payment_reminder_email.html`, `server/scripts/cad_pay_and_download/pay_and_download.py` |

Backend API: the converter history now returns `converter_pricing.free_granted`, `uses_free_slot`, `free_slots_remaining` and `free_slots_total` (`server/v1/cadViewer/cadViewer.controller.js`).

---

## 4. Admin controls panel

URL: `/admin` → Admin controls tab · File: `src/Components/AdminPannel/AdminControlsPanel.js` (+ `AdminControlsPanel.module.css`)

| Section | Change |
|---|---|
| Converter free plan | "First N conversions free" → "First N downloads free per user"; hint explains a free download is used only at Download, before credits, re-downloads are free, and lowering N never locks unlocked files. Field "Free conversions per user" → "Free downloads per user". Validation and success toasts reworded. Radio buttons now line up with their labels. New note: in-app text follows the setting (public pages up to 5 min); marketing copy says "first 2" as fixed text. |
| Single download base price | "Charged … when the user has no credits" → "Charged at Download, only after the user's free downloads are used and they have no credits." |
| Credit packs | "Credit pack subscriptions" → "Credit packs (one-time purchase)"; the stacking example uses the real first-pack credits instead of a hardcoded "9"; explains 1 credit = 1 download of any size, used at Download after free downloads. |
