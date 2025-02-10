import React from 'react'
import DemoForm from './DemoForm'
import ThanksPopUp from './ThanksPopUp'

function DemoPopUp({ openPopUp,styles,setOpenDemoForm }) {
    return (

        <>{
            openPopUp === 'demo' && <DemoForm styles={styles} onclose={setOpenDemoForm}/>
        }{openPopUp === 'thanks' && <ThanksPopUp styles={styles} onclose={setOpenDemoForm}/>}</>
    )
}

export default DemoPopUp