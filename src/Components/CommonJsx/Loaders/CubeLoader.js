import React from 'react'
import Lottie from 'lottie-react';
import cube from './Cube.json'

function CubeLoader() {
  return (
    <div style={{width:'100%',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Lottie animationData={cube} loop={true} style={{ width: 200, height: 200 }}/>

    </div>

  )
}

export default CubeLoader