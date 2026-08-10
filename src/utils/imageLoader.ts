import heic2any from 'heic2any';

/**
 * Loads a File into an HTMLImageElement handling JPG, PNG, WEBP, GIF and HEIC/HEIF files
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  let imageBlob: Blob = file;

  // Check if file is HEIC / HEIF
  const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif') || 
                 file.type === 'image/heic' || 
                 file.type === 'image/heif';

  if (isHeic) {
    try {
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      imageBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.warn('HEIC conversion failed, trying raw blob reader:', err);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error('Failed to decode image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file input'));
    reader.readAsDataURL(imageBlob);
  });
}
