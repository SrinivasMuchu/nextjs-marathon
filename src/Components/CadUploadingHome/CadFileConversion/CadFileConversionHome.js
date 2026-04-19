import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import React from 'react'
import OrgFeatures from '@/Components/OrganizationHome/OrgFeatures/OrgFeatures'
import ChartBuilder from '@/Components/OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '@/Components/OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '@/Components/OrganizationHome/OrgFaq/OrgFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadFileConversionHeader from './CadFileConversionHeader'
import CadFileConversionHowItWorks from './CadFileConversionHowItWorks'
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
import { cadConverterFaqQuestions } from '@/data/cadToolFaqs'
import ToolsPageBanner from '@/Components/CadServicesBanners/ToolsPageBanner'

// Page heading structure: 1 h1 (CadFileConversionHeader); h2 (HowItWorks, CoreBenefits, CadConverterTypes); rest h3 (InterlinkingBlocks, TrustPrivacy, DesignHub, OrgFaq).
// “How it works” with react-icons lives in CadFileConversionHowItWorks (client) so icon components are not passed from this Server Component.

const converterBenefits = [
    { icon: 'zap', title: 'Lightning-fast conversion', description: 'Convert in seconds with our cloud-based engine. No waiting.' },
    { icon: 'monitorSmartphone', title: 'No installation required', description: 'Works in your browser — no downloads or plugins needed.' },
    { icon: 'cpu', title: 'Handles large & complex models', description: 'Optimized for large and intricate CAD files up to 300 MB.' },
    { icon: 'shield', title: 'Secure & private', description: 'Encrypted uploads. Files automatically deleted after 24 hours.' },
    { icon: 'lock', title: 'Your files, your IP', description: 'Full file ownership stays with you. We never share your data.' },
    { icon: 'clock', title: 'Available 24/7', description: 'Convert files anytime, anywhere — no restrictions.' },
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
            <FaqPageJsonLd faqSchemaData={cadConverterFaqQuestions} />
            {/* <HomeTopNav /> */}
            {!convert && (
                <ActiveLastBreadcrumb
                    variant="dark"
                    links={[
                        { label: 'tools', href: '/tools' },
                        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                    ]}
                />
            )}
            {convert && (
                <ActiveLastBreadcrumb
                    variant="dark"
                    links={[
                        { label: 'tools', href: '/tools' },
                        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                        { label: `${conversionParams}`, href: `/tools/convert-${conversionParams}` },
                    ]}
                />
            )}
            <CadFileConversionHeader convert={convert} conversionParams={conversionParams} />
            <ConversionQualityNotes />
            <ToolsPageBanner />
          
            {/* <OrgFeatures type='cad' /> */}
            <InterlinkingBlocks />
            <CadFileConversionHowItWorks />
            <CoreBenefits
                title="Why use Marathon OS 3D CAD File Converter"
                benefits={converterBenefits}
                variant="cardGrid"
            />
          
            <TrustPrivacy title="Privacy and file handling" items={converterTrustItems} />
            {conversionParams && <CadConverterFormateText conversionParams={conversionParams} />}
            {/* <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails} /> */}
            {/* <FeaturedConversions /> */}
            <CadConverterTypes />
            <DesignHub headingLevel={3} />
            <OrgFaq
                faqQuestions={cadConverterFaqQuestions}
                description="Find answers to common questions about Marathon OS 3D CAD File Converter."
            />
            <Footer />
        </>

    )
}

export default CadFileConversionHome