const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function lerp(t, a0, a1) {
    return a0 + (a1 - a0) * t;
}

function none(t) {
    return t;
}

function easeIn(t) {
    return t * t * t * t;
}

function easeOut(t) {
    const inv = 1 - t;
    return 1 - inv * inv * inv * inv;
}

function easeInOut(t) {
    if (t < 0.5) {
        return 8 * t * t * t * t;
    } else {
        const inv = 1 - t;
        return 1 - 8 * inv * inv * inv * inv;
    }
}

const easingFunctions = [
    none,
    easeIn,
    easeOut,
    easeInOut
];

let currentFunction = none;

const select = document.querySelector('select');

select.onchange = e => {
    currentFunction = easingFunctions[parseInt(select.value)];
}

const targetSize = 20;

const targets = [
    {
        x: 100,
        y: 100,
        active: false
    }, {
        x: 300,
        y: 300,
        active: false
    }
];

const particleSize = 10;

const particles = [];

const particleCount = 5;
for (let i = 0; i < particleCount; i++) {
    particles.push(i / particleCount);
}

let logCount = 0;
let then = Date.now();

function onMouseDown(event) {
    const x = event.offsetX + targetSize * 0.5;
    const y = event.offsetY + targetSize * 0.5;

    for (let i = 0; i < targets.length; i++) {
        if (targets[i].x < x && targets[i].y < y &&
            targets[i].x + targetSize > x &&
            targets[i].y + targetSize > y) {
            const previous = targets[i].active;
            for (let j = 0; j < targets.length; j++) {
                targets[j].active = false;
            }
            targets[i].active = true;
            return;
        }
    }
    
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].active) {
            targets[i].x = event.offsetX;
            targets[i].y = event.offsetY;
            targets[i].active = false;
        }
    }
}

canvas.onmousedown = onMouseDown;

function draw(dt) {
    window.requestAnimationFrame(e => draw(Date.now() - then));
    then = Date.now();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f3a833';
    for (let i = 0; i < particles.length; i++) {
        particles[i] = (particles[i] + dt / 5000) % 1;
        
        const x = lerp(currentFunction(particles[i]), targets[0].x, targets[1].x) - particleSize * 0.5;
        const y = lerp(currentFunction(particles[i]), targets[0].y, targets[1].y) - particleSize * 0.5;
        
        ctx.fillRect(x, y, particleSize, particleSize);
    }
    
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].active) {
            ctx.fillStyle = '#3388de';
        } else {
            ctx.fillStyle = '#36c5f4';
        }

        ctx.fillRect(targets[i].x - targetSize * 0.5, targets[i].y - targetSize * 0.5, targetSize, targetSize);
    }
}

draw(0);