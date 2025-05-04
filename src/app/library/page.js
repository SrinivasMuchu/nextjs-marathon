import Library from '@/Components/Library/Library';
import React from 'react';

function LibraryPage({ searchParams }) {
  return (
    <div>
      <Library searchParams={searchParams} />
    </div>
  );
}

export default LibraryPage;
