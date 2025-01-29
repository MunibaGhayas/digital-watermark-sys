export const DivideAndConquer = (
  image,
  watermark,
  setWatermarkImage,
  isSingleWatermark
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = image;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.willReadFrequently = true;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const applyBlending = () => {
      const watermarkData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const watermarkPixels = watermarkData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * 0.5 + watermarkPixels[i] * 0.5; 
        data[i + 1] = data[i + 1] * 0.5 + watermarkPixels[i + 1] * 0.5; 
        data[i + 2] = data[i + 2] * 0.5 + watermarkPixels[i + 2] * 0.5; 
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (isSingleWatermark) {
      const fontSize = Math.floor(img.width / 10);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(26, 18, 18, 0.6)";
      ctx.filter = "blur(1px)";

      const textWidth = ctx.measureText(watermark).width;
      const textHeight = fontSize;

      const x = img.width / 2;
      const y = img.height / 2;

      ctx.save();
      ctx.translate(x, y);
      const angle = (-30 * Math.PI) / 180;
      ctx.rotate(angle);
      ctx.fillText(watermark, -textWidth / 2, textHeight / 4); // Fill text
      ctx.restore();

      applyBlending();
    } else {
      const tileSize = Math.floor(img.width / 8);
      const fontSize = Math.max(Math.floor(tileSize / 3), 10);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.filter = "blur(0.9px)";

      for (let y = 0; y < img.height; y += tileSize) {
        for (let x = 0; x < img.width; x += tileSize) {
          ctx.save();
          ctx.translate(x, y);
          const angle = (-30 * Math.PI) / 180;
          ctx.rotate(angle);
          ctx.fillText(watermark, -tileSize / 4, tileSize / 4); 
          ctx.restore();
        }
      }
      applyBlending();
    }
    setWatermarkImage(canvas.toDataURL());
  };
};
