import React from 'react';
import { Info, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  onOpenInfo: () => void;
  onReset?: () => void;
  hasImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo, onReset, hasImage }) => {
  return (
    <header className="w-full bg-[#083020] border-b-4 border-[#FFD700] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
        <div className="w-10 h-10 bg-[#FFD700] border-2 border-[#0B402B] flex items-center justify-center font-bebas text-2xl font-black text-[#0B402B] shadow-[3px_3px_0px_0px_#FF1493] transition-transform hover:scale-105">
          HH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bebas text-2xl sm:text-3xl text-[#FFD700] tracking-wider leading-none uppercase font-black">
              HH GOA 2026
            </h1>
            <span className="hidden sm:inline-block bg-[#FF1493] text-white text-[10px] font-mono-code font-black px-2 py-0.5 uppercase border border-white">
              FRAME GEN
            </span>
          </div>
          <p className="text-[11px] font-mono-code text-[#FF1493] font-bold hidden sm:block">
            28—31 OCT 2026 • OFFICIAL SHORTLIST TOOL
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {hasImage && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 bg-[#0B402B] hover:bg-[#0d4a32] text-[#FFD700] border-2 border-[#FFD700] px-3 py-1.5 text-xs font-mono-code font-black uppercase transition-all shadow-[2px_2px_0px_0px_#FF1493] active:translate-x-0.5 active:translate-y-0.5"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">New Photo</span>
          </button>
        )}

        <button
          onClick={onOpenInfo}
          className="flex items-center gap-1.5 bg-[#FF1493] hover:bg-[#ff4da6] text-white border-2 border-white px-3 py-1.5 text-xs font-mono-code font-black uppercase transition-all shadow-[2px_2px_0px_0px_#FFD700] active:translate-x-0.5 active:translate-y-0.5"
          title="HH Goa 2026 Info & Guidance"
        >
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">Event Info</span>
        </button>
      </div>
    </header>
  );
};

