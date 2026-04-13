import React from 'react'
import ChartBuilder from '../OrganizationHome/ChartBuilder/ChartBuilder';
import OurFeatures from '../OrganizationHome/OurFeatures/OurFeatures';
import OrgFaq from '../OrganizationHome/OrgFaq/OrgFaq';
import Footer from '../HomePages/Footer/Footer';
import SampleParts from '../IndustriesPages/SampleParts';
import SolutionCad from '../IndustriesPages/SolutionCad';
import UseOfCAD from '../IndustriesPages/UseOfCAD';
import RoleOfCAD from '../IndustriesPages/RoleOfCAD';
import IndustryDetails from '../IndustriesPages/IndustryDetails';
import IndustryHowItWorksSection from '../IndustriesPages/IndustryHowItWorksSection';
import IndustryMarketingBody from '../IndustriesPages/IndustryMarketingBody';
import IndustryFinalCtaBand from '../IndustriesPages/IndustryFinalCtaBand';
import IndustryDesigns from './IndustryDesigns';
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs';
import OrgFeatures from '../OrganizationHome/OrgFeatures/OrgFeatures';
import { getIndustryCadViewerFaq } from '@/data/industryPageFaq';

function IndustryParts({ industry, part_name, industryData }) {
    const faqQuestions = industryData ? getIndustryCadViewerFaq(industryData) : []

    const features = [
        {
            title: 'Seamless CAD File viewing',
            description: 'View STEP, IGES, STL, BREP, OBJ, PLY, OFF, and more—instantly and without setup delays.'
        },
        {
            title: 'Handles Large & Complex Models',
            description: 'Optimized to convert even intricate engineering models with accuracy and speed—no matter the size or complexity.'
        },
        {
            title: 'No Installation Required',
            description: 'view 3D files directly from your browser. no plugins—just drag, drop, and go.'
        },
        {
            title: 'Secure & Privacy-Focused',
            description: "Your files are encrypted during upload, processed securely, and automatically deleted after 24 hours to protect your data."
        },
    ]

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

    return (
        <div>
            {industryData && <>
                <ActiveLastBreadcrumb
                    links={[
                        { label: 'CAD viewer', href: '/tools/3D-cad-viewer' },
                        { label: `${industryData.industry}`, href: `/industry/${industry}` },
                        { label: `${industryData.part_name}`, href: `/industry/${industry}/${part_name}` },
                    ]}
                />
                <IndustryDetails industryData={industryData} part_name={part_name} />
                <IndustryHowItWorksSection industryName={industryData.industry} />
                <OrgFeatures type='cad' />
                <IndustryMarketingBody industryData={industryData} />
                <RoleOfCAD industryData={industryData} part_name={part_name} industry={industry} />
                {industryData && (
                    <IndustryDesigns industryData={industryData} part_name={part_name} industry={industry} />
                )}
                <UseOfCAD industryData={industryData} />
                <SolutionCad industryData={industryData} />
                <SampleParts industry={industry} part_name={part_name} industryLabel={industryData.industry} />
                <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} headingLevel={3} />
                <OurFeatures features={features} essentialDeatails={essentialDeatails} headingLevel={3} />
                <OrgFaq
                    title="FAQ"
                    faqQuestions={faqQuestions}
                    description="Answers for teams evaluating browser-based CAD review with Marathon OS."
                />
                <IndustryFinalCtaBand industryName={industryData.industry} />
                <Footer />
            </>}

        </div>
    )
}

export default IndustryParts
