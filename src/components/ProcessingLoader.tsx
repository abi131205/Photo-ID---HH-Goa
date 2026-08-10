import React from 'react';
import { Hourglass } from 'lucide-react';

export const ProcessingLoader: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 flex flex-col items-center justify-center text-center gap-8">
      {/* Animated Caution Square */}
      <div className="w-48 h-48 stripes-gold-green border-4 border-white flex items-center justify-center shadow-brutal-pink animate-pulse">
        <div className="w-32 h-32 bg-[#0B402B] border-2 border-[#FFD700] flex flex-col items-center justify-center gap-2 p-4">
          <Hourglass className="w-10 h-10 text-[#FFD700] animate-spin" />
          <span className="font-bebas text-xl text-[#FFD700] uppercase tracking-wider font-black">
            PROCESSING
          </span>
        </div>
      </div>

      <div className="w-full space-y-3">
        <h2 className="font-bebas text-4xl sm:text-5xl text-[#FFD700] uppercase tracking-wider font-black">
          BUILDING YOUR FRAME...
        </h2>
        
        {/* Progress bar container */}
        <div className="w-full h-4 bg-[#083020] border-2 border-white overflow-hidden p-0.5">
          <div className="h-full bg-[#FF1493] animate-loader-bar" />
        </div>

        <p className="font-mono-code text-xs text-[#FF1493] uppercase font-bold">
          Auto-cropping photo & applying HH Goa 2026 brand vectors
        </p>
      </div>
    </div>
  );
};

