import React from 'react'
import RoleOfCAD from './RoleOfCAD'
import UseOfCAD from './UseOfCAD'
import SolutionCad from './SolutionCad'
import SampleParts from './SampleParts'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import OrgFeatures from '../OrganizationHome/OrgFeatures/OrgFeatures'
import IndustryDetails from './IndustryDetails'
import ChartBuilder from '../OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '../OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '../OrganizationHome/OrgFaq/OrgFaq'
import Footer from '../HomePages/Footer/Footer'
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs'

function Industry({ industry, industryData }) {
   
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
    const faqQuestions = [
        {
            question: "What is Marathon OS 3D CAD File Viewer?",
            answer: "Marathon OS is a free, cloud-based tool that lets you convert 3D CAD files between formats like STEP, IGES, STL, OBJ, and more—instantly and securely, right in your browser.",
        },
        {
            question: "What file formats are supported?",
            answer: "We support conversions between major 3D CAD formats including:STEP (.step, .stp), IGES (.iges, .igs), STL (.stl), OBJ (.obj), PLY (.ply), OFF (.off), and BREP (.brp, .brep).",
        },
        {
            question: " Is Marathon OS 3D File viewer free to use?",
            answer: "Yes! It’s completely free with no usage limits or hidden costs. Just drag, drop, and view.",
        },
        {
            question: "How is my data stored and secured?",
            answer: " Your files are encrypted during upload, processed securely in the cloud, and automatically deleted after 24 hours to ensure full privacy and protection.",
        },
        {
            question: "Do I need any special software or training?",
            answer: "Not at all. Marathon OS works entirely in your browser—no installations, no plugins, and no learning curve.",
        },
        {
            question: "Can I view large and complex CAD models?",
            answer: "Absolutely! Our proprietary high-performance rendering engine ensures smooth, lag-free visualization, even for large and intricate designs.",
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

   
    return (
        <div>
            {industryData && <>
                <HomeTopNav />
                <ActiveLastBreadcrumb links={[
                    { label: 'CAD viewer', href: '/tools/cad-viewer' },   
                    { label: `${industryData.industry}`, href: `/industry/${industry}` },
                  
                  ]}/>
                <IndustryDetails industryData={industryData} />
                <OrgFeatures type='cad' />
                <RoleOfCAD industryData={industryData} industry={industry}/>
                <UseOfCAD industryData={industryData} />
                <SolutionCad industryData={industryData} />
                <SampleParts industry={industry} />
                <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
                <OurFeatures features={features} essentialDeatails={essentialDeatails} />
                <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS CAD Viewer. Whether you're getting started or looking for advanced features, we've got you covered." />
                <Footer />
            </>}

        </div>
    )
}

export default Industry