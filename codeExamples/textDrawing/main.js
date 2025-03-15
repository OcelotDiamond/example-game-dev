const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.font = '32px arial';

ctx.fillText('You can make text:', 10, 40);

ctx.font = '48px arial';

ctx.save();
ctx.textAlign = 'center';
ctx.fillText('Centered', 200, 110);
ctx.restore();

ctx.save();
ctx.rotate(0.1 * Math.PI);
ctx.fillText('Rotated', 70, 160);
ctx.restore();

ctx.save();
ctx.fillStyle = '#ff0000';
ctx.fillText('Colored', 10, 280);
ctx.restore();

ctx.strokeText('Stroked', 200, 200);

ctx.save();
ctx.font = 'italic 48px arial';
ctx.fillText('Italicized', 200, 280);
ctx.restore();

ctx.scale(1.95, 1);
ctx.fillText('Stretched', 0, 360);