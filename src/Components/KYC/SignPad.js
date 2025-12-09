'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';

function SignPad({ onSignatureCapture, signature }) {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigned, setIsSigned] = useState(!!signature);

  // Draw the signature image from prop
  const drawSignatureImage = useCallback(() => {
    if (canvasRef.current && signature) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new window.Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        setIsSigned(true);
      };
      image.src = signature;
    }
  }, [signature]);

  // Initialize signature pad and handle resizing
  useEffect(() => {
    if (!canvasRef.current) return;

    signaturePadRef.current = new SignaturePad(canvasRef.current, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'rgb(0, 0, 0)',
      minWidth: 0.5,
      maxWidth: 2.5,
      throttle: 16,
      minPointDistance: 3,
    });

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(devicePixelRatio, devicePixelRatio);
      signaturePadRef.current.clear();
      if (signature) {
        setTimeout(drawSignatureImage, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawSignatureImage, signature]);

  // Redraw signature when signature prop changes
  useEffect(() => {
    if (signature) {
      drawSignatureImage();
    } else if (canvasRef.current && signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsSigned(false);
    }
  }, [signature, drawSignatureImage]);

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
      toast.error('Please provide a signature first.');
      return;
    }

    setIsLoading(true);

    try {
      const signatureDataURL = signaturePadRef.current.toDataURL('image/png');
      const response = await fetch(signatureDataURL);
      const blob = await response.blob();

      const signatureData = {
        dataURL: signatureDataURL,
        blob: blob,
        timestamp: new Date().toISOString(),
        size: blob.size
      };

      if (onSignatureCapture) {
        onSignatureCapture(signatureData);
      }

      setIsSigned(true);
      setIsLoading(false);
      toast.success('Signature captured successfully!');
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Error saving signature. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4">
        <p className="text-gray-600 text-center mb-4">
          Please sign in the box below to complete your KYC verification
        </p>
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
  );
}

export default SignPad;