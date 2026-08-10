export type AppState = 'empty' | 'processing' | 'result';

export type FramePreset = 'classic' | 'neo_badge' | 'terminal' | 'cyber_jungle';

export interface FrameOption {
  id: FramePreset;
  name: string;
  subtitle: string;
  accentColor: string;
}

export interface ImageAdjustments {
  scale: number;       // 0.5 to 3.0
  offsetX: number;     // -500 to 500 px offset
  offsetY: number;     // -500 to 500 px offset
  rotation: number;    // degrees: 0, 90, 180, 270 or arbitrary
  brightness: number; // 50 to 150 %
  contrast: number;   // 50 to 150 %
  saturation: number; // 0 to 200 %
  filter: 'normal' | 'jungle_vivid' | 'brutalist_bw' | 'golden_hour' | 'vintage_cyan';
}

export interface CustomBadgeOptions {
  roleText: string;     // e.g. "SHORTLISTED BUILDER", "AI ENGINEER", "FOUNDER"
  locationText: string; // e.g. "GOA, INDIA"
  dateText: string;     // e.g. "28-31 OCT 2026"
}
