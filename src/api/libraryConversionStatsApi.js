import axios from 'axios';
import { BASE_URL } from '@/config';

/**
 * Last-30-day promotion stats for library design pages.
 * Includes CAD format conversions + 2D drawing (TechDraw) conversions from all users.
 * GET /v1/cad/library-conversion-stats?file_type=step&include_2d_pdf=1
 *
 * Response shape:
 * {
 *   period_days, from_format,
 *   total_conversions, // all converter jobs + all techdraw jobs
 *   converter_conversions, drawing_conversions,
 *   routes: [{ from, to, count, percent, kind, href }],
 *   chart_routes: [{ from, to, count, percent, kind, href }]
 *     // top 2 converts + STEP → 2D PDF (ok on any design format page)
 * }
 */
export async function fetchLibraryConversionStats({
  fileType = 'step',
  include2dPdf = true,
} = {}) {
  if (!BASE_URL) throw new Error('App API URL is not configured.');
  const params = new URLSearchParams();
  params.set('file_type', String(fileType || 'step'));
  params.set('include_2d_pdf', include2dPdf ? '1' : '0');

  const { data } = await axios.get(
    `${BASE_URL}/v1/cad/library-conversion-stats?${params.toString()}`,
    { timeout: 20_000 },
  );

  if (!data?.meta?.success) {
    throw new Error(data?.meta?.message || 'Failed to load conversion stats.');
  }

  return (
    data.data || {
      total_conversions: 0,
      converter_conversions: 0,
      drawing_conversions: 0,
      routes: [],
      chart_routes: [],
    }
  );
}
