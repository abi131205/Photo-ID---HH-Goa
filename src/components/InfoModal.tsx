import React from 'react';
import { Calendar, MapPin, Users, CheckCircle2, X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#083020] border-4 border-[#FFD700] max-w-xl w-full p-6 space-y-6 shadow-[10px_10px_0px_0px_#FF1493] text-left my-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#FFD700] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#FF1493] text-white text-xs font-mono-code font-black px-2 py-0.5 uppercase border border-white">
                BUILDER RESIDENCY
              </span>
            </div>
            <h3 className="font-bebas text-4xl text-[#FFD700] uppercase tracking-wide leading-none font-black">
              HH GOA 2026 RESIDENCY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#FF1493] font-mono-code font-bold text-xl p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Quick Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#0B402B] p-3 border-2 border-[#FFD700] flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#FFD700]" />
            <div>
              <span className="font-mono-code text-[10px] text-gray-300 font-bold block">DATES</span>
              <span className="font-bebas text-xl text-white font-black">28-31 OCT 2026</span>
            </div>
          </div>

          <div className="bg-[#0B402B] p-3 border-2 border-[#FFD700] flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-[#FF1493]" />
            <div>
              <span className="font-mono-code text-[10px] text-gray-300 font-bold block">LOCATION</span>
              <span className="font-bebas text-xl text-white font-black">GOA, INDIA</span>
            </div>
          </div>

          <div className="bg-[#0B402B] p-3 border-2 border-[#FFD700] flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#FFD700]" />
            <div>
              <span className="font-mono-code text-[10px] text-gray-300 font-bold block">COHORT</span>
              <span className="font-bebas text-xl text-white font-black">100 BUILDERS</span>
            </div>
          </div>
        </div>

        {/* Overview Body */}
        <div className="space-y-3 font-archivo text-base text-[#F4F4F4]">
          <p>
            <strong>Hacker House Goa 2026</strong> brings together 100 top builders, engineers, designers, and AI creators for a 4-day intensive builder residency on the tropical coast of Goa.
          </p>

          <div className="bg-[#062418] p-4 border border-[#FFD700] space-y-2">
            <h4 className="font-bebas text-2xl text-[#FFD700] uppercase font-black">
              HOW TO USE THIS PFP FRAME:
            </h4>
            <ul className="space-y-2 font-mono-code text-xs text-[#F4F4F4]">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                <span>Upload any photo & fine-tune the 1:1 square crop.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                <span>Select your favorite HH Goa 2026 frame style & custom role badge.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                <span>Download your high-resolution PFP PNG and update your X / Twitter, LinkedIn, and Discord profiles!</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF1493] flex-shrink-0" />
                <span>Post on X with hashtag <strong>#FrameInGoa</strong> to qualify for shortlisting.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#FFD700] hover:bg-white text-[#0B402B] border-2 border-[#0B402B] py-3 font-bebas text-2xl uppercase tracking-wider font-black shadow-[4px_4px_0px_0px_#FF1493] active:translate-x-0.5 active:translate-y-0.5"
        >
          Got It, Let's Build!
        </button>
      </div>
    </div>
  );
};

