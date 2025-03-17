"use client";
import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { v4 as uuidv4 } from 'uuid';

function CreateLocalStorage() {
  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
      const newUuid = uuidv4();
      createOrg(newUuid);
    }
  }, []);

  const createOrg = async (uuid) => {
    try {
      const response = await axios.post(`${BASE_URL}/v1/org/create-org-next`, {
        uuid,
      });
      localStorage.setItem('uuid', uuid);
      localStorage.setItem('org_id', response.data.data.org_id);
    } catch (error) {
      console.error('Error creating org:', error);
    }
  };

  // Return null to render nothing
  return null;
}

export default CreateLocalStorage;