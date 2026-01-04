const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = './public';
const images = [
  'hero.jpg',
  'IMG_6043.jpg',
  'DSC06956.jpg',
  'IMG_3594.jpg',
  'IMG_3595.jpg',
  'IMG_4279.jpg'
];

async function optimizeImages() {
  for (const img of images) {
    // Use the backup as source if it exists (original full quality)
    const backupPath = path.join(publicDir, `original_${img}`);
    const inputPath = fs.existsSync(backupPath) ? backupPath : path.join(publicDir, img);
    const outputPath = path.join(publicDir, `opt_${img}`);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${img} - not found`);
      continue;
    }

    try {
      const metadata = await sharp(inputPath).metadata();
      
      // Resize to max 1920px wide, maintain aspect ratio
      const maxWidth = 1920;
      const newWidth = Math.min(metadata.width, maxWidth);
      
      await sharp(inputPath)
        .resize(newWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true })
        .toFile(outputPath);
      
      const newSize = fs.statSync(outputPath).size;
      console.log(`✓ opt_${img}: ${(newSize / 1024).toFixed(0)} KB`);
    } catch (err) {
      console.error(`Error processing ${img}:`, err.message);
    }
  }
  
  console.log('\nDone! Optimized images saved with opt_ prefix.');
  console.log('Stop ng serve, then rename opt_*.jpg to replace originals.');
}

optimizeImages();
