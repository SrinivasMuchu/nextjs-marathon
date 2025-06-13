'use client';

import React, { Suspense } from 'react';
import FileHistoryHomePage from '@/Components/History/FileHistoryHomePage';
import Loading from '@/Components/CommonJsx/Loaders/Loading';

function History() {
  return (
    <Suspense fallback={<Loading/>}>
      <FileHistoryHomePage />
    </Suspense>
  );
}

export default History;
