import { notFound } from 'next/navigation'
import {
  getCadResourceArticle,
  getAllCadResourceSlugs,
} from '@/data/cadResourceArticles/registry'
import CadResourceArticle from '@/Components/CadServicePages/ResourceArticles/CadResourceArticle'

const BASE_URL = 'https://marathon-os.com'

export function generateStaticParams() {
  return getAllCadResourceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const article = getCadResourceArticle(params.slug)
  if (!article) {
    return { title: 'Not found | Marathon OS' }
  }
  return {
    title: article.metadata.title,
    description: article.metadata.description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: `/cad-services/${article.slug}` },
  }
}

export default function CadResourceArticlePage({ params }) {
  const article = getCadResourceArticle(params.slug)
  if (!article) {
    notFound()
  }
  return <CadResourceArticle article={article} />
}
