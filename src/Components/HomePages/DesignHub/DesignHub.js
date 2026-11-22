import DesignHubContent from './DesignHubContent'
import ConverterDesignHubContent from './ConverterDesignHubContent'
import styles from './DesignHub.module.css'
import { BASE_URL } from '../../../config'

const DESIGN_HUB_REVALIDATE_SECONDS = 3600

function categoryKey(category) {
  return category?.industry_category_name || category?.name || ''
}

function resolveInitialCategory(categories, preferredCategory) {
  const preferred = String(preferredCategory || '').trim().toLowerCase()
  if (preferred) {
    const match = categories.find((category) => {
      const name = String(categoryKey(category)).trim().toLowerCase()
      const label = String(
        category?.industry_category_label || category?.title || ''
      ).trim().toLowerCase()
      return name === preferred || label === preferred
    })
    if (match) return categoryKey(match)
  }

  const printing = categories.find((category) =>
    categoryKey(category).toLowerCase().includes('3d printing')
  )
  return categoryKey(printing || categories[0] || {})
}

function withoutCurrentDesign(designs, excludeRoute) {
  const current = String(excludeRoute || '').trim()
  if (!current) return designs
  return designs.filter((design) => String(design?.route || '').trim() !== current)
}

async function getCategoriesAndDesigns(excludeRoute) {
  try {
    const categoriesRes = await fetch(`${BASE_URL}/v1/cad/get-categories`, {
      next: { revalidate: DESIGN_HUB_REVALIDATE_SECONDS },
    })

    const categoriesJson = await categoriesRes.json()
    const categoriesData =
      categoriesJson?.data?.data ||
      categoriesJson?.data ||
      categoriesJson ||
      []

    const categories = Array.isArray(categoriesData) ? categoriesData : []

    const designsByCategory = {}

    await Promise.all(
      categories.map(async (category) => {
        const categoryName = category.industry_category_name || category.name
        if (!categoryName) return

        try {
          const designsRes = await fetch(
            `${BASE_URL}/v1/cad/get-category-design?category=${encodeURIComponent(
              categoryName
            )}&limit=16&page=1&sort=newest`,
            { next: { revalidate: DESIGN_HUB_REVALIDATE_SECONDS } }
          )

          const designsJson = await designsRes.json()
          const designsData = designsJson?.data?.designDetails || []
          designsByCategory[categoryName] = withoutCurrentDesign(
            Array.isArray(designsData) ? designsData : [],
            excludeRoute
          )
        } catch {
          designsByCategory[categoryName] = []
        }
      })
    )

    return { categories, designsByCategory }
  } catch {
    return { categories: [], designsByCategory: {} }
  }
}

const DesignHub = async ({
  headingLevel = 2,
  variant = 'default',
  heading,
  description,
  ctaLabel,
  nosnippet = false,
  category = '',
  excludeRoute = '',
}) => {
  const { categories, designsByCategory } = await getCategoriesAndDesigns(excludeRoute)
  const initialCategory = resolveInitialCategory(categories, category)
  const HeadingTag = headingLevel === 3 ? 'h3' : 'h2'

  if (variant === 'converter') {
    return (
      <ConverterDesignHubContent
        categories={categories}
        designsByCategory={designsByCategory}
        initialCategory={initialCategory}
        headingLevel={headingLevel}
        heading={heading}
        description={description}
        ctaLabel={ctaLabel}
        nosnippet={nosnippet}
      />
    )
  }

  return (
    <div className={styles.designHubContainer}>
      <HeadingTag className={styles.designHubHead}>Marathon-OS Design Hub</HeadingTag>
      <p className={styles.designHubDesc}>
        Everything you need to design faster, smarter, and with more impact.
      </p>
      <DesignHubContent
        categories={categories}
        designsByCategory={designsByCategory}
        initialCategory={initialCategory}
      />
    </div>
  )
}

export default DesignHub
