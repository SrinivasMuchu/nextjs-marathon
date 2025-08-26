'use client';

import React, { Suspense, useContext, useEffect } from 'react';

import Loading from '@/Components/CommonJsx/Loaders/Loading';
import CreatorsHome from '@/Components/CreatorsPage/CreatorsHome';
import { contextState } from '@/Components/CommonJsx/ContextProvider';

function Page({ params }) {
    const { viewer } = useContext(contextState);
   
     useEffect(() => {
       if (viewer?.name) {
         document.title = `${viewer.name} | CAD Projects & Profile | Marathon-OS`;
         let metaDesc = document.querySelector('meta[name="description"]');
         if (!metaDesc) {
           metaDesc = document.createElement('meta');
           metaDesc.name = "description";
           document.head.appendChild(metaDesc);
         }
         metaDesc.content = `Explore the CAD projects, designs, and portfolio of ${viewer.name} on Marathon-OS. Learn more about their skills, experience, and download CAD files to collaborate or get inspired.`;
       }
     }, [viewer?.name]);
  return (
     <Suspense fallback={<Loading/>}>
     <CreatorsHome creatorId={params.creator_id} />
    </Suspense>
    
  )
}

export default Page