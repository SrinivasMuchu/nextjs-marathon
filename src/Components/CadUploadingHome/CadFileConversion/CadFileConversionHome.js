import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import React from 'react'
import OrgFeatures from '@/Components/OrganizationHome/OrgFeatures/OrgFeatures'
import ChartBuilder from '@/Components/OrganizationHome/ChartBuilder/ChartBuilder'
import OurFeatures from '@/Components/OrganizationHome/OurFeatures/OurFeatures'
import OrgFaq from '@/Components/OrganizationHome/OrgFaq/OrgFaq'
import Footer from '@/Components/HomePages/Footer/Footer'
import CadFileConversionHeader from './CadFileConversionHeader'



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
        question: "What is Marathon OS CAD Viewer?",
        answer: "Marathon OS CAD Viewer is a high-performance, cloud-based tool that allows you to view STEP, IGES, STL, BREP, and more instantly—without any software installation.",
    },
    {
        question: "What file formats are supported?",
        answer: "You can upload and view STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), and BREP (.brp, .brep) files.",
    },
    {
        question: "Is Marathon OS CAD Viewer free to use?",
        answer: "Yes! Marathon OS offers a free and secure way to view CAD files online, with no downloads required.",
    },
    {
        question: "How is my data stored and secured?",
        answer: "All uploaded files are encrypted and automatically deleted after 24 hours, ensuring complete privacy and security.",
    },
    {
        question: "Do I need any special software or training?",
        answer: "Nope! Marathon OS CAD Viewer works directly in your browser, making it easy to use with zero learning curve.",
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

function CadFileConversionHome() {
    return (
        <>
            <HomeTopNav />
         <CadFileConversionHeader />
            <OrgFeatures type='cad'/>
            <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails}/>
            <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS CAD Viewer. Whether you're getting started or looking for advanced features, we've got you covered."/>
            <Footer />
        </>

    )
}

export default CadFileConversionHome