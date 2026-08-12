import React, { useRef, useState } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  onDemoSelected: () => void;
  onOpenCamera: () => void;
  isLoading: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelected,
  onDemoSelected,
  onOpenCamera,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 py-4 px-2">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#FF1493] text-white px-3 py-1 font-mono-code text-xs font-black uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_0px_#FFD700] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>BUILDER RESIDENCY</span>
        </div>
        
        <h2 className="font-bebas text-6xl sm:text-7xl font-black text-[#FFD700] uppercase tracking-tighter leading-[0.9] drop-shadow-md">
          HH GOA 2026
        </h2>
        
        <p className="font-bebas text-2xl text-[#FF1493] font-black uppercase tracking-wider">
          28—31 OCT • PFP FRAME GENERATOR
        </p>

        <p className="font-archivo text-base sm:text-lg text-gray-200 max-w-md mx-auto leading-tight font-medium pt-1">
          Generate your official 1:1 HH Goa PFP frame. Upload a photo, capture live with webcam, or use demo.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-square border-4 border-dashed cursor-pointer transition-all p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-brutal-pink ${
          isDragOver
            ? 'border-[#FFD700] bg-[#0d4a32]'
            : 'border-[#FF1493] bg-[#0B402B] hover:bg-[#0d4a32]'
        }`}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Diagonal caution stripes accent in corner */}
        <div className="absolute top-0 right-0 w-28 h-28 stripes-gold-green opacity-20 pointer-events-none transform rotate-45 translate-x-10 -translate-y-10" />

        {/* Center Camera Icon */}
        <div className="w-24 h-24 bg-[#FF1493] border-4 border-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#FFD700] group-hover:scale-105 group-hover:rotate-2 transition-transform">
          <Camera className="w-12 h-12 text-white" />
        </div>

        <span className="font-bebas text-3xl sm:text-4xl text-[#FFD700] uppercase tracking-wider mb-2 font-black">
          TAP TO UPLOAD OR DRAG & DROP
        </span>

        <p className="font-mono-code text-xs text-[#F4F4F4] uppercase font-bold bg-[#083020] px-3 py-1 border border-[#FFD700] mt-1">
          SUPPORTS JPG, PNG, WEBP & HEIC
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-2 bg-[#FFD700] text-[#0B402B] border-2 border-[#0B402B] px-5 py-2.5 font-bebas text-2xl uppercase tracking-wider font-black shadow-[3px_3px_0px_0px_#FF1493] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Browse Files
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCamera();
            }}
            className="flex items-center gap-2 bg-[#083020] text-[#FFD700] border-2 border-[#FFD700] px-5 py-2.5 font-bebas text-2xl uppercase tracking-wider font-black shadow-[3px_3px_0px_0px_#FF1493] hover:bg-[#0B402B] active:translate-x-0.5 active:translate-y-0.5 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Live Camera
          </button>
        </div>
      </div>

      {/* Demo Photo CTA & Privacy note */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onDemoSelected}
          disabled={isLoading}
          className="w-full bg-[#083020] hover:bg-[#0c402b] border-2 border-[#FFD700] text-[#FFD700] py-3.5 px-4 font-mono-code text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-brutal-pink active:translate-x-0.5 active:translate-y-0.5"
        >
          <ImageIcon className="w-4 h-4 text-[#FF1493]" />
          <span>NO PHOTO HANDY? TEST WITH DEMO BUILDER PHOTO</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono-code text-gray-300">
          <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
          <span>100% Client-side processing • Photos never leave your device</span>
        </div>
      </div>
    </div>
  );
};

