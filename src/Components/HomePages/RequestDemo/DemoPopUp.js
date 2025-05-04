import React from 'react'
import ThanksPopUp from './ThanksPopUp'
import RequestDemo from './RequestDemo'

function DemoPopUp({ openPopUp,  setOpenDemoForm, onclose,error }) {
 
    return (

        <>
            {openPopUp === 'demo' && <RequestDemo  onclose={onclose} setOpenDemoForm={setOpenDemoForm} openPopUp={openPopUp} error={error}/>}
            {openPopUp === 'thanks' && <ThanksPopUp  onclose={onclose} />}
        </>
    )
}

export default DemoPopUp