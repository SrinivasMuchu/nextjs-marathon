'use client';

import React, { Suspense, useContext, useEffect } from 'react';

import Loading from '@/Components/CommonJsx/Loaders/Loading';
import CreatorsHome from '@/Components/CreatorsPage/CreatorsHome';
import { contextState } from '@/Components/CommonJsx/ContextProvider';

function History() {
  const { user } = useContext(contextState);

  useEffect(() => {
    if (user?.name) {
      document.title = `${user.name} | CAD Projects & Profile | Marathon-OS`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Explore the CAD projects, designs, and portfolio of ${user.name} on Marathon-OS. Learn more about their skills, experience, and download CAD files to collaborate or get inspired.`;
    }
  }, [user?.name]);

  return (
    <Suspense fallback={<Loading/>}>
     <CreatorsHome />
    </Suspense>
  );
}

export default History;
