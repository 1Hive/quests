import { useEffect, useState } from 'react';

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onabort = () => reject(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

export default function useImagePreloader(imageList: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    const effect = async () => {
      if (isCancelled) {
        return;
      }

      await Promise.all(imageList.map(preloadImage));

      if (isCancelled) {
        return;
      }

      setImagesPreloaded(true);
    };

    effect();

    return () => {
      isCancelled = true;
    };
  }, [imageList]);

  return { imagesPreloaded };
}
