import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import React from 'react'
import OrgFeatures from '@/Components/OrganizationHome/OrgFeatures/OrgFeatures'
import ChartBuilder from '@/Components/OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '@/Components/OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '@/Components/OrganizationHome/OrgFaq/OrgFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadFileConversionHeader from './CadFileConversionHeader'
import HowItWorks from '../CadUpload/HowItWorks'
import CoreBenefits from '../CadUpload/CoreBenefits'
import TrustPrivacy from '../CadUpload/TrustPrivacy'
import CadConverterTypes from './CadConverterTypes'
import FeaturedConversions from './FeaturedConversions'
import InterlinkingBlocks from './InterlinkingBlocks'
import CadConverterFormateText from './CadConverterFormateText'
import ConversionQualityNotes from '../CadUpload/ConversionQualityNotes'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd'
import { IMAGEURLS } from '@/config'

// Page heading structure: 1 h1 (CadFileConversionHeader), 2 h2s (HowItWorks, CoreBenefits), rest h3 (ConversionQualityNotes, InterlinkingBlocks, TrustPrivacy, CadConverterTypes, DesignHub, OrgFaq).
const converterSteps = [
    { text: 'Upload your CAD file (drag & drop)',image: IMAGEURLS.cadFileUpload },
    { text: 'Choose the output format (STEP / IGES / STL / OBJ / PLY / OFF / BREP)',image: IMAGEURLS.cadFileFormat },
    { text: 'Convert and download instantly',image: IMAGEURLS.cadFileDownload },
];

const converterBenefits = [
    { title: 'Lightning-fast conversion (seconds, cloud-based)', description: 'Convert in seconds with our cloud-based engine.' },
    { title: 'Handles large & complex models', description: 'Optimized for large and intricate CAD files.' },
    { title: 'No installation required', description: 'Works in your browser—no downloads or plugins.' },
    { title: 'Secure & private (encrypted upload + delete after 24 hours)', description: 'Your files are encrypted and automatically removed after 24 hours.' },
];

const converterTrustItems = [
    { title: 'Encrypted uploads + secure processing', description: 'Files are encrypted during upload and processed securely.' },
    { title: 'Automatic deletion after 24 hours', description: 'Uploads are automatically deleted after 24 hours.' },
    { title: 'File ownership stays with you', description: 'You retain full ownership of your files.' },
];

const features = [
    {
        title: 'Seamless CAD File Conversion',
        description: 'Convert STEP, IGES, STL, BREP, OBJ, PLY, OFF and more—instantly and without setup delays.'
    },
    {
        title: 'Handles Large & Complex Models',
        description: 'Optimized to convert even intricate engineering models with accuracy and speed—no matter the size or complexity.'
    },
    {
        title: 'No Installation Required',
        description: 'Convert 3D files directly from your browser. No downloads, no plugins—just drag, drop, and go.'
    },
    {
        title: 'Secure & Privacy-Focused',
        description: "Your files are encrypted during upload, processed securely, and automatically deleted after 24 hours to protect your data."
    },

]
const faqQuestions = [
    {
        question: "What is Marathon OS 3D CAD File Converter?",
        answer: "Marathon OS 3D File Converter is a browser-based tool that lets you convert CAD/3D file formats online—no software installation needed.",
    },
    {
        question: "What file formats are supported?",
        answer: "STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), DWG (.dwg), DXF (.dxf).",
    },
    {
        question: "Is Marathon OS 3D File Converter free to use?",
        answer: "Yes! It’s completely free with no usage limits or hidden costs. Just drag, drop, and convert.",
    },
    {
        question: "How is my data stored and secured?",
        answer: "Your files are encrypted during upload, processed securely, and automatically deleted after 24 hours.",
    },
    {
        question: "Do I need any special software or training?",
        answer: "No—just upload your file and convert it directly in your browser (no downloads/plugins).",
    },
    {
        question: "Can I convert large and complex CAD models?",
        answer: "Yes—the page states it's optimized to handle large & complex models, and supports uploads up to 300 MB.",
    },
    {
        question: "What is the max file size?",
        answer: "You can upload files up to 300 MB.",
    },
];
const whyChoose = {
    title: 'Why Choose Marathon OS 3D CAD File Converter?',
    description: 'Marathon OS lets you convert 3D CAD files between formats effortlessly with a powerful, cloud-native engine—fast, secure, and optimized for professionals.'
}
const essentialDeatails = {
    title: 'Essential Features of Marathon OS 3D CAD File Converter',
    description: 'Effortlessly convert 3D CAD files with a fast, secure, and scalable cloud tool. Experience seamless format conversion—no software installation required.'
}

const featuresArray = [
    {
        title: 'Lightning-Fast Conversion',
        description: 'Convert your 3D CAD files in seconds, no matter the size or complexity. Marathon OS uses a high-performance backend to deliver rapid results.'
    },
    {
        title: 'No Software Installation',
        description: 'Forget bulky desktop tools—just upload your file and convert directly from your browser.'
    },
    {
        title: 'Engineered for Professionals',
        description: 'Built for engineers, designers, and manufacturers who need reliable, high-quality conversions to suit their workflows.'
    },
    {
        title: 'Supports Multiple Formats',
        description: "Convert between STEP, IGES, STL, OBJ, PLY, OFF, and BREP formats—all from a single, unified interface."
    },
    {
        title: 'Cloud-Based & Private',
        description: 'All files are securely processed in the cloud and automatically deleted after 24 hours to ensure your data stays safe.'
    },

]

function CadFileConversionHome({ convert, conversionParams }) {

    return (
        <>
            <FaqPageJsonLd faqSchemaData={faqQuestions} />
            {/* <HomeTopNav /> */}
            {!convert && <ActiveLastBreadcrumb links={[

                { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
            ]} />}
            {convert && <ActiveLastBreadcrumb links={[
                { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                { label: `${conversionParams}`, href: `/tools/convert-${conversionParams}` },
            ]} />}
            <CadFileConversionHeader convert={convert} conversionParams={conversionParams} />

            <OrgFeatures type='cad' />
            <ConversionQualityNotes />
            <InterlinkingBlocks />
            <HowItWorks title="How to convert CAD files online" steps={converterSteps} />
            <CoreBenefits title="Why use Marathon OS 3D CAD File Converter" benefits={converterBenefits} />
          
            <TrustPrivacy title="Privacy and file handling" items={converterTrustItems} />
            {conversionParams && <CadConverterFormateText conversionParams={conversionParams} />}
            {/* <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails} /> */}
            {/* <FeaturedConversions /> */}
            <CadConverterTypes />
            <DesignHub headingLevel={3} />
            <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS 3D CAD File Converter. Whether you're getting started or looking for advanced features, we've got you covered." />
            <Footer />
        </>

    )
}

export default CadFileConversionHome