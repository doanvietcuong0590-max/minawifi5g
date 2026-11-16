/**
 * Client-side Image Compressor for WifiGo Japan
 * Compresses uploaded images to fit well under Firestore's 1MB document limit.
 * Resizes images to max 800px and 0.75 JPEG quality (~40KB - 90KB).
 */

export async function compressImage(
  fileOrDataUrl: File | string,
  maxDimension = 800,
  quality = 0.75
): Promise<string> {
  // If it's already a web URL (http/https), no compression needed
  if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
    return fileOrDataUrl;
  }

  // If it's a data URL that is already tiny (< 80KB string length), return as is
  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:') && fileOrDataUrl.length < 80000) {
    return fileOrDataUrl;
  }

  return new Promise((resolve) => {
    let objectUrl: string | null = null;
    let srcUrl = '';

    if (typeof fileOrDataUrl === 'string') {
      srcUrl = fileOrDataUrl;
    } else if (typeof fileOrDataUrl === 'object' && fileOrDataUrl !== null) {
      try {
        objectUrl = URL.createObjectURL(fileOrDataUrl);
        srcUrl = objectUrl;
      } catch {
        srcUrl = '';
      }
    }

    if (!srcUrl) {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      return;
    }

    const img = new Image();
    // Only set crossOrigin for remote http/https URLs, NEVER for data: or blob:
    if (srcUrl.startsWith('http://') || srcUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          /* ignore */
        }
      }
    };

    const handleLoad = () => {
      try {
        let { width, height } = img;
        if (!width || !height) {
          cleanup();
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Fill white background in case of transparent PNGs when converting to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let result = canvas.toDataURL('image/jpeg', quality);
        // If still large (> 150KB), compress with lower quality
        if (result.length > 150000) {
          result = canvas.toDataURL('image/jpeg', 0.55);
        }
        cleanup();
        resolve(result);
      } catch (err) {
        console.warn('Canvas compression error fallback:', err);
        cleanup();
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.onload = handleLoad;
    img.onerror = () => {
      cleanup();
      // If objectUrl failed, try fallback with FileReader if it's a file
      if (typeof fileOrDataUrl !== 'string' && fileOrDataUrl instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fallbackData = (e.target?.result as string) || '';
          resolve(fallbackData);
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
      } else {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.src = srcUrl;
  });
}
