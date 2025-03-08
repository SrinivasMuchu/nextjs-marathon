import React from 'react'
import Footer from '../HomePages/Footer/Footer'
import OrgLandPage from './OrganizationHierarchy/OrgLandPage'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import OrgFeatures from './OrgFeatures/OrgFeatures'
import ChartBuilder from './ChartBuilder/ChartBuilder'
import OurFeatures from './OurFeatures/OurFeatures'
import OrgFaq from './OrgFaq/OrgFaq'

function OrgHome() {
  return (
    <div>
    <HomeTopNav />
    <OrgLandPage />
    <OrgFeatures />
    <ChartBuilder/>
    <OurFeatures />
    <OrgFaq/>
    <Footer />
  </div >
  )
}

export default OrgHome