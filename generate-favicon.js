const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Draw a simple calendar icon
ctx.fillStyle = '#2563EB'; // blue color
ctx.fillRect(4, 6, 24, 20); // calendar body

// Draw date lines
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(6, 10, 20, 2); // top line

// Draw day markers
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 4; j++) {
    ctx.fillRect(8 + i * 6, 14 + j * 4, 2, 2);
  }
}

// Draw calendar tabs
ctx.fillRect(10, 2, 4, 4);
ctx.fillRect(18, 2, 4, 4);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon-32x32.png', buffer);

// Create 16x16 version
const canvas16 = createCanvas(16, 16);
const ctx16 = canvas16.getContext('2d');

ctx16.fillStyle = '#2563EB';
ctx16.fillRect(2, 3, 12, 10);
ctx16.fillStyle = '#FFFFFF';
ctx16.fillRect(3, 5, 10, 1);

// Save as PNG
const buffer16 = canvas16.toBuffer('image/png');
fs.writeFileSync('public/favicon-16x16.png', buffer16);

console.log('Favicon PNG files created successfully!');