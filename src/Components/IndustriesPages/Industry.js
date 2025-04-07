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

function Industry({industry,industryData}) {
    // console.log(industryData)
    const features = [
        {
            title: 'Seamless CAD File Conversion',
            description: 'Convert STEP, IGES, STL, BREP, OBJ, PLY, OFF, and more—instantly and without setup delays.'
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
            answer: "Marathon OS is a free, cloud-based tool that lets you convert 3D CAD files between formats like STEP, IGES, STL, OBJ, and more—instantly and securely, right in your browser.",
        },
        {
            question: "What file formats are supported?",
            answer: "We support conversions between major 3D CAD formats including:STEP (.step, .stp), IGES (.iges, .igs), STL (.stl), OBJ (.obj), PLY (.ply), OFF (.off), and BREP (.brp, .brep).",
        },
        {
            question: " Is Marathon OS 3D File Converter free to use?",
            answer: "Yes! It’s completely free with no usage limits or hidden costs. Just drag, drop, and convert.",
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
            question: "Can I convert large and complex CAD models?",
            answer: "Absolutely. Our converter is optimized to handle heavy files and detailed engineering models without compromising speed or accuracy.",
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
    return (
        <div>
            <HomeTopNav />
            <IndustryDetails industryData={industryData} />
            <OrgFeatures type='cad' />
            <RoleOfCAD industryData={industryData}/>
            <UseOfCAD industryData={industryData}/>
            <SolutionCad industryData={industryData}/>
            <SampleParts industry={industry}/>
            <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails} />
            <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS 3D CAD File Converter. Whether you're getting started or looking for advanced features, we've got you covered." />
            <Footer />
        </div>
    )
}

export default Industry