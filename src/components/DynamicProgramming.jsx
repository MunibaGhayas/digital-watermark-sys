export const DP = (image, watermark, setWatermarkImage, isSingleWatermark) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure cross-origin images load properly
    img.src = image;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Memoization Cache (to store processed watermark tiles)
        const cache = new Map(); 

        if (isSingleWatermark) {
            // === Single Watermark (Directly on Main Canvas) ===
            const fontSize = Math.floor(img.width / 10);
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = "rgba(26, 18, 18, 0.6)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const x = img.width / 2;
            const y = img.height / 2;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((-30 * Math.PI) / 180);
            ctx.fillText(watermark, 0, 0);
            ctx.restore();
        } else {
            // === Multiple Watermarks (Avoid Overlapping) ===
            const watermarkCanvas = document.createElement("canvas");
            const watermarkCtx = watermarkCanvas.getContext("2d");

            watermarkCanvas.width = img.width;
            watermarkCanvas.height = img.height;
            watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height); // Clear previous drawings

            const tileSize = Math.floor(img.width / 6); // Increase spacing
            const fontSize = Math.floor(tileSize / 4); // Adjust font size relative to tile size
            watermarkCtx.font = `${fontSize}px Arial`;
            watermarkCtx.fillStyle = "rgba(27, 22, 22, 0.5)";
            watermarkCtx.textAlign = "center";
            watermarkCtx.textBaseline = "middle";

            const promises = []; // Array to hold the promises of image loading

            for (let y = tileSize / 2; y < img.height; y += tileSize * 1.5) {
                for (let x = tileSize / 2; x < img.width; x += tileSize * 1.5) {
                    // Memoization: Check if this tile has already been processed
                    const cacheKey = `${x}-${y}`; // Unique key for each tile
                    if (!cache.has(cacheKey)) {
                        // If the tile is not processed, create the watermark
                        watermarkCtx.save();
                        watermarkCtx.translate(x, y);
                        watermarkCtx.rotate((-30 * Math.PI) / 180);
                        watermarkCtx.fillText(watermark, 0, 0);
                        watermarkCtx.restore();

                        // Cache the processed tile data as a data URL
                        const tileData = watermarkCanvas.toDataURL();
                        cache.set(cacheKey, tileData);
                    }

                    // Use the cached tile data (draw it to the main canvas)
                    const cachedTileData = cache.get(cacheKey);
                    const tileImg = new Image();
                    tileImg.src = cachedTileData;

                    // Create a promise for the image loading
                    const tilePromise = new Promise((resolve) => {
                        tileImg.onload = () => {
                            // Draw the cached tile
                            ctx.drawImage(tileImg, x - tileSize / 2, y - tileSize / 2);
                            resolve();
                        };
                    });

                    promises.push(tilePromise); // Add the promise to the array
                }
            }

            // After all tiles are drawn, finalize the image
            Promise.all(promises).then(() => {
                setWatermarkImage(canvas.toDataURL());
            });
        }
    };
};
