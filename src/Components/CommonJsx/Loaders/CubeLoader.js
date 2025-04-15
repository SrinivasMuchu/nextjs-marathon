"use client";
import React from 'react';
import Lottie from 'lottie-react';
import cube from './Cube.json';

const statusMessages = {
  UPLOADINGFILE: '⏳ Uploading file...',
  PENDING: '⏳ Task is in queue...',
  PROCESSING: '🛠️ Processing the file...',
  PROCESSED: '🛠️ Processing the file...',
  UPLOADING: '📤 Finalizing the process...',
  COMPLETED: '✅ Task completed successfully!',
  FAILED: '❌ Something went wrong. Please retry.',
};

function CubeLoader({ uploadingMessage, totalImages , completedImages  }) {
  
console.log(totalImages , completedImages)
  const showProgress = uploadingMessage === 'PROCESSED';

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Lottie animationData={cube} loop={true} style={{ width: 200, height: 200 }} />
      <span>{statusMessages[uploadingMessage] || ''}</span>
      {(completedImages>0 && completedImages !== totalImages) && (
        <div style={{ width: '80%', maxWidth: '300px', marginTop: '10px' }}>
          <div style={{ 
            width: '100%', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '5px',
            height: '10px'
          }}>
            <div style={{ 
              width: `${Math.round((completedImages / totalImages) * 100)}%`, 
              backgroundColor: '#610bee', 
              borderRadius: '5px',
              height: '100%',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <span style={{ fontSize: '14px', marginTop: '5px', display: 'block', textAlign: 'center' }}>
            {completedImages} of {totalImages} ({Math.round((completedImages / totalImages) * 100)}%)
          </span>
        </div>
      )}
    </div>
  );
}

export default CubeLoader;