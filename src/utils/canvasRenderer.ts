import { FramePreset, ImageAdjustments, CustomBadgeOptions } from '../types';

export const FRAME_PRESETS_LIST: { id: FramePreset; name: string; subtitle: string; accentColor: string }[] = [
  { id: 'classic', name: 'Jungle Brutalist', subtitle: 'Gold caution stripes & bold badges', accentColor: '#FFD700' },
  { id: 'neo_badge', name: 'Neo-Brutalist Pass', subtitle: 'High-voltage pink border & ticket stamp', accentColor: '#FF1493' },
  { id: 'terminal', name: 'Cyber Terminal', subtitle: 'Hacker house coordinates & mono tags', accentColor: '#FFD700' },
  { id: 'cyber_jungle', name: 'High Voltage', subtitle: 'Electric neon & tropical palm stamp', accentColor: '#FF1493' },
];

/**
 * Render image and HH Goa 2026 frame onto an HTML5 Canvas context
 */
export function renderFrameToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  preset: FramePreset,
  adjustments: ImageAdjustments,
  customBadge: CustomBadgeOptions
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // --- Step 1: Draw User Image with Transformations and Filters ---
  ctx.save();

  // Create clipping path for the photo area so frame borders fit cleanly
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.clip();

  // Background fill behind image in case user scales down
  ctx.fillStyle = '#0B402B';
  ctx.fillRect(0, 0, width, height);

  // Apply filters
  applyImageFilters(ctx, adjustments);

  // Translate to center for rotation and scaling
  const centerX = width / 2;
  const centerY = height / 2;
  ctx.translate(centerX + adjustments.offsetX, centerY + adjustments.offsetY);

  // Rotate
  if (adjustments.rotation) {
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
  }

  // Calculate cover scale
  const imgWidth = image.naturalWidth || image.width;
  const imgHeight = image.naturalHeight || image.height;
  const coverScale = Math.max(width / imgWidth, height / imgHeight) * adjustments.scale;

  const drawW = imgWidth * coverScale;
  const drawH = imgHeight * coverScale;

  // Draw image centered
  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();

  // --- Step 2: Render HH Goa 2026 Overlay Frame ---
  switch (preset) {
    case 'classic':
      drawClassicFrame(ctx, width, height, customBadge);
      break;
    case 'neo_badge':
      drawNeoBadgeFrame(ctx, width, height, customBadge);
      break;
    case 'terminal':
      drawTerminalFrame(ctx, width, height, customBadge);
      break;
    case 'cyber_jungle':
      drawCyberJungleFrame(ctx, width, height, customBadge);
      break;
    default:
      drawClassicFrame(ctx, width, height, customBadge);
  }
}

/**
 * Apply CSS-like filter string onto Canvas context
 */
function applyImageFilters(ctx: CanvasRenderingContext2D, adjustments: ImageAdjustments) {
  let filterString = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;

  switch (adjustments.filter) {
    case 'jungle_vivid':
      filterString += ' saturate(140%) contrast(110%)';
      break;
    case 'brutalist_bw':
      filterString += ' grayscale(100%) contrast(135%)';
      break;
    case 'golden_hour':
      filterString += ' sepia(30%) saturate(120%) brightness(105%)';
      break;
    case 'vintage_cyan':
      filterString += ' hue-rotate(180deg) saturate(90%) contrast(115%)';
      break;
  }

  ctx.filter = filterString;
}

