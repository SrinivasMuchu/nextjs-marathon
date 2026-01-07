'use client';
import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

export default function SignaturePage() {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
     
    
     
      console.log('🖼️ Base64 Data URL:', signatureDataURL);
     
      
      // Additional upload simulation data
    
     

      // TODO: Replace this with actual backend API call
      // Example backend call:
      /*
      const backendResponse = await fetch('/api/save-signature', {
        method: 'POST',
        body: formData,
      });
      
      if (backendResponse.ok) {
        const result = await backendResponse.json();
        console.log('Signature saved successfully:', result);
        alert('Signature saved successfully!');
      } else {
        throw new Error('Failed to save signature');
      }
      */

      // For demo purposes, simulate success
      setTimeout(() => {
        alert('Signature captured! Check console for detailed upload data.');
        setIsLoading(false);
      }, 1000);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Digital Signature Pad
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4">
              Please sign in the box below
            </p>
            
            {/* Signature Canvas Container */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-64 border border-gray-200 rounded cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={clearSignature}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Clear
            </button>
            
            <button
              onClick={saveSignature}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Signature'}
            </button>
            
            <button
              onClick={downloadSignature}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              disabled={isLoading}
            >
              Download
            </button>
          </div>

          {/* Instructions */}
         

          {/* Backend Integration Guide */}
         
        </div>
      </div>
    </div>
  );
}