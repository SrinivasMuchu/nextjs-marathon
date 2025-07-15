import React from 'react'
import styles from './termsAndConditions.module.css'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';




function PrivacyPolicy() {

    return (
        <>
           <HomeTopNav />
            <div className={styles['privacy-policy']}>
                <h1>Privacy Policy</h1>


                <h2>Introduction</h2>
                <p>
                    Marathon-OS is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal data when you use our services, including our website, SaaS platform, and other related services (collectively referred to as the “Services”). By using Marathon-OS, you agree to the terms of this Privacy Policy.
                </p>
                <p>
                    If you do not agree to this Privacy Policy, please refrain from using the Services.
                </p>


                <h2>1. Information We Collect</h2>
                <div className={styles['privacy-info']}>
                    <h3>Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, organization details, and any other information you provide.</li>
                        <li><strong>Billing Information:</strong> For payment purposes, we may collect billing details, such as credit card information and billing address.</li>
                        <li><strong>Files and Data:</strong> If you upload files (e.g., CAD designs, STEP files, technical documents), we collect and store those files to provide the core functionalities of Marathon-OS.</li>
                    </ul>


                    <h3>Information We Automatically Collect</h3>
                    <ul>
                        <li><strong>Usage Data:</strong> Information about how you interact with our Services, such as pages viewed, features used, and session durations.</li>
                        <li><strong>Device Information:</strong> Information about the device you use to access Marathon-OS, including IP address, browser type, operating system, and device identifiers.</li>
                        <li><strong>Cookies and Tracking:</strong> We use cookies and similar technologies to track your activity and preferences for a better user experience.</li>
                    </ul>


                    <h3>Information from Third Parties</h3>
                    <ul>
                        <li><strong>Google Drive Integration:</strong> If you connect your Google Drive account, we collect file data, metadata, and folder structure based on the permissions you grant. This data is only accessed for user-specified tasks such as STEP file mapping, folder-specific file organization, and part traceability.</li>
                    </ul>
                </div>




                <h2>2. How We Use Your Information</h2>
                <ul>
                    <li>Provide, maintain, and improve our Services.</li>
                    <li>Enable seamless file management, including linking CAD files to parts and managing BOMs.</li>
                    <li>Ensure secure file access and version control for projects.</li>
                    <li>Communicate with you regarding updates, support, or changes to the Services.</li>
                    <li>Process payments and manage billing.</li>
                    <li>Monitor usage patterns and enhance user experience.</li>
                    <li>Comply with legal obligations and enforce our terms of service.</li>
                </ul>


                <h2>3. How We Share Your Information</h2>
                <div className={styles['privacy-info']}>
                    <p>We do not sell your personal information. We may share your information in the following ways:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> We work with third-party providers to facilitate our Services (e.g., cloud storage, payment processing, and analytics). These providers are bound by strict confidentiality agreements.</li>
                        <li><strong>Legal Compliance:</strong> We may disclose information if required to comply with applicable laws, regulations, or legal proceedings.</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction. We will notify you of any such changes.</li>
                    </ul>




                </div>


                <h2>4. Data Storage and Security</h2>
                <div className={styles['privacy-info']}>
                    <h3>Data Storage</h3>
                    <p>
                        Your data is securely stored on trusted cloud servers. Files and metadata uploaded to Marathon-OS are encrypted and accessible only to authorized users with the appropriate permissions.
                    </p>


                    <h3>Data Security</h3>
                    <p>We implement robust security measures to protect your information, including:</p>
                    <ul>
                        <li>Encryption of data in transit and at rest.</li>
                        <li>Role-based access controls for sensitive files and workflows.</li>
                        <li>Regular security audits and vulnerability assessments.</li>
                    </ul>
                </div>




                <h2>5. Your Rights and Choices</h2>
                <div className={styles['privacy-info']}>
                    <h3>Access and Control</h3>
                    <p>You can view, update, or delete your personal information from your account settings.</p>


                    <h3>Data Portability</h3>
                    <p>Upon request, we will provide you with a copy of your data in a structured format.</p>


                    <h3>Data Deletion</h3>
                    <p>You can request deletion of your account and associated data by contacting us. Please note that certain data may be retained to comply with legal or business obligations.</p>


                </div>


                <h2>6. Cookies and Tracking Technologies</h2>
                <p className={styles['privacy-info']}>
                    We use cookies to enhance your experience and understand user preferences. You can manage your cookie preferences through your browser settings. Note that disabling cookies may impact the functionality of our Services.
                </p>


                <h2>7. Third-Party Links</h2>
                <p className={styles['privacy-info']}>
                    Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                </p>


                <h2>8. Updates to This Privacy Policy</h2>
                <p className={styles['privacy-info']}>
                    We may update this Privacy Policy from time to time. Changes will be effective upon posting on our website. We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>


                <h2>9. Contact Us</h2>
                <p className={styles['privacy-info']}>
                    If you have questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a>.
                </p>
            </div>
            <Footer/>
        </>

    );
};


export default PrivacyPolicy