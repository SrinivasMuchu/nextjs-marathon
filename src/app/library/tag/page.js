import { permanentRedirect } from 'next/navigation';

/** /library/tag with no slug → 3D library root */
export default function LibraryTagIndexPage() {
  permanentRedirect('/library');
}
