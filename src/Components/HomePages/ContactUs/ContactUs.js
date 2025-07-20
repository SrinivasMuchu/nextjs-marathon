import Image from 'next/image'
import React from 'react'
import styles from './ContactUs.module.css'
import CallEndIcon from '@mui/icons-material/CallEnd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import FooterForm from '../Footer/FooterForm';
import HomeTopNav from '../HomepageTopNav/HomeTopNav';
import Footer from '../Footer/Footer';

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

const contactArray = [
  {
    logo: <LocationOnIcon />,
    title: 'Visit Us',
    details: '4th Floor, Bs4F, Mallibu Towne, Sector 47, Gurgaon, Haryana, 122018 India',
    isLink: false
  },
  {
    logo: <CallEndIcon />,
    title: 'Call Us',
    details: '+91 9899032961',
    isLink: true,
    href: 'tel:+919899032961'
  },
  {
    logo: <MailIcon />,
    title: 'Email Us',
    details: 'invite@marathon-os.com',
    isLink: true,
    href: 'mailto:invite@marathon-os.com'
  }
]

function ContactUs() {
  return (
    <>
      <HomeTopNav />
      <div className={styles["contactus-page"]}>
        <div className={styles["contactus-header"]}>
          <h1>Get in Touch</h1>
          <p>Have a question or want to work together? We&rsquo;d love to hear from you.</p>
        </div>

        <div className={styles["contactus-types"]}>
          {contactArray.map((item, index) => (
            <div key={index} className={styles["contactus-types-item"]}>
              <div className={styles["contactus-types-item-logo"]}>
                {item.logo}
              </div>
              <span>{item.title}</span>
              {item.isLink ? (
                <a href={item.href} className={styles["contactus-link"]}>
                  {item.details}
                </a>
              ) : (
                <p>{item.details}</p>
              )}
            </div>
          ))}
        </div>

        <div className={styles["contactus-message"]}>
          <div className={styles["contactus-conversation"]}>
            <div className={styles["contactus-conversation-text"]}>
              <h1>Send us a message</h1>
              <FooterForm getIntouch={true} />
            </div>
            <div className={styles["contactus-conversation-header"]}>
              <h1>Let&rsquo;s Start a Conversation</h1>
              <p>We&rsquo;re here to help and answer any question you might have. We look forward to hearing from you.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ContactUs
