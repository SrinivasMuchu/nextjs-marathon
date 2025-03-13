import React from 'react';
import Lottie from 'lottie-react';
import cube from './Cube.json';

const statusMessages = {
  PENDING: '⏳ Task is in queue...',
  PROCESSING: '🛠️ Processing the file...',
  UPLOADING: '📤 Finalizing the process...',
  COMPLETED: '✅ Task completed successfully!',
  FAILED: '❌ Something went wrong. Please retry.',
};

function CubeLoader({ uploadingMessage }) {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Lottie animationData={cube} loop={true} style={{ width: 200, height: 200 }} />
      <span>{statusMessages[uploadingMessage] || ''}</span>
    </div>
  );
}

export default CubeLoader;
