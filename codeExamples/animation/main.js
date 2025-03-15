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

const particles = [];
const particleSize = 20;

for (let i = 0; i < 100; i++) {
    particles.push({
        color: getRandomColor(),
        x: (canvas.width - particleSize) * Math.random(),
        y: (canvas.height - particleSize) * Math.random(),
        dx: Math.random() - 0.5,
        dy: Math.random() - 0.5,
    });
}

function draw() {
    window.requestAnimationFrame(e => draw());

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        particle.x = (particle.x + particleSize * 2 + canvas.width) % (canvas.width + particleSize) - particleSize;
        particle.y = (particle.y + particleSize * 2 + canvas.height) % (canvas.height + particleSize) - particleSize;
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(
            particle.x,
            particle.y,
            particleSize,
            particleSize);
    }
}

draw();