import { notFound } from 'next/navigation'
import { ASSET_PREFIX_URL } from '@/config'
import {
  getCadResourceArticle,
  getAllCadResourceSlugs,
} from '@/data/cadResourceArticles/registry'
import {
  CAD_RESOURCE_AUTHOR,
  CAD_RESOURCE_MODIFIED_AT,
  CAD_RESOURCE_PUBLISHED_AT,
} from '@/data/cadResourceArticles/schema'
import CadResourceArticle from '@/Components/CadServicePages/ResourceArticles/CadResourceArticle'
import { buildArticleSchema, jsonLdScriptProps, SITE_URL } from '@/lib/seo/schema'

const BASE_URL = 'https://marathon-os.com'
const OG_IMAGE = `${ASSET_PREFIX_URL}logo-1.png`

export function generateStaticParams() {
  return getAllCadResourceSlugs().map((slug) => ({ slug }))
}

function articleDates(article) {
  return {
    publishedAt: article.publishedAt || CAD_RESOURCE_PUBLISHED_AT,
    modifiedAt: article.modifiedAt || CAD_RESOURCE_MODIFIED_AT,
    authorName: article.author?.name || CAD_RESOURCE_AUTHOR.name,
    authorUrl: article.author?.url || CAD_RESOURCE_AUTHOR.url,
  }
}

export async function generateMetadata({ params }) {
  const article = getCadResourceArticle(params.slug)
  if (!article) {
    return { title: 'Not found | Marathon OS' }
  }
  const { publishedAt, authorName } = articleDates(article)
  const canonical = `/resources/${article.slug}`
  return {
    title: article.metadata.title,
    description: article.metadata.description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical },
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      url: canonical,
      siteName: 'Marathon OS',
      type: 'article',
      publishedTime: publishedAt,
      authors: [authorName],
      images: [{ url: OG_IMAGE, width: 1200, height: 630, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metadata.title,
      description: article.metadata.description,
      images: [OG_IMAGE],
    },
  }
}

export default function CadResourceArticlePage({ params }) {
  const article = getCadResourceArticle(params.slug)
  if (!article) {
    notFound()
  }
  const { publishedAt, modifiedAt, authorName, authorUrl } = articleDates(article)
  const articleSchema = buildArticleSchema({
    headline: article.hero.title,
    description: article.metadata.description,
    url: `${SITE_URL}/resources/${article.slug}`,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    authorName,
    authorUrl,
    image: OG_IMAGE,
  })

  return (
    <>
      <script {...jsonLdScriptProps(articleSchema)} />
      <CadResourceArticle article={article} />
    </>
  )
}
