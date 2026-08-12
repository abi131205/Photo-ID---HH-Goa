import React, { useState } from 'react';
import { AppState } from './types';
import { Header } from './components/Header';
import { UploadDropzone } from './components/UploadDropzone';
import { ProcessingLoader } from './components/ProcessingLoader';
import { FrameCanvasEditor } from './components/FrameCanvasEditor';
import { CameraModal } from './components/CameraModal';
import { loadImageFromFile } from './utils/imageLoader';
import { generateSampleImage } from './utils/canvasRenderer';

export default function App() {
  const [appState, setAppState] = useState<AppState>('empty');
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Process user file upload
  const handleFileSelected = async (file: File) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setAppState('processing');

      // Decode image file (handles JPG, PNG, WEBP, HEIC)
      const image = await loadImageFromFile(file);

      // Transition to result view
      setTimeout(() => {
        setCurrentImage(image);
        setAppState('result');
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error loading image:', err);
      setErrorMessage('Unable to load photo. Please try a JPG, PNG, or WEBP image.');
      setAppState('empty');
      setIsLoading(false);
    }
  };

  // Process live camera snapshot
  const handleCameraCaptured = (image: HTMLImageElement) => {
    setIsCameraOpen(false);
    setIsLoading(true);
    setErrorMessage(null);
    setAppState('processing');

    setTimeout(() => {
      setCurrentImage(image);
      setAppState('result');
      setIsLoading(false);
    }, 800);
  };

  // Demo image trigger
  const handleDemoSelected = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setAppState('processing');

      const demoImg = await generateSampleImage();

      setTimeout(() => {
        setCurrentImage(demoImg);
        setAppState('result');
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error generating demo photo:', err);
      setErrorMessage('Failed to generate demo photo.');
      setAppState('empty');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState('empty');
    setCurrentImage(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0B402B] bg-grid-pattern text-[#F4F4F4] flex flex-col justify-between selection:bg-[#FF1493] selection:text-white">
      {/* Navigation Header */}
      <Header
        onReset={handleReset}
        hasImage={appState === 'result'}
      />

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-[#FF1493] text-white px-4 py-3 font-mono-code text-xs sm:text-sm font-bold text-center border-b-2 border-white flex items-center justify-between max-w-xl mx-auto my-2 w-full">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-4 underline hover:text-[#FFD700]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area according to State */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full">
        {appState === 'empty' && (
          <UploadDropzone
            onFileSelected={handleFileSelected}
            onDemoSelected={handleDemoSelected}
            onOpenCamera={() => setIsCameraOpen(true)}
            isLoading={isLoading}
          />
        )}

        {appState === 'processing' && <ProcessingLoader />}

        {appState === 'result' && currentImage && (
          <FrameCanvasEditor image={currentImage} onReset={handleReset} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full bg-[#083020] border-t-2 border-[#FFD700] py-4 px-4 text-center font-mono-code text-xs text-gray-300">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-[#FFD700]">HH GOA 2026</strong> • Hacker House Builder Residency
          </div>
          <div>
            Hashtag: <span className="text-[#FF1493] font-bold">#FrameInGoa</span> • 28-31 OCT 2026
          </div>
        </div>
      </footer>

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCaptured}
      />
    </div>
  );
}
