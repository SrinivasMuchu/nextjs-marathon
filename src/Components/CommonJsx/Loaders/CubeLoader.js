"use client";
import React,{useContext} from 'react';
import Lottie from 'lottie-react';
import cube from './Cube.json';
import LeftRightBanner from '../Adsense/AdsBanner';
import { contextState } from '../ContextProvider';
import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav';

const statusMessages = {
  UPLOADINGFILE: '⏳ Uploading file...',
  PENDING: '⏳ Task is in queue...',
  PROCESSING: '🛠️ Processing the file...',
  PROCESSED: '🛠️ Processing the file...',
  UPLOADING: '📤 Finalizing the process...',
  COMPLETED: '✅ Task completed successfully!',
  FAILED: '❌ Something went wrong. Please retry.',
};

function CubeLoader({ uploadingMessage, totalImages , completedImages,type  }) {
   const { user } = useContext(contextState); 

  const showProgress = uploadingMessage === 'PROCESSED';

  return (
    <div style={{display:'flex',flexDirection:'column',width:'100%'}}>
    {type === 'convert' && <HomeTopNav />}
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', 
    justifyContent: 'space-between',background:'white' }}>
      <div style={{ width: '300px', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
              <LeftRightBanner adSlot={type === 'convert' ? "9130570279" : "7541354101"} />

      </div>
      <div style={{ width: '100%',height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection: 'column', gap: '10px' }}>
           <Lottie animationData={cube} loop={true} style={{ width: 200, height: 200 }} />
      <span>{statusMessages[uploadingMessage] || ''}</span>
      {(completedImages>0 && completedImages !== totalImages) && (
       <div style={{ width: '80%', maxWidth: '300px', marginTop: '10px',display:'flex',flexDirection:'column' }}>
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
       
      {/* Notification Message Section */}
      {(uploadingMessage !== 'COMPLETED' && 
      uploadingMessage !== 'FAILED' && uploadingMessage !== 'UPLOADINGFILE' && localStorage.getItem('is_verified')) &&
       <div style={{
        backgroundColor: '#f3f4f6',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginTop: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 16px 0',
          lineHeight: '1.4'
        }}>
          We will notify you when your CAD file is ready.<br />
          
        </h3>
        
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          margin: '16px 0',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280',
            margin: '0 0 8px 0'
          }}>
            Notification methods enabled:
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>📧</span>
            <span style={{
              fontSize: '14px',
              color: '#374151',
              fontWeight: '500'
            }}>
              Email: {user.email}
            </span>
          </div>
        </div>
        
        <div style={{
          fontSize: '13px',
          color: '#6b7280',
          marginTop: '16px'
        }}>
          For any issues, please contact our support team at{' '}
          <a href="mailto:invite@marathon-os.com" style={{
            color: '#8b5cf6',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            invite@marathon-os.com
          </a>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#374151',
          fontWeight: '500',
          margin: '16px 0 0 0'
        }}>
          Thank you for using Marathon OS!
        </p>
      </div>
      }
     
      </div>
     
      
      <div style={{ width: '300px', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
               <LeftRightBanner adSlot={type === 'convert' ? "2565161929" : "1112495361"} />

      </div>
     
    </div>
    </div>
    
  );
}

export default CubeLoader;