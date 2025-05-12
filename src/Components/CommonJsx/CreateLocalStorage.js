"use client";
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function CreateLocalStorage() {
  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
      const newUuid = uuidv4();
      localStorage.setItem('uuid', newUuid);
    }
  }, []);
  // Return null to render nothing
  return null;
}


export default CreateLocalStorage;
