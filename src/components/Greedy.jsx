export const Greedy = (
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

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Function to blend watermark with the image
    const applyBlending = () => {
      const watermarkData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const watermarkPixels = watermarkData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * 0.5 + watermarkPixels[i] * 0.5; // Equal blend
        data[i + 1] = data[i + 1] * 0.5 + watermarkPixels[i + 1] * 0.5; // Equal blend
        data[i + 2] = data[i + 2] * 0.5 + watermarkPixels[i + 2] * 0.5; // Equal blend
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (isSingleWatermark) {
      // Single watermark logic
      const fontSize = Math.floor(img.width / 15);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(26, 18, 18, 0.8)";
      ctx.lineWidth = 2;

      const textWidth = ctx.measureText(watermark).width;
      const textHeight = fontSize;
      const x = img.width / 2;
      const y = img.height / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.fillText(watermark, -textWidth / 2, textHeight / 4);
      ctx.restore();

      applyBlending();
    } else {
      // Multiple watermark logic
      const fontSize = Math.floor(img.width / 14);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(46, 44, 44, 0.6)";
      ctx.filter = "blur(0.9px)";

      const textWidth = ctx.measureText(watermark).width;
      const textHeight = fontSize;

      const horizontalSpacing = textWidth * 1.2;
      const verticalSpacing = textHeight * 1.5;

      for (let y = -canvas.height; y < canvas.height * 2; y += verticalSpacing) {
        for (let x = -canvas.width; x < canvas.width * 2; x += horizontalSpacing) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((-30 * Math.PI) / 180);
          ctx.fillText(watermark, 0, 0);
          ctx.restore();
        }
      }
      applyBlending();
    }
    
    setWatermarkImage(canvas.toDataURL());
  };
};
