const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, '..', 'images');

const files = [
  'og-index.svg',
  'og-index-variantA.svg',
  'og-index-variantB.svg',
  'og-about.svg',
  'og-업체.svg',
  'og-한도현금화.svg',
  'og-한도현금화-variantA.svg',
  'og-한도대출.svg',
  'og-상담.svg',
  'og-상담-variantA.svg',
  'og-소식지.svg'
];

async function convert() {
  if (!fs.existsSync(imagesDir)) {
    console.error('이미지 디렉터리가 없습니다:', imagesDir);
    process.exit(1);
  }

  for (const file of files) {
    const inPath = path.join(imagesDir, file);
    if (!fs.existsSync(inPath)) {
      console.warn('파일이 없음, 건너뜀:', inPath);
      continue;
    }

    const base = file.replace(/\.svg$/i, '');
    const outPng = path.join(imagesDir, `${base}.png`);
    const outWebp = path.join(imagesDir, `${base}.webp`);

    try {
      await sharp(inPath)
        .resize(1200, 630, { fit: 'cover' })
        .png({ quality: 90 })
        .toFile(outPng);

      await sharp(inPath)
        .resize(1200, 630, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outWebp);

      console.log('converted:', file, '->', path.basename(outPng), path.basename(outWebp));
    } catch (err) {
      console.error('error converting', file, err.message);
    }
  }
}

convert();
