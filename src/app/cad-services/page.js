import CadServices from '@/Components/CadServicePages/CadServices';
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import { cadServicesFaqQuestions } from '@/data/cadServicesFaqs';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const SITE = 'https://marathon-os.com';
const CANONICAL_PATH = '/cad-services';
const TITLE = 'Expert CAD Outsourcing Services — Get Designs in 24 Hours | Marathon OS';
const DESCRIPTION =
  'Vetted CAD designers on demand. Get SolidWorks, AutoCAD, Revit & Fusion 360 files delivered in 24 hrs. No hiring, no overhead. Get a quote today on Marathon OS';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: CANONICAL_PATH,
});

export default function CadServicesPage() {
  return (
    <>
      <FaqPageJsonLd faqSchemaData={cadServicesFaqQuestions} />
      <SoftwareApplicationJsonLd
        name="Marathon OS CAD Outsourcing Services"
        url={`${SITE}${CANONICAL_PATH}`}
        description="On-demand CAD outsourcing with vetted designers. SolidWorks, AutoCAD, Revit, Fusion 360 and more — production-ready files in as little as 24 hours."
      />
      <CadServices />
    </>
  );
}
