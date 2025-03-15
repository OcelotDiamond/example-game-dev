const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let displayMultiplier;

const mouse = {
    x: 0,
    y: 0,
    down: false
};

let keys = {};

function keyDown(event) {
    keys[event.key.toLowerCase()] = true;
}

function keyUp(event) {
    if (typeof(keys[event.key.toLowerCase()]) !== 'undefined') {
        delete keys[event.key.toLowerCase()];
    }
}

function onBlur(event) {
    keys = {};
    mouse.down = false;
}

function mouseMove(event) {
    mouse.x = event.offsetX / displayMultiplier;
    mouse.y = event.offsetY / displayMultiplier;
}

function mouseUp(event) {
    mouse.down = false;
}

function mouseDown(event) {
    mouse.down = true;
}

window.onkeydown = keyDown;
window.onkeyup = keyUp;

window.onblur = onBlur;

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;

window.onresize = () => {
    displayMultiplier = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 128);

    canvas.width = 128 * displayMultiplier;
    canvas.height = 128 * displayMultiplier;
}

window.onresize();

function drawRect(ctx, x, y, w, h) {
    ctx.fillRect(x*displayMultiplier, y*displayMultiplier,
        w*displayMultiplier, h*displayMultiplier);
}

function drawPoly(ctx, offX, offY, points) {
    ctx.beginPath();
    ctx.moveTo(
        (points[0][0] + offX)*displayMultiplier,
        (points[0][1] + offY)*displayMultiplier);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(
            (points[i][0]+offX)*displayMultiplier,
            (points[i][1]+offY)*displayMultiplier);
    }
    ctx.closePath();
    ctx.fill();
}

function drawCircle(ctx, offx, offy, radius) {
    ctx.beginPath();
    ctx.arc(
        offx * displayMultiplier,
        offy * displayMultiplier,
        radius * displayMultiplier, 
        0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function circleCheck(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radiusSum = r1 + r2;
    
    return dx * dx + dy * dy <= radiusSum * radiusSum;
}

function drawText(ctx, x, y, str, size, bold = false) {
    ctx.font = `${bold?'bold ':''}${size * displayMultiplier}px 'Trebuchet MS'`;
    ctx.textAlign = 'center';
    ctx.fillText(str, x * displayMultiplier, y * displayMultiplier);
}