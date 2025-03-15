const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const regions = [];

for (let i = 0; i < 20; i++) {
    regions.push({
        x: 350 * Math.random(),
        y: 350 * Math.random(),
        width: 20 + 30 * Math.random(),
        height: 20 + 30 * Math.random()
    });
}

let keys = {};

function onKeyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function onKeyUp(event) {
    keys[event.key.toLowerCase()] = false;
}

window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;

function aabbCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
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
}

function draw() {
    window.requestAnimationFrame(e => draw());
    
    update();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        
        if (aabbCheck(
            region.x, region.y, region.width, region.height,
            player.x, player.y, player.size, player.size)) {
                ctx.fillStyle = '#00dd33';
        } else {
                ctx.fillStyle = '#0033dd';
        }
        
        ctx.fillRect(region.x, region.y, region.width, region.height);
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.globalAlpha = 1;
}

draw();