'use client';
import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

function SignPad({ onSignatureCapture }) {
     const canvasRef = useRef(null);
      const signaturePadRef = useRef(null);
      const [isLoading, setIsLoading] = useState(false);
      const [isSigned, setIsSigned] = useState(false);
    
      useEffect(() => {
        if (canvasRef.current) {
          // Initialize signature pad
          signaturePadRef.current = new SignaturePad(canvasRef.current, {
            backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
            penColor: 'rgb(0, 0, 0)', // Black pen
            minWidth: 0.5,
            maxWidth: 2.5,
            throttle: 16, // Smooth drawing
            minPointDistance: 3,
          });
    
          // Resize canvas to fit container
          const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const devicePixelRatio = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            
            const ctx = canvas.getContext('2d');
            ctx.scale(devicePixelRatio, devicePixelRatio);
            
            // Reinitialize signature pad after resize
            signaturePadRef.current.clear();
          };
    
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);
    
          return () => {
            window.removeEventListener('resize', resizeCanvas);
          };
        }
      }, []);
    
      const clearSignature = () => {
        if (signaturePadRef.current) {
          signaturePadRef.current.clear();
          setIsSigned(false);
          if (onSignatureCapture) {
            onSignatureCapture(null);
          }
        }
      };
    
      const saveSignature = async () => {
        if (!signaturePadRef.current) return;
    
        if (signaturePadRef.current.isEmpty()) {
          alert('Please provide a signature first.');
          return;
        }
    
        setIsLoading(true);
    
        try {
          // Get signature as base64 data URL
          const signatureDataURL = signaturePadRef.current.toDataURL('image/png');
          
          // Convert to blob for backend upload
          const response = await fetch(signatureDataURL);
          const blob = await response.blob();
          
          // Prepare signature data for parent component
          const signatureData = {
            dataURL: signatureDataURL,
            blob: blob,
            timestamp: new Date().toISOString(),
            size: blob.size
          };
          
          console.log('🖼️ Signature captured:', signatureData);
          
          // Pass signature data to parent component
          if (onSignatureCapture) {
            onSignatureCapture(signatureData);
          }
          
          setIsSigned(true);
          setIsLoading(false);
          alert('Signature captured successfully!');
    
        } catch (error) {
          console.error('Error saving signature:', error);
          alert('Error saving signature. Please try again.');
          setIsLoading(false);
        }
      };
    
      const downloadSignature = () => {
        if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
          alert('Please provide a signature first.');
          return;
        }
    
        const dataURL = signaturePadRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `signature_${Date.now()}.png`;
        link.href = dataURL;
        link.click();
      };
  return (
     <div className="bg-white rounded-lg p-4">
          <div className="mb-4">
            <p className="text-gray-600 text-center mb-4">
              Please sign in the box below to complete your KYC verification
            </p>
            
            {/* Signature Canvas Container */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-48 border border-gray-200 rounded cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>
            
            {isSigned && (
              <div className="mt-2 text-center">
                <span className="text-green-600 text-sm">✓ Signature captured successfully</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={clearSignature}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
              disabled={isLoading}
            >
              Clear
            </button>
            
            <button
              onClick={saveSignature}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Capturing...' : 'Capture Signature'}
            </button>
          </div>
        </div>
  )
}

export default SignPad