// ==========================================
// FRAME 1: JUNGLE BRUTALIST CLASSIC
// ==========================================
function drawClassicFrame(ctx: CanvasRenderingContext2D, width: number, height: number, custom: CustomBadgeOptions) {
  const borderWidth = 48;

  // 1. Caution stripe outer border
  drawCautionBorder(ctx, width, height, borderWidth, '#FFD700', '#0B402B');

  // 2. Inner high-contrast border
  ctx.strokeStyle = '#FF1493';
  ctx.lineWidth = 10;
  ctx.strokeRect(borderWidth + 5, borderWidth + 5, width - (borderWidth + 5) * 2, height - (borderWidth + 5) * 2);

  // 3. Top-left Event Title Banner
  ctx.save();
  ctx.translate(borderWidth + 12, borderWidth + 12);

  // Dark block shadow
  ctx.fillStyle = '#083020';
  ctx.fillRect(8, 8, 380, 72);

  // Primary Gold Badge
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, 380, 72);
  ctx.strokeStyle = '#083020';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 380, 72);

  // Title Text
  ctx.fillStyle = '#0B402B';
  ctx.font = '900 48px "Bebas Neue", sans-serif';
  ctx.fillText('HH GOA 2026', 18, 52);

  // Tiny tag
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(250, 16, 110, 40);
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.fillText('PASS', 285, 42);
  ctx.restore();

  // 4. Top-Right Date Tag
  ctx.save();
  ctx.translate(width - borderWidth - 280, borderWidth + 12);
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, 0, 268, 48);
  ctx.strokeStyle = '#F4F4F4';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 268, 48);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillText(custom.dateText || '28-31 OCT 2026', 16, 32);
  ctx.restore();

  // 5. Bottom Main Banner
  ctx.save();
  const bannerH = 110;
  const bannerY = height - borderWidth - bannerH - 12;

  // Shadow
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(borderWidth + 20, bannerY + 8, width - borderWidth * 2 - 24, bannerH);

  // Banner box
  ctx.fillStyle = '#0B402B';
  ctx.fillRect(borderWidth + 12, bannerY, width - borderWidth * 2 - 24, bannerH);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 6;
  ctx.strokeRect(borderWidth + 12, bannerY, width - borderWidth * 2 - 24, bannerH);

  // Left text: "BUILDER RESIDENCY"
  ctx.fillStyle = '#FFD700';
  ctx.font = '900 44px "Bebas Neue", sans-serif';
  ctx.fillText('HACKER HOUSE GOA', borderWidth + 32, bannerY + 50);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '500 22px "Archivo Narrow", sans-serif';
  ctx.fillText(custom.locationText || 'GOA, INDIA • 100 BUILDERS', borderWidth + 32, bannerY + 86);

  // Right pill: custom user role
  const roleText = (custom.roleText || 'SHORTLISTED').toUpperCase();
  ctx.font = '900 28px "Bebas Neue", sans-serif';
  const roleWidth = Math.max(180, ctx.measureText(roleText).width + 36);

  ctx.fillStyle = '#FF1493';
  ctx.fillRect(width - borderWidth - roleWidth - 32, bannerY + 30, roleWidth, 52);
  ctx.strokeStyle = '#F4F4F4';
  ctx.lineWidth = 3;
  ctx.strokeRect(width - borderWidth - roleWidth - 32, bannerY + 30, roleWidth, 52);

  ctx.fillStyle = '#F4F4F4';
  ctx.fillText(roleText, width - borderWidth - roleWidth - 32 + (roleWidth - ctx.measureText(roleText).width) / 2, bannerY + 66);

  ctx.restore();

  // 6. Corner Accents
  drawStarStamp(ctx, borderWidth + 30, height - borderWidth - 180, 24, '#FFD700');
  drawStarStamp(ctx, width - borderWidth - 30, borderWidth + 100, 20, '#FF1493');
}

// ==========================================
// FRAME 2: NEO-BRUTALIST PASS OVERLAY
// ==========================================
function drawNeoBadgeFrame(ctx: CanvasRenderingContext2D, width: number, height: number, custom: CustomBadgeOptions) {
  // Heavy 32px solid pink outer margin
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, 0, width, 32);
  ctx.fillRect(0, height - 32, width, 32);
  ctx.fillRect(0, 0, 32, height);
  ctx.fillRect(width - 32, 0, 32, height);

  // Yellow inner hairline
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 8;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Top Left Round Stamp "GOA 2026 SHORTLISTED"
  ctx.save();
  ctx.translate(110, 110);
  ctx.rotate((-12 * Math.PI) / 180);

  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#083020';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#0B402B';
  ctx.font = '900 24px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA', 0, -20);
  ctx.font = '700 13px "Space Mono", monospace';
  ctx.fillText('2026', 0, 0);
  ctx.font = '900 22px "Bebas Neue", sans-serif';
  ctx.fillStyle = '#FF1493';
  ctx.fillText('VERIFIED', 0, 24);

  ctx.restore();

  // Diagonal Bar Across Bottom
  ctx.save();
  ctx.translate(50, height - 140);

  // Shadow
  ctx.fillStyle = '#083020';
  ctx.fillRect(10, 10, width - 100, 90);

  // Gold bar
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, width - 100, 90);
  ctx.strokeStyle = '#083020';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, width - 100, 90);

  ctx.fillStyle = '#0B402B';
  ctx.textAlign = 'left';
  ctx.font = '900 52px "Bebas Neue", sans-serif';
  ctx.fillText('HH GOA 2026', 24, 62);

  ctx.fillStyle = '#FF1493';
  ctx.fillRect(320, 18, 280, 54);
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillText('#FrameInGoa', 380, 52);

  // Custom role right
  const badgeVal = (custom.roleText || 'BUILDER RESIDENCY').toUpperCase();
  ctx.fillStyle = '#0B402B';
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(badgeVal, width - 130, 54);

  ctx.restore();

  // Top right hashtag box
  ctx.save();
  ctx.fillStyle = '#0B402B';
  ctx.fillRect(width - 320, 50, 270, 50);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.strokeRect(width - 320, 50, 270, 50);

  ctx.fillStyle = '#FFD700';
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(custom.dateText || '28-31 OCT 2026', width - 185, 82);
  ctx.restore();
}

