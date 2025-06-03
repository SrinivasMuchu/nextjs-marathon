import React from 'react'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import WhyShareYourDesign from './WhyShareYourDesign';
import TellUsAboutYourself from './TellUsAboutYourself';
import UploadYourCadDesign from './UploadYourCadDesign';
import Footer from '../HomePages/Footer/Footer';
import FloatingButton from '../CommonJsx/FloatingButton';

function UserCadFileUpload() {
    return (
        <>
            <HomeTopNav />
            <WhyShareYourDesign />
            <TellUsAboutYourself />
            <UploadYourCadDesign />
            {/* <FloatingButton/> */}
            <Footer />
        </>
    )
}

export default UserCadFileUpload
