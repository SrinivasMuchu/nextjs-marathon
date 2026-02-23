import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import React from 'react'
import CadHeader from './CadHeader'
import OrgFeatures from '@/Components/OrganizationHome/OrgFeatures/OrgFeatures'
import ChartBuilder from '@/Components/OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '@/Components/OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '@/Components/OrganizationHome/OrgFaq/OrgFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadUpload from '../CadUpload/CadUpload'
import HowItWorks from '../CadUpload/HowItWorks'
import CoreBenefits from '../CadUpload/CoreBenefits'
import UseCases from '../CadUpload/UseCases'
import TrustPrivacy from '../CadUpload/TrustPrivacy'
import ConvertCrossLink from '../CadUpload/ConvertCrossLink'
import CadIndustry from './CadIndustry'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import CadViewrTypes from './CadViewrTypes'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd'
import { IMAGEURLS } from '@/config'

// Page heading structure: 1 h1 (CadHeader), 2 h2s (HowItWorks, CoreBenefits), rest h3 (CadViewrTypes, DesignHub, UseCases, TrustPrivacy, ConvertCrossLink, CadIndustry, OrgFaq).



const features = [
    {
        title: 'Seamless CAD File Import',
        description: 'Upload STEP, IGES, STL, BREP, and more for instant visualization without delays.'
    },
    {
        title: 'Handles Large & Complex Models',
        description: 'Powered by a proprietary rendering engine, ensuring zero lag even for intricate designs.'
    },
    {
        title: 'No Installation Required',
        description: 'View 3D models directly in your browser—no downloads or plugins needed.'
    },
    {
        title: 'Secure & Privacy-Focused',
        description: "Your files are encrypted, private, and automatically deleted after 24 hours for security."
    },
   
]
const faqQuestions = [
    {
        question: "What is a CAD viewer?",
        answer: "A CAD viewer lets you open and preview 2D/3D CAD files without editing them—useful for quick reviews and sharing.",
    },
    {
        question: "Can I open STEP and IGES files online?",
        answer: "Yes—upload your .step/.stp or .igs/.iges file to preview it directly in your browser.",
    },
    {
        question: "Do I need to install any software?",
        answer: "No. Marathon OS CAD Viewer is browser-based—no downloads required.",
    },
    {
        question: "Which file formats are supported?",
        answer: "STEP/STP, IGES/IGS, STL, OBJ, PLY, OFF, BREP.",
    },
    {
        question: "Is this CAD viewer free?",
        answer: "Yes—this page is presented as a Free Online CAD Viewer, with usage constraints like an upload size limit (up to 300 MB per file).",
    },
    {
        question: "What is the max file size?",
        answer: "Up to 300 MB per upload.",
    },
    {
        question: "Will my file stay private?",
        answer: "Files stay private, are encrypted, and are automatically deleted after 24 hours; see the Privacy Policy for details.",
    },
    {
        question: "Why does my model look broken (holes/missing faces)?",
        answer: "Some CAD exchange formats (especially surface-based files like IGES) may import with gaps. Try converting to STEP or re-exporting with healed/stitched surfaces.",
    },
    {
        question: "Can I convert my file to another format?",
        answer: "Yes—use the 3D File Converter at /tools/3d-cad-file-converter.",
    },
    {
        question: "Does it work on Mac / Windows?",
        answer: "Yes—because it runs in your browser (no installation needed), it works on Mac and Windows with a modern browser.",
    },
];
const whyChoose = {
    title: 'Why Choose Marathon OS CAD Viewer?',
    description: 'Marathon OS CAD Viewer renders any CAD file instantly with a proprietary engine, ensuring seamless, lag-free visualization—no matter the model size.'
}
const essentialDeatails = {
    title: 'Essential Features of Marathon OS  CAD Viewer',
    description: 'Effortlessly upload and view CAD files with a high-speed, secure, and scalable tool. Experience smooth, real-time rendering—no software installation required.'
}

