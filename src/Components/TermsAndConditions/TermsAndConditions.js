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
                Welcome to Marathon-OS, a product and service offered by <strong>MARATHON TECHNOLOGIES PRIVATE LIMITED</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). 
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Marathon-OS platform,
                 including all tools, downloadable CAD files, and future marketplace features.
                 <br/>
                By using Marathon-OS, you agree to be bound by these Terms.

                     </p>
                    <hr/>

                <h2>1.  Overview</h2>
                <p className={styles['privacy-info']}>
                Marathon-OS is a comprehensive digital platform provided by 
                <strong> MARATHON TECHNOLOGIES PRIVATE LIMITED</strong> for managing the complete hardware 
                lifecycle—from engineering to manufacturing to supply chain execution. 
                The platform includes proprietary tools like a CAD viewer, CAD converter,
                 organizational hierarchy creator, engineering BOM modules, and more. 
                 Marathon-OS also serves as a central repository for CAD files that can be 
                 downloaded by users for informational and design purposes.
                 <br/>
                 <br/>
                 The tools and marketplace sections of the platform are currently free to access; 
                 however, access to the hardware platform may be subject to fees and is not free. 
                 Users are expected to comply with all rules and guidelines stated herein.
                 <br/>
                 Marathon-OS provides a suite of tools for hardware lifecycle management, 
                 including engineering, manufacturing, and supply chain modules, along with
                  access to downloadable CAD files. At present, all features and content are 
                  accessible free of charge.



                    
                </p>


                <h2>2. Future Changes and Pricing</h2>
                <p className={styles['privacy-info']}>
                Marathon-OS may introduce paid features or services in the future, including but not limited to:
                </p>
                <ul>
                    <li>Subscription-based access to advanced tools (e.g., CAD viewer, CAD converter, org hierarchy creator).</li>
                    <li>Paid downloads of CAD files.</li>
                    <li>A creator marketplace where users can sell CAD files.</li>
                </ul>
                <p>We reserve the right to change or introduce pricing at any time. Users will be notified in advance of any such changes.
                </p>


                <h2>3.  User-Submitted Content </h2>
                <p className={styles['privacy-info']}>
                Users may upload CAD files to the platform for listing and potential future sale. 
                However, creators are strictly prohibited from uploading any content that is abusive,
                 harmful, or illegal in nature, including but not limited to CAD files representing
                  weapons (e.g., guns, missiles), explosives, or any content that promotes violence, 
                  discrimination, or hate speech. By uploading, users:
                </p>
                <ul>
                    <li>Affirm that they have the rights to share and distribute the content.</li>
                    <li>Grant Marathon-OS a non-exclusive, royalty-free license to display, list, and, in the future, facilitate the sale of the content.</li>
                  
                </ul>
                <p>
                <strong>Important Disclaimer:</strong> Marathon-OS does not conduct background checks or ownership 
                verification for user-submitted CAD files. We disclaim all liability for any 
                infringement or misuse of intellectual property rights related to such content. 
                If you believe any content violates your rights, please contact us.

                </p>

                <h2>4. Intellectual Property</h2>
                
                <p className={styles['privacy-info']}>
                All platform-generated content, features, and software tools are the property of 
                <strong> MARATHON TECHNOLOGIES PRIVATE LIMITED</strong>. All rights not explicitly granted herein are 
                reserved.

                </p>


                


                <h2>5. User Conduct</h2>
                <p className={styles['privacy-info']}>
                You agree not to:
                </p>
                <ul>
                    <li>Violate any applicable laws.</li>
                    <li>Infringe on intellectual property rights.</li>
                    <li>Misrepresent your identity or ownership of uploaded content.</li>
                    <li>Attempt to copy, resell, or exploit the platform without authorization.</li>
                  
                </ul>

                <h2>6. Account Suspension and Termination</h2>
                <p className={styles['privacy-info']}>
                We reserve the right to monitor usage activity and suspend or permanently terminate 
                your account without prior notice if we believe you have violated these Terms or 
                engaged in inappropriate behavior. Grounds for termination include but are not 
                limited to:

                </p>
                <ul>
                    <li>Submitting harmful, illegal, or misleading content.</li>
                    <li>Uploading CAD files that depict weaponry or incite violence.</li>
                    <li>Violating intellectual property rights.</li>
                    <li>Attempting to reverse engineer or exploit our platform
                    We reserve the right to terminate or suspend access to any user for violating these Terms.</li>
                  
                </ul>


                <h2>7. Disclaimers</h2>
                <p className={styles['privacy-info']}>
                The platform and all files/tools are provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, 
                completeness, or usefulness of any content, including CAD files.
                </p>
                <h2>8. Limitation of Liability</h2>
                <p className={styles['privacy-info']}>
                To the maximum extent permitted by law, <strong> MARATHON TECHNOLOGIES PRIVATE LIMITED</strong> shall 
                not be liable for any indirect, incidental, or consequential damages arising from use of the platform.

                </p>
                <h2>9. Contact</h2>
                <p className={styles['privacy-info']}>
                    If you have questions, concerns, or complaints regarding these Terms or your 
                    experience with the Marathon-OS platform, you may reach us at:&nbsp;
                    <a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a><br />
                    For questions or complaints, email:&nbsp;
                    <a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a>
                    </p>

                
            </div>
        <Footer/>
        </>

    );
};





export default TermsAndCondition