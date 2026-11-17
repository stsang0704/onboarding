const MAX_EDGE = 640;

export function fileToPhotoDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please choose an image file."));
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that photo."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Please choose a JPG, PNG, or WebP photo."));
    };

    image.src = url;
  });
}
