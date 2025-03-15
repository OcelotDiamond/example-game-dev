const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const particles = [];
const maxLifetime = 60;
const particleSize = 10;
const distance = 15;
let keys = {};

function onKeyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function onKeyUp(event) {
    delete keys[event.key.toLowerCase()];
}

const last = {x: -1000, y: -1000};

function onMouseMove(event) {
    const dx = last.x - event.offsetX;
    const dy = last.y - event.offsetY;
    if (dx * dx + dy * dy > distance * distance) {
        last.x = event.offsetX;
        last.y = event.offsetY;

        particles.push({
            color: '#e98537',
            x: event.offsetX - particleSize * 0.5,
            y: event.offsetY - particleSize * 0.5,
            dx: 0,
            dy: 0,
            age: maxLifetime
        });
    }
}

let mouseDownTime = 0;

function particleRing(event, particleColor) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            color: particleColor,
            x: event.offsetX - particleSize * 0.5 + Math.cos(i * Math.PI * 0.25) * distance,
            y: event.offsetY - particleSize * 0.5 + Math.sin(i * Math.PI * 0.25) * distance,
            dx: Math.cos(i * Math.PI * 0.25) * 0.25,
            dy: Math.sin(i * Math.PI * 0.25) * 0.25,
            age: maxLifetime
        });
    }
}

function onMouseDown(event) {
    mouseDownTime = Date.now();
    particleRing(event, '#36c5f4');
}

function onMouseUp(event) {
    if (Date.now() - mouseDownTime > 200) {
        particleRing(event, '#ec273f');
    }
}

canvas.onmousemove = onMouseMove;
canvas.onmousedown = onMouseDown;
canvas.onmouseup = onMouseUp;
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;

function draw() {
    window.requestAnimationFrame(e => draw());
    ctx.font = '48px arial';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.age--;

        if (particle.age < 0) {
            particles.splice(i, 1);
            i--;
            continue;
        }
        
        ctx.globalAlpha = particle.age / maxLifetime;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particleSize, particleSize);
    }
    
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 1;
    ctx.fillText(Object.keys(keys), 10, 40);
}

draw();