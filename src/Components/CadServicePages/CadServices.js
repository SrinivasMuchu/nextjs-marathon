import React from 'react'
import CadServiceHome from './CadServiceHome/CadServiceHome'
import WhyMarathon from './WhyMarathon/WhyMarathon'
import HowItWorks from './HowItWorks/HowItWorks'
import BriefSection from './BriefSection/BriefSection'
import Capabilities from './Capabilities/Capabilities'
import NetworkSection from './NetworkSection/NetworkSection'
import Scenarios from './Scenarios/Scenarios'
import Faq from './Faq/Faq'
import CtaSection from './CtaSection/CtaSection'
import StickyCta from './StickyCta/StickyCta'
import Footer from '../HomePages/Footer/Footer'

function CadServices() {
  return (
    <div>
      <CadServiceHome />
      <WhyMarathon />
      <HowItWorks />
      <BriefSection />
      <Capabilities />
      <NetworkSection />
      <Scenarios />
      <Faq />
      <CtaSection />
      <Footer />
      <StickyCta />
    </div>
  )
}

export default CadServices
