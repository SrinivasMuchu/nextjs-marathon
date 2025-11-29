import React from 'react'
import styles from './termsAndConditions.module.css'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';




function PrivacyPolicy() {

    return (
        <>
           {/* <HomeTopNav /> */}
            <div className={styles['privacy-policy']}>
                <h1>Marathon-OS Privacy Policy</h1>
                <p><strong>Last updated: [Date]</strong></p>

                <h2>1. Introduction</h2>
                <p>
                    Marathon‑OS (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and secure your personal and non‑personal data when you access or use our website, mobile applications, marketplace services, and any other associated services (collectively, the &quot;Services&quot;). By accessing or using the Services, you agree to this Privacy Policy. If you do not agree, you must not use the Services.
                </p>


                <h2>2. Information We Collect</h2>
                
                <h3>2.1 Information You Provide</h3>
                <p>We collect information you voluntarily provide to us, including:</p>
                <ul>
                    <li><strong>Account information:</strong> name, email address, organization details, username, and password.</li>
                    <li><strong>Billing and payment information:</strong> billing address, payment method details, invoicing information.</li>
                    <li><strong>Bank account and payout information (Sellers only):</strong> When you add or update your payout or banking details, these are collected through our payment-processing partner Razorpay. Marathon‑OS does not store, process, or have access to your complete bank-account or card details. Such information is securely handled and stored by Razorpay in accordance with PCI-DSS and applicable data-protection regulations. Marathon‑OS only receives a masked or tokenized reference to facilitate payouts.</li>
                    <li><strong>Uploaded content:</strong> CAD files, models, assets, drawings, or other design or technical documents uploaded to the Platform.</li>
                    <li><strong>Communications:</strong> correspondence, support requests, feedback, or survey responses.</li>
                </ul>

                <h3>2.2 Information We Automatically Collect</h3>
                <p>We collect <strong>usage data</strong> (pages viewed, downloads made), <strong>device data</strong> (IP address, browser, OS), and <strong>tracking data</strong> (cookies, beacons) to analyze and improve our Services.</p>

                <h3>2.3 Information from Third Parties</h3>
                <p>We may receive data from <strong>integrations</strong>, <strong>payment processors</strong>, or <strong>public databases</strong> where permitted.</p>




                <h2>3. How We Use Your Information</h2>
                <p>We process your data to:</p>
                <ul>
                    <li>Provide and improve the Services, including CAD file marketplace functionality.</li>
                    <li>Manage accounts, verify identities, process transactions, and remit payouts.</li>
                    <li>Issue invoices to Buyers and Sellers.</li>
                    <li>Communicate updates, provide support, and enforce Terms &amp; Conditions.</li>
                    <li>Prevent fraud, resolve disputes, and comply with law.</li>
                </ul>


                <h2>4. How We Share Your Information</h2>
                <p>We do not sell personal data. We may share information with:</p>
                <ul>
                    <li><strong>Service providers</strong> (payment processors like Razorpay, hosting, analytics, or customer support partners).</li>
                    <li><strong>Legal authorities</strong> when required by law.</li>
                    <li><strong>In the event of a merger or acquisition.</strong></li>
                </ul>
                <p>All service providers are bound by confidentiality and data-protection obligations.</p>


                <h2>5. Data Storage, Security and Retention</h2>
                
                <h3>5.1 Data Storage</h3>
                <p>Data, including uploaded CAD files and metadata, is stored on <strong>secure cloud servers</strong>. We apply <strong>encryption</strong> for data in transit and at rest.</p>

                <h3>5.2 Payment Data Security</h3>
                <p>All payment transactions, including storage of bank-account or card details, are managed by <strong>Razorpay</strong>, a <strong>PCI-DSS Level 1 compliant gateway</strong>. Marathon‑OS does not retain or store any payment-instrument details. All such data is securely encrypted and controlled by Razorpay.</p>

                <h3>5.3 Security Measures</h3>
                <p>We implement <strong>TLS encryption</strong>, <strong>access controls</strong>, <strong>regular audits</strong>, and <strong>backups</strong> to protect your data.</p>

                <h3>5.4 Retention</h3>
                <p>We retain personal data only as long as needed for <strong>business or legal purposes</strong>. Upon account closure, we may retain limited data for audit or legal obligations.</p>




                <h2>6. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar technologies to personalize your experience and analyze usage. You may disable cookies, though this may limit functionality.</p>

                <h2>7. User Rights and Controls</h2>
                <p>Depending on your jurisdiction, you may request access, correction, deletion, restriction, or portability of your personal data. Contact us to exercise these rights.</p>

                <h2>8. Children&apos;s Privacy</h2>
                <p>Our Services are not intended for persons under 18. We do not knowingly collect data from minors.</p>

                <h2>9. International Transfers</h2>
                <p>Your data may be transferred to servers outside your country. We implement appropriate safeguards to ensure compliance with applicable laws.</p>

                <h2>10. Third‑Party Links and Services</h2>
                <p>We are not responsible for the privacy practices of third‑party websites or integrations linked through the Platform.</p>

                <h2>11. Changes to this Privacy Policy</h2>
                <p>We may update this Privacy Policy periodically. Material changes will be notified via email or Platform notice. Continued use constitutes acceptance.</p>

                <h2>12. Contact Information</h2>
                <p>For privacy inquiries or requests, contact:</p>
                <p>
                    📧 <a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a><br/>
                    📍 <strong>Registered Address:</strong> 4th Floor, BS4F, Malibu Towne, Sector 47, Gurgaon, Haryana – 122018, India
                </p>
            </div>
            <Footer/>
        </>

    );
};


export default PrivacyPolicy