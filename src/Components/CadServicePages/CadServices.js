'use client'

import React from 'react'
import CadServiceHome from './CadServiceHome/CadServiceHome'
import TrustedByBanner from './TrustedByBanner/TrustedByBanner'
import WhyMarathon from './WhyMarathon/WhyMarathon'
import HowItWorks from './HowItWorks/HowItWorks'
import Deliverables from './Deliverables/Deliverables'
import Industries from './Industries/Industries'
import Testimonials from './Testimonials/Testimonials'
import Faq from './Faq/Faq'
import CtaSection from './CtaSection/CtaSection'
import Footer from '../HomePages/Footer/Footer'

function CadServices() {
  return (
    <div>
      <CadServiceHome />
      {/* <TrustedByBanner /> */}
      <WhyMarathon />
      <HowItWorks />
      <Deliverables />
      <Industries />
      <Testimonials />
      <Faq />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default CadServices