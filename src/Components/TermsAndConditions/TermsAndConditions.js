import React from 'react'
import styles from './termsAndConditions.module.css'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';





function TermsAndCondition() {
  
    return (
        <>
            

        <HomeTopNav />
           
            <div className={styles['privacy-policy']}>
                <h1>Terms of Service</h1>
                <p>
                    PLEASE READ THESE TERMS CAREFULLY. BY ELECTRONICALLY ACCEPTING, EXECUTING, OR USING THE MARATHON-OS SERVICES OR SOFTWARE
                    (COLLECTIVELY, THE &quot;SERVICE&quot;), YOU AGREE TO BE BOUND BY THESE TERMS (THE &quot;AGREEMENT&quot;). IF YOU DO NOT ACCEPT THESE TERMS,
                    YOU ARE NOT PERMITTED TO USE THE SERVICE. IF YOU ENTER THIS AGREEMENT AS AN EMPLOYEE OR REPRESENTATIVE OF YOUR ORGANIZATION,
                    &quot;YOU&quot; INCLUDES YOUR ORGANIZATION AND ANY OTHER PARTY ON WHOSE BEHALF YOU ACT.
                </p>


                <h2>1. Provision of Service</h2>
                <p className={styles['privacy-info']}>
                    This Agreement describes the terms and conditions under which Marathon-OS will provide its Service, a Software-as-a-Service
                    (&quot;SaaS&quot;) platform designed to streamline workflows, manage data, and enhance organizational processes across various industries.
                    Subject to your acceptance of this Agreement, payment of applicable fees (if any), and compliance with these terms, Marathon-OS
                    grants you access to the Service.
                </p>


                <h2>2. Software License</h2>
                <p className={styles['privacy-info']}>
                    Subject to this Agreement, Marathon-OS grants you a non-exclusive, non-transferable license to access and use the Service and its
                    accompanying documentation (&quot;Documentation&quot;) solely for internal business purposes. All rights to the Service and Documentation
                    remain with Marathon-OS, and you acquire no ownership rights except the limited license described herein.
                </p>


                <h2>3. Your Systems</h2>
                <p className={styles['privacy-info']}>
                    The Service is accessed via your IT systems (&quot;Customer Systems&quot;). By entering this Agreement, you grant Marathon-OS the necessary
                    access to these systems for providing the Service. You are responsible for maintaining the security, updates, and compatibility
                    of your Customer Systems, including internet browsers, operating systems, and antivirus software.
                </p>


                <h2>4. Third-Party Services and Data</h2>
                <h3 className={styles['privacy-info']}>Third-Party Services</h3>
                <p className={styles['privacy-info']}>
                    Marathon-OS may integrate with third-party services to enhance functionality. These services are not under the control of Marathon-OS,
                    and we disclaim any liability or warranty regarding their performance.
                </p>


                <h3 className={styles['privacy-info']}>Third-Party Data</h3>
                <p className={styles['privacy-info']}>
                    If you choose to integrate or import third-party data into Marathon-OS, you represent and warrant that you have the legal right to do so.
                    You agree to indemnify Marathon-OS against any claims arising from unauthorized use of such data.
                </p>


                <h2>5. Your Data and Confidentiality</h2>
                <p className={styles['privacy-info']}>
                    Marathon-OS may access data stored on your Customer Systems (&quot;Customer Data&quot;) to deliver the Service. You represent and warrant that you
                    have obtained all necessary rights to use such data and that its use by Marathon-OS complies with applicable laws.
                </p>


                <h2>6. Feedback</h2>
                <p className={styles['privacy-info']}>
                    By providing feedback or usage data (&quot;Evaluation Data&quot;) about the Service, you grant Marathon-OS the right to use such data to improve the Service. This includes system errors, performance metrics, and user experience insights. Marathon-OS retains exclusive rights to all such data.


                </p>


                <h2>7. Restrictions</h2>
                <ul>
                    <li>You may NOT copy, modify, or distribute the software or documentation.</li>
                    <li>You may NOT use the Service for competitive purposes or to provide services to third parties.</li>
                    <li>You may NOT reverse-engineer, decompile, or disassemble the software.</li>
                    <li>You may NOT export the software or documentation in violation of applicable laws.</li>
                </ul>
                <h2>8. Ownership</h2>
                <p className={styles['privacy-info']}>
                    All rights, including intellectual property, to the Service, Documentation, and aggregated data generated by the Service remain with Marathon-OS. You may not transfer, sublicense, or disclose these materials to third parties.




                </p>
                <h2>9. Term and Termination</h2>
                <p className={styles['privacy-info']}>
                    This Agreement remains effective as long as you use the Service or until terminated. Marathon-OS may terminate this Agreement if you
                    breach its terms or for convenience with prior notice.
                </p>
                <h2>10. Renewal of Service</h2>
                <p className={styles['privacy-info']}>
                    Subscriptions renew automatically for successive terms unless you cancel by providing written notice at least five (5) days before the renewal date for monthly subscriptions or thirty (30) days for annual subscriptions. Renewals are charged at Marathon-OS’s current rates.


                </p>
                <h2>11. Support</h2>
                <p className={styles['privacy-info']}>
                    Marathon-OS provides reasonable support through its support channels, including email. However, no guarantees are made regarding specific
                    service levels or response times.
                </p>


                <h2>12. Warranty Disclaimer</h2>
                <p className={styles['privacy-info']}>
                    Marathon-OS provides the Service &quot;AS IS&quot; without any express or implied warranties, including but not limited to warranties of
                    merchantability, fitness for a particular purpose, or non-infringement.
                </p>


                <h2>13. Limitation of Liability</h2>
                <p className={styles['privacy-info']}>
                    To the extent permitted by law, Marathon-OS&apos;s liability for any damages related to this Agreement is limited to the amount you paid for
                    the Service in the twelve (12) months preceding the claim. Marathon-OS is not liable for indirect, incidental, or consequential damages.
                </p>


                <h2>14. Entire Agreement</h2>
                <p className={styles['privacy-info']}>
                    This Agreement constitutes the entire understanding between you and Marathon-OS regarding the Service and supersedes all prior agreements.
                    Amendments must be in writing and signed by both parties.
                </p>
            </div>
        <Footer/>
        </>

    );
};





export default TermsAndCondition