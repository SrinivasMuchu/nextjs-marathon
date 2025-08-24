'use client';

import React, { Suspense } from 'react';

import Loading from '@/Components/CommonJsx/Loaders/Loading';
import CreatorsHome from '@/Components/CreatorsPage/CreatorsHome'

function History() {
  return (
    <Suspense fallback={<Loading/>}>
     <CreatorsHome />
    </Suspense>
  );
}

export default History;