// ==========================================
// FRAME 3: MINIMALIST CYBER TERMINAL
// ==========================================
function drawTerminalFrame(ctx: CanvasRenderingContext2D, width: number, height: number, custom: CustomBadgeOptions) {
  // Dark terminal border overlay
  const pad = 40;

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  // Corner tech ticks
  const tickLen = 30;
  ctx.strokeStyle = '#FF1493';
  ctx.lineWidth = 6;

  // TL
  ctx.beginPath();
  ctx.moveTo(pad - 10, pad + tickLen);
  ctx.lineTo(pad - 10, pad - 10);
  ctx.lineTo(pad + tickLen, pad - 10);
  ctx.stroke();

  // TR
  ctx.beginPath();
  ctx.moveTo(width - pad + 10, pad + tickLen);
  ctx.lineTo(width - pad + 10, pad - 10);
  ctx.lineTo(width - pad - tickLen, pad - 10);
  ctx.stroke();

  // BL
  ctx.beginPath();
  ctx.moveTo(pad - 10, height - pad - tickLen);
  ctx.lineTo(pad - 10, height - pad + 10);
  ctx.lineTo(pad + tickLen, height - pad + 10);
  ctx.stroke();

  // BR
  ctx.beginPath();
  ctx.moveTo(width - pad + 10, height - pad - tickLen);
  ctx.lineTo(width - pad + 10, height - pad + 10);
  ctx.lineTo(width - pad - tickLen, height - pad + 10);
  ctx.stroke();

  // Top terminal header bar
  ctx.fillStyle = '#083020';
  ctx.fillRect(pad + 10, pad + 10, width - (pad + 10) * 2, 60);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.strokeRect(pad + 10, pad + 10, width - (pad + 10) * 2, 60);

  ctx.fillStyle = '#FFD700';
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('> SYSTEM.HH_GOA_2026 // LAT: 15.2993° N  LON: 74.1240° E', pad + 30, pad + 46);

  // Status green pulse dot
  ctx.fillStyle = '#FF1493';
  ctx.beginPath();
  ctx.arc(width - pad - 40, pad + 40, 8, 0, Math.PI * 2);
  ctx.fill();

  // Bottom terminal bar
  ctx.fillStyle = '#083020';
  ctx.fillRect(pad + 10, height - pad - 110, width - (pad + 10) * 2, 100);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.strokeRect(pad + 10, height - pad - 110, width - (pad + 10) * 2, 100);

  ctx.fillStyle = '#FFD700';
  ctx.font = '900 48px "Bebas Neue", sans-serif';
  ctx.fillText('HH GOA 2026', pad + 30, height - pad - 50);

  ctx.fillStyle = '#FF1493';
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillText(`[ STATUS: ${custom.roleText || 'SHORTLISTED'} ]`, pad + 280, height - pad - 55);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '500 20px "Archivo Narrow", sans-serif';
  ctx.fillText(`${custom.locationText || 'GOA, INDIA'} • DATES: ${custom.dateText || '28-31 OCT 2026'}`, pad + 30, height - pad - 20);
}

