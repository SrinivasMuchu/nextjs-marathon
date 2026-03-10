import DesignHubContent from './DesignHubContent'
import styles from './DesignHub.module.css'
import { BASE_URL } from '../../../config'

async function getCategoriesAndDesigns() {
  try {
    const categoriesRes = await fetch(`${BASE_URL}/v1/cad/get-categories`, {
      cache: 'no-store',
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
            )}&limit=16&page=1&random=true`,
            { cache: 'no-store' }
          )

          const designsJson = await designsRes.json()
          const designsData = designsJson?.data?.designDetails || []
          designsByCategory[categoryName] = Array.isArray(designsData)
            ? designsData
            : []
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

const DesignHub = async ({ headingLevel = 2 }) => {
  const { categories, designsByCategory } = await getCategoriesAndDesigns()
  const HeadingTag = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <div className={styles.designHubContainer}>
      <HeadingTag className={styles.designHubHead}>Marathon-OS Design Hub</HeadingTag>
      <p className={styles.designHubDesc}>
        Everything you need to design faster, smarter, and with more impact.
      </p>
      <DesignHubContent
        categories={categories}
        designsByCategory={designsByCategory}
      />
    </div>
  )
}

export default DesignHub
