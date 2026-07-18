import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import React from 'react'
import OrgFeatures from '@/Components/OrganizationHome/OrgFeatures/OrgFeatures'
import ChartBuilder from '@/Components/OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '@/Components/OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '@/Components/OrganizationHome/OrgFaq/OrgFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadFileConversionHeader from './CadFileConversionHeader'
import CadFileConversionHowItWorksServer from './CadFileConversionHowItWorksServer'
import CoreBenefits from '../CadUpload/CoreBenefits'
import TrustPrivacy from '../CadUpload/TrustPrivacy'
import CadConverterTypes from './CadConverterTypes'
import FeaturedConversions from './FeaturedConversions'
import CadConversionToolLinks from './CadConversionToolLinks'
import SupportedCadFormats from './SupportedCadFormats'
import WhenToUseConverter from './WhenToUseConverter'
import CadViewerCrossLink from '../CadUpload/CadViewerCrossLink'
import ToolLibraryCrossLinks from '@/Components/CommonJsx/CrossTemplateLinks/ToolLibraryCrossLinks'
import InterlinkingBlocks from './InterlinkingBlocks'
import CadConverterFormateText from './CadConverterFormateText'
import ConversionQualityNotes from '../CadUpload/ConversionQualityNotes'
import ActiveLastBreadcrumb from '@/Components/CommonJsx/BreadCrumbs'
import DesignHub from '@/Components/HomePages/DesignHub/DesignHub'
import FaqPageJsonLd from '@/Components/JsonLdSchemas/FaqPageJsonLd'
import { cadConverterFaqQuestions, getConverterFaqQuestions } from '@/data/cadToolFaqs'
import ToolsPageBanner from '@/Components/CadServicesBanners/ToolsPageBanner'

// Page heading structure: 1 h1 (CadFileConversionHeader); h2 (HowItWorks, CoreBenefits, CadConverterTypes); rest h3 (InterlinkingBlocks, TrustPrivacy, DesignHub, OrgFaq).
// “How it works” with react-icons lives in CadFileConversionHowItWorks (client) so icon components are not passed from this Server Component.

const converterBenefits = [
    { icon: 'zap', label: 'Speed', title: 'Lightning-fast conversion', description: 'Cloud-based processing converts common CAD and mesh files in seconds.' },
    { icon: 'monitorSmartphone', label: 'Browser-based', title: 'No installation required', description: 'Use the converter in your browser without desktop software or plugins.' },
    { icon: 'cpu', label: 'File capacity', title: 'Large and complex models', description: 'Upload intricate engineering files up to 300 MB.' },
    { icon: 'shield', label: 'Privacy', title: 'Your files, your IP', description: 'Ownership stays with you. Files are never added to the public library.' },
];

const converterTrustItems = [
    { title: 'Encrypted uploads + secure processing', description: 'Files are encrypted during upload and processed securely.' },
    { title: 'Automatic deletion after 24 hours', description: 'Uploads are automatically deleted after 24 hours.' },
    { title: 'File ownership stays with you', description: 'You retain full ownership of your files.' },
];

const features = [
    {
        title: 'Seamless CAD File Conversion',
        description: 'Convert STEP, IGES, STL, BREP, OBJ, PLY, OFF, 3DM and more—instantly and without setup delays.'
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
        description: "Convert between STEP, IGES, STL, OBJ, PLY, OFF, BREP, and 3DM formats—all from a single, unified interface."
    },
    {
        title: 'Cloud-Based & Private',
        description: 'All files are securely processed in the cloud and automatically deleted after 24 hours to ensure your data stays safe.'
    },

]

function CadFileConversionHome({ convert, conversionParams, skipPageJsonLd = false, skipBreadcrumbSchema = false }) {
    const faqQuestions = convert && conversionParams
        ? getConverterFaqQuestions(conversionParams)
        : cadConverterFaqQuestions;
    const faqDescription = convert && conversionParams
        ? `Find answers about converting files with Marathon OS ${conversionParams.replace(/-/g, ' ')} converter.`
        : 'Find answers to common questions about Marathon OS 3D CAD File Converter.';

    return (
        <>
            {!skipPageJsonLd ? <FaqPageJsonLd faqSchemaData={faqQuestions} /> : null}
            {/* <HomeTopNav /> */}
            {!convert && (
                <ActiveLastBreadcrumb
                    variant="dark"
                    links={[
                        { label: 'tools', href: '/tools' },
                        { label: '3D CAD File Converter', href: '/tools/3d-cad-file-converter' },
                    ]}
                    skipSchema={skipBreadcrumbSchema}
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
                    skipSchema={skipBreadcrumbSchema}
                />
            )}
            <CadFileConversionHeader convert={convert} conversionParams={conversionParams} />
            <CoreBenefits
                eyebrow="Built for real CAD workflows"
                title="Why convert files with Marathon OS?"
                description="Fast, secure and browser-based CAD conversion designed for everyday engineering workflows."
                benefits={converterBenefits}
                variant="cardGrid"
            />
            {!convert ? (
              <>
                <CadConversionToolLinks />
                <CadViewerCrossLink variant="compact" />
                <SupportedCadFormats />
                <ToolLibraryCrossLinks />
                <WhenToUseConverter />
              </>
            ) : (
              <>
                <CadViewerCrossLink />
                <ToolLibraryCrossLinks />
              </>
            )}
            <ConversionQualityNotes />
            <ToolsPageBanner />
          
            {/* <OrgFeatures type='cad' /> */}
            <InterlinkingBlocks />
            <CadFileConversionHowItWorksServer conversionParams={convert ? conversionParams : undefined} />
          
            <TrustPrivacy title="Privacy and file handling" items={converterTrustItems} />
            {conversionParams && <CadConverterFormateText conversionParams={conversionParams} />}
            {/* <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails} /> */}
            {/* <FeaturedConversions /> */}
            <CadConverterTypes />
            <DesignHub headingLevel={3} />
            <OrgFaq
                faqQuestions={faqQuestions}
                description={faqDescription}
            />
            <Footer />
        </>

    )
}

export default CadFileConversionHome