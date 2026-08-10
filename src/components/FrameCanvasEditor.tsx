import React, { useRef, useEffect, useState } from 'react';
import { 
  FramePreset, 
  ImageAdjustments, 
  CustomBadgeOptions 
} from '../types';
import { 
  renderFrameToCanvas, 
  FRAME_PRESETS_LIST 
} from '../utils/canvasRenderer';
import { 
  Download, 
  Share2, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Copy, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface FrameCanvasEditorProps {
  image: HTMLImageElement;
  onReset: () => void;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  filter: 'normal',
};

const DEFAULT_BADGE: CustomBadgeOptions = {
  roleText: 'SHORTLISTED BUILDER',
  locationText: 'GOA, INDIA',
  dateText: '28-31 OCT 2026',
};

const QUICK_ROLES = [
  'SHORTLISTED BUILDER',
  'AI ENGINEER',
  'FULLSTACK DEV',
  'FOUNDER',
  'UI/UX DESIGNER',
  'WEB3 HACKER',
];

export const FrameCanvasEditor: React.FC<FrameCanvasEditorProps> = ({ image, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<FramePreset>('classic');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [badgeOptions, setBadgeOptions] = useState<CustomBadgeOptions>(DEFAULT_BADGE);
  
  const [activeTab, setActiveTab] = useState<'presets' | 'adjust' | 'badge'>('presets');
  const [isCopied, setIsCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Re-render canvas whenever image, preset, adjustments or badge options change
  useEffect(() => {
    if (canvasRef.current && image) {
      renderFrameToCanvas(canvasRef.current, image, selectedPreset, adjustments, badgeOptions);
    }
  }, [image, selectedPreset, adjustments, badgeOptions]);

  // Handle Download Action
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `HH_Goa_2026_PFP_${badgeOptions.roleText.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Copy Image
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        } else {
          handleDownload();
        }
      }, 'image/png');
    } catch (err) {
      console.warn('Copy to clipboard failed:', err);
      handleDownload();
    }
  };

  // Open Share Modal
  const handleShareToX = () => {
    setShowShareModal(true);
  };

  const openTwitterIntentDirect = () => {
    const tweetText = encodeURIComponent(`Excited for HH Goa 2026! Here is my official shortlisted builder PFP frame 🌴⚡️ #FrameInGoa`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4 px-2">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#083020] p-3.5 border-2 border-[#FFD700] shadow-brutal-pink">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[#FFD700] hover:text-white font-mono-code text-xs font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Different Photo</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="bg-[#FF1493] text-white text-[10px] font-mono-code font-black px-2 py-0.5 uppercase border border-white">
            1:1 HD OVERLAY
          </span>
          <span className="text-xs font-mono-code text-[#FFD700] font-bold hidden sm:inline">
            1200x1200px Export Ready
          </span>
        </div>
      </div>

      {/* Main Grid: Left Canvas Preview, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4">
          <div className="w-full max-w-[420px] aspect-square relative bg-[#0B402B] border-4 border-white shadow-brutal-dark overflow-hidden group">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Quick Action Buttons Under Preview */}
          <div className="w-full max-w-[420px] grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="w-full bg-[#FFD700] hover:bg-white text-[#0B402B] border-2 border-[#0B402B] py-3 px-4 font-bebas text-2xl uppercase tracking-wider font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#FF1493] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Download className="w-5 h-5 text-[#0B402B]" />
              Download PFP
            </button>

            <button
              onClick={handleShareToX}
              className="w-full bg-[#FF1493] hover:bg-[#ff4da6] text-white border-2 border-[#0B402B] py-3 px-4 font-bebas text-2xl uppercase tracking-wider font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#FFD700] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-5 h-5 text-white" />
              Share to X
            </button>
          </div>

          <button
            onClick={handleCopyImage}
            className="w-full max-w-[420px] bg-[#083020] hover:bg-[#0c402b] text-[#FFD700] border-2 border-[#FFD700] py-2.5 px-3 font-mono-code text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-[#FF1493]" />
                <span className="text-white">Copied PNG to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#FF1493]" />
                <span>Copy High-Res PNG to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Editing Tabs & Adjustment Controls */}
        <div className="lg:col-span-6 bg-[#083020] border-2 border-[#FFD700] p-4 flex flex-col gap-4 shadow-brutal-pink">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#0B402B] p-1 border border-[#FFD700]">
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-2 px-1 text-center font-bebas text-xl uppercase tracking-wide transition-all ${
                activeTab === 'presets'
                  ? 'bg-[#FFD700] text-[#0B402B] font-black shadow-sm'
                  : 'text-gray-200 hover:bg-[#0d4a32]'
              }`}
            >
              1. Frame Style
            </button>
            <button
              onClick={() => setActiveTab('adjust')}
              className={`py-2 px-1 text-center font-bebas text-xl uppercase tracking-wide transition-all ${
                activeTab === 'adjust'
                  ? 'bg-[#FFD700] text-[#0B402B] font-black shadow-sm'
                  : 'text-gray-200 hover:bg-[#0d4a32]'
              }`}
            >
              2. Crop & Filter
            </button>
            <button
              onClick={() => setActiveTab('badge')}
              className={`py-2 px-1 text-center font-bebas text-xl uppercase tracking-wide transition-all ${
                activeTab === 'badge'
                  ? 'bg-[#FFD700] text-[#0B402B] font-black shadow-sm'
                  : 'text-gray-200 hover:bg-[#0d4a32]'
              }`}
            >
              3. Badge Text
            </button>
          </div>

          {/* TAB 1: FRAME PRESETS */}
          {activeTab === 'presets' && (
            <div className="flex flex-col gap-3">
              <span className="font-mono-code text-xs text-[#FFD700] uppercase font-bold">
                Select HH Goa 2026 Frame Design:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {FRAME_PRESETS_LIST.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`w-full text-left p-3 border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFD700] bg-[#0B402B] shadow-[3px_3px_0px_0px_#FF1493]'
                          : 'border-[#0d4a32] bg-[#062418] hover:border-[#FFD700]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          <span className="font-bebas text-2xl text-white uppercase tracking-wide font-black">
                            {preset.name}
                          </span>
                        </div>
                        <p className="font-mono-code text-[11px] text-[#FFD700]">
                          {preset.subtitle}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="bg-[#FF1493] text-white p-1 border border-white">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CROP & ADJUSTMENT CONTROLS */}
          {activeTab === 'adjust' && (
            <div className="flex flex-col gap-4">
              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono-code text-xs text-[#FFD700] font-bold">
                  <span>ZOOM / SCALE</span>
                  <span>{Math.round(adjustments.scale * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-gray-300" />
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={adjustments.scale}
                    onChange={(e) =>
                      setAdjustments({ ...adjustments, scale: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#FF1493] cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-gray-300" />
                </div>
              </div>

              {/* Rotate Buttons */}
              <div className="space-y-1">
                <span className="font-mono-code text-xs text-[#FFD700] font-bold">ROTATE PHOTO</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setAdjustments({
                        ...adjustments,
                        rotation: (adjustments.rotation - 90) % 360,
                      })
                    }
                    className="flex-1 bg-[#0B402B] hover:bg-[#0d4a32] border border-[#FFD700] py-2 text-xs font-mono-code font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5 transform -scale-x-100" />
                    -90° Left
                  </button>
                  <button
                    onClick={() =>
                      setAdjustments({
                        ...adjustments,
                        rotation: (adjustments.rotation + 90) % 360,
                      })
                    }
                    className="flex-1 bg-[#0B402B] hover:bg-[#0d4a32] border border-[#FFD700] py-2 text-xs font-mono-code font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    +90° Right
                  </button>
                </div>
              </div>

              {/* Offset Pan Arrows */}
              <div className="space-y-1">
                <span className="font-mono-code text-xs text-[#FFD700] font-bold">REPOSITION / PAN</span>
                <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto">
                  <div />
                  <button
                    onClick={() => setAdjustments({ ...adjustments, offsetY: adjustments.offsetY - 30 })}
                    className="bg-[#0B402B] hover:bg-[#FF1493] text-white p-2 font-mono-code font-bold text-center border border-[#FFD700]"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    onClick={() => setAdjustments({ ...adjustments, offsetX: adjustments.offsetX - 30 })}
                    className="bg-[#0B402B] hover:bg-[#FF1493] text-white p-2 font-mono-code font-bold text-center border border-[#FFD700]"
                  >
                    ◄
                  </button>
                  <button
                    onClick={() => setAdjustments({ ...adjustments, offsetX: 0, offsetY: 0 })}
                    className="bg-[#FFD700] text-[#0B402B] p-1 text-[10px] font-mono-code font-black text-center border border-[#0B402B]"
                    title="Center"
                  >
                    CENTER
                  </button>
                  <button
                    onClick={() => setAdjustments({ ...adjustments, offsetX: adjustments.offsetX + 30 })}
                    className="bg-[#0B402B] hover:bg-[#FF1493] text-white p-2 font-mono-code font-bold text-center border border-[#FFD700]"
                  >
                    ►
                  </button>
                  <div />
                  <button
                    onClick={() => setAdjustments({ ...adjustments, offsetY: adjustments.offsetY + 30 })}
                    className="bg-[#0B402B] hover:bg-[#FF1493] text-white p-2 font-mono-code font-bold text-center border border-[#FFD700]"
                  >
                    ▼
                  </button>
                  <div />
                </div>
              </div>

              {/* Color Preset Filters */}
              <div className="space-y-1.5 pt-2 border-t border-[#0d4a32]">
                <span className="font-mono-code text-xs text-[#FFD700] font-bold">COLOR FILTER PRESETS</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'normal', name: 'Normal' },
                    { id: 'jungle_vivid', name: 'Jungle Vivid' },
                    { id: 'brutalist_bw', name: 'Brutalist B&W' },
                    { id: 'golden_hour', name: 'Golden Hour' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setAdjustments({ ...adjustments, filter: f.id as any })}
                      className={`py-1.5 px-2 text-xs font-mono-code border transition-colors ${
                        adjustments.filter === f.id
                          ? 'bg-[#FF1493] text-white font-bold border-white'
                          : 'bg-[#062418] text-gray-200 border-[#0d4a32] hover:border-[#FFD700]'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Crop Button */}
              <button
                onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                className="text-xs font-mono-code text-[#FFD700] underline hover:text-white text-center mt-1"
              >
                Reset Image Adjustments
              </button>
            </div>
          )}

          {/* TAB 3: CUSTOM BADGE TEXT */}
          {activeTab === 'badge' && (
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="font-mono-code text-xs text-[#FFD700] uppercase block font-bold">
                  Custom Role / Moniker Badge:
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={badgeOptions.roleText}
                  onChange={(e) =>
                    setBadgeOptions({ ...badgeOptions, roleText: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. SHORTLISTED BUILDER"
                  className="w-full bg-[#0B402B] text-white border-2 border-[#FFD700] px-3 py-2 font-bebas text-2xl uppercase tracking-wider font-black focus:outline-none focus:border-[#FF1493]"
                />
              </div>

              {/* Quick Role Suggestions */}
              <div className="space-y-1.5">
                <span className="font-mono-code text-[11px] text-gray-300 font-bold">
                  1-Tap Role Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setBadgeOptions({ ...badgeOptions, roleText: role })}
                      className={`text-[11px] font-mono-code px-2 py-1 border transition-all ${
                        badgeOptions.roleText === role
                          ? 'bg-[#FFD700] text-[#0B402B] font-bold border-black'
                          : 'bg-[#062418] text-gray-200 border-[#0d4a32] hover:border-[#FFD700]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Dates & Location */}
              <div className="space-y-2 pt-2 border-t border-[#0d4a32]">
                <div>
                  <label className="font-mono-code text-[11px] text-gray-300 block font-bold">
                    Event Dates Label:
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={badgeOptions.dateText}
                    onChange={(e) => setBadgeOptions({ ...badgeOptions, dateText: e.target.value })}
                    className="w-full bg-[#062418] text-white border border-[#FFD700] px-2.5 py-1.5 font-mono-code text-xs"
                  />
                </div>

                <div>
                  <label className="font-mono-code text-[11px] text-gray-300 block font-bold">
                    Location Label:
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={badgeOptions.locationText}
                    onChange={(e) => setBadgeOptions({ ...badgeOptions, locationText: e.target.value })}
                    className="w-full bg-[#062418] text-white border border-[#FFD700] px-2.5 py-1.5 font-mono-code text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SHARE TO X MODAL GUIDANCE */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#083020] border-4 border-[#FFD700] max-w-lg w-full p-6 space-y-5 shadow-[8px_8px_0px_0px_#FF1493] text-left">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FF1493] border border-white flex items-center justify-center text-white font-bebas text-xl font-black">
                  X
                </div>
                <h3 className="font-bebas text-3xl text-[#FFD700] uppercase tracking-wide font-black">
                  SHARE TO X / TWITTER
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white hover:text-[#FF1493] font-mono-code font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="font-archivo text-base text-[#F4F4F4]">
              Browsers and Twitter/X web intent do not allow attaching local image files automatically via URL links. Follow these 2 easy steps:
            </p>

            <div className="space-y-3 bg-[#0B402B] p-4 border-2 border-[#FFD700]">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 bg-[#FFD700] text-[#0B402B] font-mono-code font-bold flex items-center justify-center text-sm flex-shrink-0">
                  1
                </span>
                <p className="font-mono-code text-xs text-white">
                  First, tap <strong className="text-[#FFD700]">"Download PFP"</strong> to save your framed image file to your phone/computer.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 bg-[#FFD700] text-[#0B402B] font-mono-code font-bold flex items-center justify-center text-sm flex-shrink-0">
                  2
                </span>
                <p className="font-mono-code text-xs text-white">
                  Next, tap <strong className="text-[#FFD700]">"Open Tweet Composer"</strong> and attach your saved PFP image in Twitter!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  handleDownload();
                }}
                className="flex-1 bg-[#FFD700] text-[#0B402B] border-2 border-[#0B402B] py-3 px-4 font-bebas text-2xl uppercase tracking-wider font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#FF1493] active:translate-x-0.5 active:translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                1. Download PFP
              </button>

              <button
                onClick={() => {
                  openTwitterIntentDirect();
                  setShowShareModal(false);
                }}
                className="flex-1 bg-[#FF1493] text-white border-2 border-white py-3 px-4 font-bebas text-2xl uppercase tracking-wider font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#FFD700] active:translate-x-0.5 active:translate-y-0.5"
              >
                <ExternalLink className="w-5 h-5" />
                2. Open Tweet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

