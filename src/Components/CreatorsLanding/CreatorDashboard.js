import React from 'react'
import CreatorDashboardHeader from './CreatorDashboardHeader'
import ShareYourDesigns from './ShareYourDesigns'
import HowItWorks from './HowItWorks'
import LibraryDetails from '../HomePages/LibraryTools/LibraryDetails'
import CreatorFAQ from './CreatorFAQ'
import CreaterNotification from './CreaterNotification'
import StartShareDesign from './StartShareDesign'
import Footer from '../HomePages/Footer/Footer'

// Page heading structure: 1 h1 (CreatorDashboardHeader), 2 h2s (ShareYourDesigns, HowItWorks), rest h3 (LibraryDetails, CreatorFAQ, CreaterNotification, StartShareDesign; item titles are h3).
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