// ==========================================
// FRAME 4: HIGH VOLTAGE CYBER JUNGLE
// ==========================================
function drawCyberJungleFrame(ctx: CanvasRenderingContext2D, width: number, height: number, custom: CustomBadgeOptions) {
  // Heavy vibrant gradient-style border effect
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, 0, width, 40);
  ctx.fillRect(0, height - 40, width, 40);

  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 40, 40, height - 80);
  ctx.fillRect(width - 40, 40, 40, height - 80);

  // Top header block
  ctx.fillStyle = '#0B402B';
  ctx.fillRect(50, 50, width - 100, 80);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, width - 100, 80);

  ctx.fillStyle = '#FFD700';
  ctx.font = '900 60px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA 2026', width / 2, 112);

  // Left stamp
  ctx.save();
  ctx.translate(140, 220);
  ctx.rotate((-15 * Math.PI) / 180);

  ctx.fillStyle = 'rgba(255, 20, 147, 0.95)';
  ctx.fillRect(-10, -10, 230, 60);
  ctx.strokeStyle = '#F4F4F4';
  ctx.lineWidth = 4;
  ctx.strokeRect(-10, -10, 230, 60);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '900 32px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SELECTED BUILDER', 105, 32);
  ctx.restore();

  // Bottom Footer
  ctx.fillStyle = '#083020';
  ctx.fillRect(50, height - 150, width - 100, 100);
  ctx.strokeStyle = '#FF1493';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, height - 150, width - 100, 100);

  ctx.fillStyle = '#FFD700';
  ctx.font = '900 48px "Bebas Neue", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('HACKER HOUSE GOA', 80, height - 90);

  ctx.fillStyle = '#F4F4F4';
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.fillText(`${custom.dateText || '28-31 OCT 2026'} | #FrameInGoa`, 80, height - 62);

  // Custom tag right
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(width - 320, height - 130, 240, 60);
  ctx.fillStyle = '#F4F4F4';
  ctx.font = '900 28px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText((custom.roleText || 'GOA RESIDENCY').toUpperCase(), width - 200, height - 90);

  // Tropical Leaf Silhouettes on sides
  drawPalmSilhouette(ctx, 60, height - 180, '#FFD700');
  drawPalmSilhouette(ctx, width - 60, 160, '#FF1493');
}


// ==========================================
// DRAWING HELPERS
// ==========================================
function drawCautionBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bw: number,
  c1: string,
  c2: string
) {
  ctx.save();
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, w, h);

  // Clip out center photo area
  ctx.beginPath();
  ctx.rect(bw, bw, w - bw * 2, h - bw * 2);
  ctx.fillStyle = '#000000';
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Draw diagonal stripes inside the border area
  const stripeWidth = 24;
  ctx.fillStyle = c2;
  ctx.beginPath();
  for (let x = -h; x < w + h; x += stripeWidth * 2) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth - h, h);
    ctx.lineTo(x - h, h);
  }
  ctx.fill();

  ctx.restore();
}

function drawStarStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      Math.cos(((18 + i * 72) * Math.PI) / 180) * size + cx,
      -Math.sin(((18 + i * 72) * Math.PI) / 180) * size + cy
    );
    ctx.lineTo(
      Math.cos(((54 + i * 72) * Math.PI) / 180) * (size / 2) + cx,
      -Math.sin(((54 + i * 72) * Math.PI) / 180) * (size / 2) + cy
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPalmSilhouette(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Generate a sample test image on a canvas (so user can instantly test without upload if desired)
 */
export function generateSampleImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    // Tropical beach sunset gradient background
    const grad = ctx.createLinearGradient(0, 0, 800, 800);
    grad.addColorStop(0, '#0B5D3B');
    grad.addColorStop(0.5, '#126D48');
    grad.addColorStop(1, '#121414');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    // Decorative geometric builder portrait graphic
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(400, 320, 160, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#121414';
    ctx.beginPath();
    ctx.arc(340, 300, 24, 0, Math.PI * 2);
    ctx.arc(460, 300, 24, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#121414';
    ctx.beginPath();
    ctx.arc(400, 350, 60, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Shoulders
    ctx.fillStyle = '#FF2D55';
    ctx.beginPath();
    ctx.ellipse(400, 680, 280, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    // Code lines / Developer vibe background text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.fillText('function buildHHGoa2026() {', 60, 100);
    ctx.fillText('  const residency = "GOA_OCT_2026";', 60, 140);
    ctx.fillText('  return shortlist.ship();', 60, 180);
    ctx.fillText('}', 60, 220);

    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}
