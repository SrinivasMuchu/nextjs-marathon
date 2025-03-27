// context/FileContext.js
'use client'; // Mark this as a Client Component

import { createContext, useState } from 'react';


export const contextState = createContext();


function ContextProvider({children}) {
    const [file, setFile] = useState(null);
    const [allowedFormats, setAllowedFormats] = useState([])
    const [paramsText, setParamsText] = useState({from:'', to:''})
  return (
    <contextState.Provider value={{ file, setFile,allowedFormats, setAllowedFormats,paramsText, setParamsText }}>
    {children}
  </contextState.Provider>
  )
}

export default ContextProvider