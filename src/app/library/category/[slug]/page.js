import { permanentRedirect } from 'next/navigation';

/** Legacy /library/category/{slug} → /library/{slug} */
export default function LibraryCategoryRedirect({ params, searchParams }) {
  const slug = params?.slug;
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value != null && String(value).trim() !== '') {
      q.set(key, String(value));
    }
  }
  const query = q.toString();
  permanentRedirect(query ? `/library/${slug}?${query}` : `/library/${slug}`);
}