const featuresArray = [
    {
        title: 'Lightning-Fast Rendering',
        description: 'Marathon OS optimizes real-time CAD visualization with smooth performance, even for large and intricate models.'
    },
    {
        title: 'Supports Multiple Formats',
        description: ' View STEP, IGES, STL, BREP, and more with precision and clarity—right in your browser.'
    },
    {
        title: 'No Installation Required',
        description: 'Skip heavy software—just upload and start viewing instantly.'
    },
    {
        title: 'Cloud-Based & Secure',
        description: "Files stay private and automatically delete after 24 hours for security."
    },
    {
        title: 'Engineered for Professionals',
        description: 'Designed for engineers, manufacturers, and designers needing quick, high-quality CAD previews.'
    },

]



const steps = [
    {
      title: 'Upload your CAD file',
      description: 'Drag & drop or browse to upload',
      text: 'Upload your CAD file (drag & drop)',
      image: IMAGEURLS.cadFileUpload,
    },
    {
      title: 'Preview in browser',
      description: 'View, zoom, pan and inspect',
      text: 'Preview your model in the browser',
      image: IMAGEURLS.cadFilePreview,
    },
    {
      title: 'Share or convert',
      description: 'Download or convert to another format',
      textPrefix: 'Share or convert if needed—use the ',
      link: { href: '/tools/3d-cad-file-converter', label: 'converter tool' },
      image: IMAGEURLS.cadFileShareConversion,
    },
  ];


  const benefits = [
    {
      title: 'Instant preview',
      description: 'Quickly open and inspect CAD files without installing heavy software.',
    },
    {
      title: 'Anywhere access',
      description: 'Review models from any device (desktop or mobile).',
    },
    {
      title: 'Format support',
      description: 'Common exchange formats supported in one viewer.',
    },
    {
      title: 'Faster collaboration',
      description: 'Share files with teammates for quick review.',
    },
  ];

  const items = [
    {
      title: 'Private uploads',
      description: 'Files are processed securely.',
    },
    {
      title: 'Retention',
      description: 'Files are deleted after 24 hours immediately.',
    },
    {
      title: 'Ownership',
      description: 'You retain full ownership of your files.',
    },
  ];

  const useCases = [
    { title: 'Mechanical engineers reviewing STEP/IGES from vendors', description: 'reviewing STEP/IGES from vendors' },
    { title: 'Manufacturing teams checking files before quoting', description: 'checking files before quoting' },
    { title: 'Design teams quickly sharing 3D previews internally', description: 'quickly sharing 3D previews internally' },
    { title: 'Students opening CAD files without expensive software', description: 'opening CAD files without expensive software' },
    { title: '3D printing workflows inspecting STL/OBJ meshes', description: 'inspecting STL/OBJ meshes' },
  ];
function CadHomeDesign({type}) {
   
    return (
        <>
            <FaqPageJsonLd faqSchemaData={faqQuestions} />
            {/* <HomeTopNav /> */}
             <ActiveLastBreadcrumb
                      links={[
                        { label: 'CAD viewer', href: '/tools//3D-cad-viewer' },       

                      ]}
                    />
            {type?<CadUpload type={type}/>: <CadHeader type={type}/>}
            
            <OrgFeatures type='cad'/>
            <HowItWorks
            label="HOW IT WORKS"
            mainHeading="No downloads. No plugins. Works right from your browser."
            title="How to view CAD files online"
            steps={steps}
            primaryCta={{ label: 'Upload CAD File', href: '/tools/3D-cad-viewer' }}
            secondaryCta={{ label: 'Open converter tool', href: '/tools/3d-cad-file-converter' }}
          />
            <CoreBenefits benefits={benefits} title="Why use Marathon OS CAD Viewer" />
           
            <CadViewrTypes/>
            <DesignHub headingLevel={3} />
            <UseCases useCases={useCases} title="Who this CAD viewer is for" />
            <TrustPrivacy items={items} title="Privacy and file handling" />
            <ConvertCrossLink />
            <CadIndustry/>
            {/* <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails}/> */}
            <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS CAD Viewer. Whether you're getting started or looking for advanced features, we've got you covered."/>
            <Footer />
        </>

    )
}

export default CadHomeDesign