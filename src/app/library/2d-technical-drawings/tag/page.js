import { permanentRedirect } from 'next/navigation';
import { TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';

/** /library/2d-technical-drawings/tag with no slug → 2D library root */
export default function TwoDLibraryTagIndexPage() {
  permanentRedirect(TWO_D_LIBRARY_BASE);
}
