import React from 'react'
import styles from './termsAndConditions.module.css'
import Footer from '../HomePages/Footer/Footer'

function RefundPolicy() {
  return (
    <div className={styles.pageRoot}>
      <div className={styles.pageContent}>
        <div className={styles['privacy-policy']}>
          <h1>Refund Policy</h1>
          <p>
            At present, Marathon-OS does not charge for access to its tools or for
            downloading CAD files via the marketplace. However, the hardware platform
            offered as part of Marathon-OS is a paid service. Therefore, there are no
            purchases eligible for refunds at this time.
            <br />
            Once monetization features are introduced, the refund policy will be updated
            accordingly. The general principles will be:
          </p>
          <ol>
            <li>
              <strong>Digital Products:</strong> Due to the nature of digital downloads, all
              purchases of CAD files or similar assets will be considered final and
              non-refundable unless otherwise specified.
            </li>
            <li>
              <strong>Subscription Services (if any):</strong>
              Any future subscription charges will be subject to clear cancellation terms,
              and partial refunds may not be provided for unused periods unless required by
              law.
            </li>
            <li>
              <strong>Creator Transactions:</strong>
              Marathon-OS acts as an intermediary platform. Buyers are responsible for
              verifying creator content and <strong>MARATHON TECHNOLOGIES PRIVATE LIMITED</strong>{' '}
              does not guarantee refunds for disputes unless they involve clear violation of
              platform policy.
            </li>
          </ol>
          For any future refund-related concerns, please contact:{' '}
          <a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RefundPolicy

