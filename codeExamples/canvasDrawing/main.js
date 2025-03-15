const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

for (let i = 0; i < 100; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(
        350 * Math.random(),
        350 * Math.random(),
        50,
        50);
}