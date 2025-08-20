import CreatorsHome from '@/Components/CreatorsPage/CreatorsHome'
import React from 'react'

function page({ params }) {
    console.log(params)
  return (
    <CreatorsHome creatorId={params.creator_id} />
  )
}

export default page