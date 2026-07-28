import CadServices from '@/Components/CadServicePages/CadServices';
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd';
import SoftwareApplicationJsonLd from '@/Components/JsonLdSchemas/SoftwareApplicationJsonLd';
import { cadServicesFaqQuestions } from '@/data/cadServicesFaqs';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const SITE = 'https://marathon-os.com';
const CANONICAL_PATH = '/cad-services';
const TITLE = 'Find the Right CAD Agency for Your Project | Marathon OS';
const DESCRIPTION =
  'Share your CAD requirement once. Marathon matches you with relevant CAD agencies from a network of 1,000+ partners, helps you compare options and keeps sensitive project details controlled until you choose.';

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
        name="Marathon OS CAD Agency Matching"
        url={`${SITE}${CANONICAL_PATH}`}
        description="Share one CAD brief. Marathon matches you with relevant agencies from a network of 1,000+ partners and helps you compare the best-fit options."
      />
      <CadServices />
    </>
  );
}
