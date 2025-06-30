"use client"
import React from 'react'
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function ReactPhoneNumber({phoneNumber,setPhoneNumber,styles,classname,label,id}) {
  return (
    <>
      {label && id && (
        <label htmlFor={id} style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          border: 0,
        }}>{label}</label>
      )}
      <PhoneInput    
        className={styles[classname]}
        international
        defaultCountry="IN"
        countryCallingCodeEditable={false}
        value={phoneNumber}
        onChange={setPhoneNumber}
        id={id}
        style={{ backgroundColor: 'white', color: 'black', height: '49.6px', paddingLeft: '5px', outline: 'none', borderRadius: '4px' }}
      />
    </>
  )
}

export default ReactPhoneNumber