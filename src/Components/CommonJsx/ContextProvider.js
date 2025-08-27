// context/FileContext.js
'use client'; // Mark this as a Client Component

import { createContext, useState } from 'react';


export const contextState = createContext();


function ContextProvider({children}) {
    const [file, setFile] = useState(null);
    const [allowedFormats, setAllowedFormats] = useState([])
    const [paramsText, setParamsText] = useState({from:'', to:''})
     const [hasUserEmail, setHasUserEmail] = useState(false);
     const [anchorAds, setAnchorAds] = useState(false);
    const [uploadedFile, setUploadedFile] = useState({});
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState(false);
    const [user, setUser] = useState({ 
        name: '', email: '', photo: '',_id:'',
        user_access_key: '', desc: '', 
        skills: [], website: '', linkedin: '',
        cover_image: '',projects:0,views:0,downloads:0,
      designation:'',username:'' });
    const [viewer, setViewer] = useState({ 
        name: '', email: '', photo: '',_id:'',
        user_access_key: '', desc: '', 
        skills: [], website: '', linkedin: '',
        cover_image: '',projects:0,views:'0',downloads:'0',
      designation:'',username:'' });
  return (
    <contextState.Provider value={{ 
      file, setFile,allowedFormats, setAllowedFormats,
      paramsText, setParamsText,hasUserEmail, setHasUserEmail,updatedDetails, setUpdatedDetails,
      uploadedFile, setUploadedFile,user, setUser,isProfileComplete, setIsProfileComplete,anchorAds, setAnchorAds,viewer, setViewer }}>
    {children}
  </contextState.Provider>
  )
}

export default ContextProvider