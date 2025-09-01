import React from 'react'
import CreatorDashboardHeader from './CreatorDashboardHeader'
import ShareYourDesigns from './ShareYourDesigns'
import HowItWorks from './HowItWorks'
import LibraryDetails from '../HomePages/LibraryTools/LibraryDetails'
import CreatorFAQ from './CreatorFAQ'
import CreaterNotification from './CreaterNotification'
import StartShareDesign from './StartShareDesign'
import Footer from '../HomePages/Footer/Footer'

function CreatorDashboard() {
  return (
    <div>
        <CreatorDashboardHeader/>
        <ShareYourDesigns/>
        <HowItWorks/>
        <LibraryDetails/>
        <CreatorFAQ/>
        <CreaterNotification/>
        <StartShareDesign/>
        <Footer/>

    </div>
  )
}

export default CreatorDashboard