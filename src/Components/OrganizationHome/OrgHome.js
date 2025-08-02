import React from 'react'
import Footer from '../HomePages/Footer/Footer'
import OrgLandPage from './OrganizationHierarchy/OrgLandPage'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import OrgFeatures from './OrgFeatures/OrgFeatures'
import ChartBuilder from './ChartBuilder/ChartBuilder'
import OurFeatures from './OurFeatures/OurFeatures'
import OrgFaq from './OrgFaq/OrgFaq'
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs'



const features = [
    {
        title: 'Seamless Data Import & Export',
        description: 'Import employee and department details effortlessly and export org charts in Excel for easy sharing and integration.'
    },
    {
        title: 'Department as an Entity',
        description: 'Clearly define and visualize both employees and departments for a better organizational overview.'
    },
    {
        title: 'Free for Small Teams',
        description: 'Get full access for up to 50 members and 20 departments—no cost, no hidden fees.'
    },
    {
        title: 'Secure & Privacy-Focused',
        description: "Your data is securely stored for 24 hours before automatic deletion, ensuring maximum privacy and security."
    },
    {
        title: 'Zero Learning Curve',
        description: 'No setup or training needed—simply enter your data, generate your org chart, and export it in minutes.'
    },
]

const faqQuestions = [
    {
        question: "What is Marathon OS Chart Builder?",
        answer: "Marathon OS Chart Builder is a simple, secure, and scalable tool that helps you create, manage, and share organizational charts effortlessly—no training required.",
    },
    {
        question: "Can I import and export data in Excel?",
        answer: "Yes! You can easily import employee and department details from Excel and export your org chart in the same format for seamless integration.",
    },
    {
        question: "Is Marathon OS Chart Builder free to use?",
        answer: "Yes! Our free plan supports up to 50 members and 20 departments, making it ideal for small teams and growing businesses.",
    },
    {
        question: "How is my data stored and secured?",
        answer: "Your data is securely stored for 24 hours before automatic deletion, ensuring privacy and security without long-term storage concerns.",
    },
    {
        question: "Do I need any training to use the tool?",
        answer: "No training is required! Marathon OS Chart Builder is designed with a zero-learning curve—just enter your data, generate your org chart, and export it in minutes.",
    },
    {
        question: "Can I create charts with departments as separate entities?",
        answer: "Yes! Our tool allows you to structure both employees and departments clearly for better visualization and organizational planning.",
    },
];
const featuresArray = [
    {
        title: 'Always Up-to-Date',
        description: 'Keep organizational data accurate and accessible in real time.'
    },
    {
        title: 'Customizable & Flexible',
        description: 'Adapt charts to match your company’s unique structure and hierarchy.'
    },
    {
        title: 'Seamless Sharing',
        description: 'Export and share org charts effortlessly across teams and leadership.'
    },
    {
        title: 'Optimized for Growth',
        description: "Scales with your company, whether you're a startup or an enterprise."
    },
    {
        title: 'Reliable & Secure',
        description: 'Keep sensitive organizational data protected with built-in security features.'
    },

]
const whyChoose = {
    title: 'Why Choose Marathon OS Chart Builder?',
    description: 'Effortlessly create, manage, and share org charts with Marathon OS Chart Builder. Designed for speed, accuracy, and scalability,it keeps your team organized and helps you make smarter organizational decisions.'
}
const essentialDeatails = {
    title: 'Essential Features of Marathon OS Chart Builder',
    description: "Effortlessly create, manage, and share org charts with a simple, secure, and scalable tool.Visualize employees and departments with ease no training required whether you're structuring a startup or managing a growing enterprise."
}
function OrgHome() {
    return (
        <div>
            {/* <HomeTopNav /> */}
            <ActiveLastBreadcrumb
                      links={[
                        { label: 'Organization hierarchy', href: '/tools/org-hierarchy' },       
                       
                      
                      ]}
                    />
            <OrgLandPage />
            <OrgFeatures type='org'/>
            <ChartBuilder whyChoose={whyChoose} featuresArray={featuresArray} />
            <OurFeatures features={features} essentialDeatails={essentialDeatails}/>
            <OrgFaq faqQuestions={faqQuestions} description="Find answers to common questions about Marathon OS Chart Builder. Whether you&apos;re getting started or looking for advanced features, we&apos;ve got you covered."/>
            <Footer />
        </div >
    )
}

export default OrgHome