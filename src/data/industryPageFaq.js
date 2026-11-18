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
        'Uploads are supported up to 300 MB. For larger datasets, teams typically split assemblies or use simplified review files.',
    },
    {
      question: 'Will my uploaded files stay private?',
      answer:
        'Uploads use HTTPS. Files stay private and are deleted automatically after 7 days. See the Privacy Policy for details.',
    },
    {
      question: 'Does this work without downloads or plugins?',
      answer:
        'Yes. The viewer runs in the browser, so you can preview models without installing desktop CAD software or browser plugins.',
    },
    {
      question: 'Can I use this for cross-team reviews?',
      answer:
        'Yes. Share one browser link to a 3D preview so reviewers can inspect the same model without exchanging screenshots or extra view exports.',
    },
    {
      question: 'Is Marathon OS free to try?',
      answer:
        'Yes. You can preview CAD files online for free, with uploads up to 300 MB. Paid product options are available when a team needs more than online preview.',
    },
  ];
}
