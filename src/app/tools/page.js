import ToolsHubPage from '@/Components/ToolsHub/ToolsHubPage';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const CANONICAL_PATH = '/tools';
const TITLE = 'Free CAD Tools — Viewer, Converter & Org Chart | Marathon OS';
const DESCRIPTION =
  'Explore Marathon OS tools: browser-based 3D CAD viewer, online file converter, and organization chart maker. Built for engineering and hardware teams.';

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  canonicalPath: CANONICAL_PATH,
});

export default function ToolsIndexPage() {
  return <ToolsHubPage />;
}
