import { permanentRedirect } from 'next/navigation';

/** Legacy /tags → /library/tags */
export default function LegacyTagsRedirectPage() {
  permanentRedirect('/library/tags');
}
