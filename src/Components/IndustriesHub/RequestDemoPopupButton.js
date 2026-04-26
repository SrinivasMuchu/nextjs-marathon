'use client'

import { useState } from 'react'
import DemoPopUp from '@/Components/HomePages/RequestDemo/DemoPopUp'

export default function RequestDemoPopupButton({ className, children }) {
  const [openDemoForm, setOpenDemoForm] = useState(null)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpenDemoForm('demo')}>
        {children}
      </button>
      {openDemoForm === 'demo' && (
        <DemoPopUp
          onclose={() => setOpenDemoForm(null)}
          openPopUp={openDemoForm}
          setOpenDemoForm={setOpenDemoForm}
        />
      )}
    </>
  )
}
