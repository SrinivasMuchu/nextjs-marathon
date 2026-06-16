import AdminPannel from '@/Components/AdminPannel/AdminPannel'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback={null}>
      <AdminPannel />
    </Suspense>
  )
}

export default page
