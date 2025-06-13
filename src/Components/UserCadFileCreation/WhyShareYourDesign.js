import React from 'react'
import styles from './UserCadFileUpload.module.css'

function WhyShareYourDesign() {
    return (
        <div className={styles["why-share-your-design-page"]}>
            <h3>Why Share Your Designs on Marathon-OS?</h3>
            <ul>
                <li>🚀 Inspire Others - Share your work to spark new ideas and drive innovation.</li>
                <li>🤝 Help the Community - Support fellow engineers and makers with valuable designs.</li>
                <li>📢 Showcase Your Skills - Build your portfolio and gain visibility in the industry.</li>
                <li>🔗 Connect and Collaborate - Find like-minded professionals and potential partners.</li>
                <li>💡 Contribute to the Ecosystem - Be part of a growing library of open hardware designs.</li>
            </ul>
            <div className={styles["getting-paid-updates"]}>
                <p className={styles["para-getting-paid"]}>🚀 Soon, You&#39;ll Be Getting Paid!</p>
                <p>Monetize your designs and earn from your contributions. Stay tuned for exciting updates!</p>
            </div>
            <div className={styles["stay-updated"]}>
                <p className={styles["para-stay-updates"]}>📬 Stay Updated!</p>
                <p>We will notify you via email once this feature goes live, and you&#39;ll receive regular updates about how many people downloaded your design.</p>
            </div>

        </div>
    )
}

export default WhyShareYourDesign
