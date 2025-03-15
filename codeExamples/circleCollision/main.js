const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const regions = [];

for (let i = 0; i < 20; i++) {
    regions.push({
        x: 340 * Math.random() + 30,
        y: 340 * Math.random() + 30,
        radius: 10 + 20 * Math.random()
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

function circleCheck(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radiusSum = r1 + r2;
    
    return dx * dx + dy * dy <= radiusSum * radiusSum;
}

const player = {
    x: 20,
    y: 20,
    radius: 20
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
        
        if (circleCheck(
            region.x, region.y, region.radius,
            player.x, player.y, player.radius)) {
                ctx.fillStyle = '#00dd33';
        } else {
                ctx.fillStyle = '#0033dd';
        }
        
        ctx.beginPath();
        ctx.arc(region.x, region.y, region.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

draw();