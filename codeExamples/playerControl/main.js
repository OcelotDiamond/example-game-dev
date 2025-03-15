const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let keys = {};

function onKeyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function onKeyUp(event) {
    delete keys[event.key.toLowerCase()];
}

window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;

function clamp(min, max, n) {
    return Math.min(Math.max(n, min), max);
}


const player = {
    x: 0,
    y: 0,
    size: 50
}

function update() {
    let dx = 0;
    let dy = 0;
    
    const speed = 3;

    if (keys.w) {
        dy -= speed;
    }
    if (keys.s) {
        dy += speed;
    }
    if (keys.a) {
        dx -= speed;
    }
    if (keys.d) {
        dx += speed;
    }
    
    player.x += dx;
    player.y += dy;

    player.x = clamp(0, 400 - player.size, player.x);
    player.y = clamp(0, 400 - player.size, player.y);
}

function draw() {
    window.requestAnimationFrame(e => draw());
    
    update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

draw();