const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = './public';

async function createTransparentLogo() {
  const inputPath = path.join(publicDir, 'hl-logo.jpg');
  const outputPath = path.join(publicDir, 'logo.png');
  
  try {
    // Read the image and convert white background to transparent
    await sharp(inputPath)
      .resize(400, null, { withoutEnlargement: true })
      .png()
      // Remove white background by making white pixels transparent
      .unflatten()
      .toFile(outputPath);
    
    const size = fs.statSync(outputPath).size;
    console.log(`✓ logo.png created: ${(size / 1024).toFixed(0)} KB`);
    
    // Also create a white version for dark backgrounds
    await sharp(inputPath)
      .resize(400, null, { withoutEnlargement: true })
      .negate({ alpha: false })
      .png()
      .toFile(path.join(publicDir, 'logo-white.png'));
    
    console.log('✓ logo-white.png created (inverted for dark backgrounds)');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

createTransparentLogo();
