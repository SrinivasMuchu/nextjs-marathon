import Link from 'next/link'
import React from 'react'
import styles from './IndustryDesign.module.css'
import { FaStar, FaRegStar } from 'react-icons/fa'
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats'
import NameProfile from '../CommonJsx/NameProfile'
import IndustryDetailsEditButton from './IndustryDetailsEditButton'
import DesignLike from './DesignLike'

function IndustryHeaderDetails({ designData }) {
  const res = designData?.response || {}
  const averageRating = res.average_rating != null ? Number(res.average_rating) : null
  const ratingCount = res.rating_count != null ? Number(res.rating_count) : 0
  const fullStars = averageRating != null ? Math.round(averageRating) : 0
  const displayRating = averageRating != null ? averageRating.toFixed(1) : null

  const categoryLabels = res.category_labels || []
  const tagLabels = res.tag_labels || []
  const allTags = [...categoryLabels, ...tagLabels]
  const hasAuthor = res.fullname
  const hasRating = displayRating != null
  const hasTags = allTags.length > 0
  const showDividerAfterAuthor = hasAuthor && (hasRating || hasTags)
  const showDividerAfterRating = hasRating && hasTags

  return (
    <div className={styles.industryDesignHeaderDetails}>
      <div className={styles.industryDesignHeaderDetailsTitleRow}>
        <h1>{res.page_title}</h1>
        <DesignLike designId={res._id} />
      </div>

      <div className={styles.industryDesignHeaderDetailsMetaRow}>
        {hasAuthor && (
          <>
            <Link href={`/creator/${res.username}`} className={styles.industryDesignHeaderDetailsAuthorLink}>
              <div className={styles.industryDesignHeaderDetailsAuthor}>
                <div className={styles.industryDesignHeaderDetailsAvatar}>
                  <NameProfile
                    userName={res.fullname}
                    width={40}
                    memberPhoto={res.photo}
                  />
                </div>
                <div className={styles.industryDesignHeaderDetailsAuthorText}>
                  <span className={styles.industryDesignHeaderDetailsAuthorName}>{res.fullname}</span>
                  <span className={styles.industryDesignHeaderDetailsAuthorProjects}>
                    {designData.total_files ?? 0} projects
                  </span>
                </div>
              </div>
            </Link>
            {showDividerAfterAuthor && <div className={styles.industryDesignHeaderDetailsDivider} />}
          </>
        )}

        {hasRating && (
          <>
            <div className={styles.industryDesignHeaderDetailsRating}>
              <div className={styles.industryDesignHeaderDetailsStars}>
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= fullStars ? (
                    <FaStar key={i} className={styles.industryDesignHeaderDetailsStarFilled} />
                  ) : (
                    <FaRegStar key={i} className={styles.industryDesignHeaderDetailsStarOutline} />
                  )
                )}
              </div>
              <span className={styles.industryDesignHeaderDetailsRatingValue}>{displayRating}</span>
              <span className={styles.industryDesignHeaderDetailsRatingReviews}>
                ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            {showDividerAfterRating && <div className={styles.industryDesignHeaderDetailsDivider} />}
          </>
        )}

        {hasTags && (
          <div className={styles.industryDesignHeaderDetailsTags}>
            {categoryLabels.map((label, index) => (
              <DesignDetailsStats key={`cat-${index}`} text={label} type="category" />
            ))}
            {tagLabels.map((label, index) => (
              <DesignDetailsStats key={`tag-${index}`} text={label} type="tag" />
            ))}
          </div>
        )}
      </div>

      {res.page_description && <p className={styles.industryDesignHeaderDetailsDescription}>{res.page_description}</p>}

      {res.organization_id && (
        <IndustryDetailsEditButton
          EditableFields={{
            page_title: res.page_title,
            page_description: res.page_description,
            is_downloadable: res.is_downloadable,
            price: res.price,
            supportfile_id: res.supporting_file_id,
            supporting_files: res.supporting_files,
            category_labels: res.source_category_id,
            cad_tags: res.tag_labels,
            _id: res._id,
          }}
          type="design"
          fileId={res._id}
        />
      )}
    </div>
  )
}

export default IndustryHeaderDetails
