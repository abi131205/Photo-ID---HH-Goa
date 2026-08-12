import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: HTMLImageElement) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Start webcam stream when modal opens or facingMode changes
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    let isMounted = true;

    async function startCamera() {
      setIsInitializing(true);
      setError(null);
      stopStream();

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (err: any) {
        console.error('Camera access error:', err);
        if (isMounted) {
          setError(
            err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
              ? 'Camera permission denied. Please allow camera access in browser settings.'
              : 'Unable to access webcam. Please ensure a camera is connected.'
          );
          setIsInitializing(false);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [isOpen, facingMode]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 640;

    // Crop center square
    const size = Math.min(vWidth, vHeight);
    const startX = (vWidth - size) / 2;
    const startY = (vHeight - size) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Flip horizontally if front camera for natural mirror effect
    if (facingMode === 'user') {
      ctx.translate(1000, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, 1000, 1000);

    const dataUrl = canvas.toDataURL('image/png');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        await img.decode();
      } catch (e) {
        // ignore decode error if loaded
      }
      stopStream();
      onCapture(img);
    };

    img.src = dataUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#083020] border-4 border-[#FFD700] max-w-lg w-full p-5 space-y-4 shadow-[8px_8px_0px_0px_#FF1493] text-left relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-[#FFD700] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF1493] border border-white flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bebas text-3xl text-[#FFD700] uppercase tracking-wide font-black">
              LIVE CAMERA ACCESS
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-[#FF1493] font-mono-code font-bold text-xl p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative w-full aspect-square bg-black border-4 border-white overflow-hidden flex items-center justify-center">
          {error ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-[#FF1493] mx-auto" />
              <p className="font-mono-code text-xs text-white uppercase font-bold">{error}</p>
              <button
                onClick={handleClose}
                className="bg-[#FFD700] text-[#0B402B] px-4 py-2 font-bebas text-xl uppercase font-black"
              >
                Close & Use File Upload
              </button>
            </div>
          ) : (
            <>
              {isInitializing && (
                <div className="absolute inset-0 z-10 bg-[#083020] flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
                  <span className="font-mono-code text-xs text-[#FFD700] font-bold uppercase">
                    STARTING WEBCAM...
                  </span>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'transform -scale-x-100' : ''
                }`}
              />

              {/* Viewport Reticle overlay */}
              <div className="absolute inset-0 border-2 border-dashed border-[#FFD700]/60 pointer-events-none m-6" />
              <div className="absolute bottom-3 left-3 bg-[#083020]/90 px-2.5 py-1 border border-[#FFD700] font-mono-code text-[11px] text-[#FFD700] font-bold uppercase">
                1:1 LIVE STREAM
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        {!error && (
          <div className="flex gap-3">
            <button
              onClick={toggleFacingMode}
              disabled={isInitializing}
              className="bg-[#0B402B] hover:bg-[#0d4a32] text-white border-2 border-[#FFD700] p-3 font-mono-code text-xs font-bold uppercase flex items-center gap-1.5 transition-colors"
              title="Switch Camera"
            >
              <RefreshCw className="w-4 h-4 text-[#FFD700]" />
              <span className="hidden sm:inline">Flip</span>
            </button>

            <button
              onClick={capturePhoto}
              disabled={isInitializing}
              className="flex-1 bg-[#FFD700] hover:bg-white text-[#0B402B] border-2 border-[#0B402B] py-3 px-4 font-bebas text-2xl uppercase font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#FF1493] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Camera className="w-6 h-6 text-[#0B402B]" />
              TAKE SNAPSHOT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
