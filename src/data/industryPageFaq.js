/**
 * FAQ copy for industry CAD viewer landing (Section 9 template), with dynamic industry name
 * and optional role lists from API (`limited_cad_access`).
 */
export function getIndustryCadViewerFaq(industryData) {
  const industry = (industryData?.industry || 'your industry').trim();
  const industryLower = industry.toLowerCase();

  const limited =
    industryData?.limited_cad_access
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const rolesSentence =
    limited.length > 0
      ? `Commonly: ${limited.join(', ')}. These roles often need visibility for decisions, reviews, or execution, even if they don’t edit CAD.`
      : 'Commonly: Sales Engineers, Procurement Managers, Field Technicians. These roles often need visibility for decisions, reviews, or execution, even if they don’t edit CAD.';

  return [
    {
      question: `What CAD file formats are commonly used in ${industryLower}?`,
      answer: `Teams often exchange engineering geometry using STEP and IGES, and use mesh/visualization formats like STL, PLY, or OFF for review. Marathon OS supports STEP, IGES, STL, PLY, OFF, and BREP for in-browser viewing.`,
    },
    {
      question: 'Can I open STEP and IGES files online without CAD software?',
      answer:
        'Yes. Marathon OS lets you upload and preview STEP and IGES files in a browser—useful when reviewers do not need full authoring tools.',
    },
    {
      question: 'Who typically needs access to CAD files but doesn’t have CAD licenses?',
      answer: rolesSentence,
    },
    {
      question: 'What’s the maximum upload size?',
      answer:
        'The viewer messaging on Marathon OS states uploads up to 300 MB. For larger datasets, teams typically split assemblies or use simplified review files.',
    },
    {
      question: 'Will my uploaded files stay private?',
      answer:
        'Marathon OS states uploads are private and automatically deleted after 24 hours, which helps reduce long-term exposure of shared files.',
    },
    {
      question: 'Does this work without downloads or plugins?',
      answer:
        'Yes. The viewer is positioned as browser-based, so teams can preview models without installing desktop software or browser plugins.',
    },
    {
      question: 'Can I use this for faster cross-team reviews?',
      answer:
        'Yes. A single 3D preview helps keep discussions aligned and reduces time spent sharing screenshots or exporting multiple view files.',
    },
    {
      question: 'Is Marathon OS free to try?',
      answer:
        'The site positions the viewer as free to use for online preview, with demo and product options available depending on team needs.',
    },
  ];
}
