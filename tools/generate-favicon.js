// Generate favicon.ico from SVG logo using sharp + png-to-ico
// Outputs: /favicon.ico (sizes: 16, 32, 48)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

(async () => {
  try {
    const logoSvg = path.resolve(__dirname, '..', 'assets', 'images', 'logo.svg');
    const tempDir = path.resolve(__dirname, '..', '.tmp_favicon');
    const outIco = path.resolve(__dirname, '..', 'favicon.ico');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const sizes = [16, 32, 48];
    const pngPaths = [];
    for (const size of sizes) {
      const outPng = path.join(tempDir, `favicon-${size}.png`);
      await sharp(logoSvg)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(outPng);
      pngPaths.push(outPng);
    }

    const icoBuffer = await pngToIco(pngPaths);
    fs.writeFileSync(outIco, icoBuffer);
    // Cleanup temp folder
    for (const p of pngPaths) fs.unlinkSync(p);
    fs.rmdirSync(tempDir);
    console.log('Generated favicon.ico');
  } catch (err) {
    console.error('Failed to generate favicon.ico:', err);
    process.exit(1);
  }
})();
