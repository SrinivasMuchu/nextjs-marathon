"use client"
import React from 'react'
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function ReactPhoneNumber({phoneNumber,setPhoneNumber,styles,classname}) {
  return (
    <PhoneInput    
    className={styles[classname]}
    international
    defaultCountry="IN"
    countryCallingCodeEditable={false}
    value={phoneNumber}
    onChange={setPhoneNumber}
    // inputStyle={{ backgroundColor: 'white', color: 'black', outline: 'none' }}
    style={{ backgroundColor: 'white', color: 'black', height: '49.6px', paddingLeft: '5px', outline: 'none', borderRadius: '4px' }} // Inline styling as a fallback
  />
  )
}

export default ReactPhoneNumber