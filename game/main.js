const stars = [];

for (let i = 0; i < 30; i++) {
    stars.push({
        x: 128 * Math.random(),
        y: 128 * Math.random(),
        cycle: Math.random() * Math.PI * 2
    });
}

let time = 0;
let start = 0;

const hookPoints = [];

const player = {
    x: 64,
    y: 120,
    dx: 0,
    dy: 0
};

for (let i = 0; i < 8; i++) {
    if (i % 4 === 2) {
        continue;
    }

    hookPoints.push({
        x: 64 + 48 * Math.cos(i * Math.PI * 0.25),
        y: 64 + 48 * Math.sin(i * Math.PI * 0.25),
        hovered: false,
        hoverTime: 0
    });
}

let hoverid = -1;
let enemyHealth = 0;
let isDead = false;

let enemyBullets = [];
let playerBullets = [];

const damageParticles = [];

let playerBulletCooldown = 40;
let enemyBulletCooldown = 30;

function update() {
    let isAnyHovered = false;
    for (let i = 0; i < hookPoints.length; i++) {
        let mouseRadius = 0;
        if (hookPoints) {
            mouseRadius = 3;
        }

        hookPoints[i].hovered = circleCheck(mouse.x, mouse.y, mouseRadius, hookPoints[i].x, hookPoints[i].y, 10);

        if (hookPoints[i].hovered) {
            hookPoints[i].hoverTime = Math.min(hookPoints[i].hoverTime + 1, 10);
            hoverid = i;
            isAnyHovered = true;
            if (mouse.down) {
                const xDiff = hookPoints[i].x - player.x;
                const yDiff = hookPoints[i].y - player.y;

                const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
                const power = 1 / Math.max(distance, 1);

                player.dx += xDiff * power * 0.05;
                player.dy += yDiff * power * 0.05;
            }
        } else {
            hookPoints[i].hoverTime = Math.max(hookPoints[i].hoverTime - 1, 0);
        }
    }

    if (playerBulletCooldown === 0 && enemyHealth > 0) {
        playerBulletCooldown = 40;
        const diffX = mouse.x - player.x;
        const diffY = mouse.y - player.y;

        const angle = Math.atan2(diffY, diffX);
        playerBullets.push({
            x: player.x,
            y: player.y,
            dx: Math.cos(angle),
            dy: Math.sin(angle)
        });
    } else {
        playerBulletCooldown--;
    }

    if (enemyBulletCooldown === 0 && enemyHealth > 0) {
        enemyBulletCooldown = 30;
        const diffX = player.x - 64;
        const diffY = player.y - 64;

        const angle = Math.atan2(diffY, diffX);
        enemyBullets.push({
            x: 64,
            y: 64,
            dx: Math.cos(angle),
            dy: Math.sin(angle)
        });
    } else {
        enemyBulletCooldown--;
    }

    if (!isAnyHovered) {
        hoverid = -1;
    }

    for (let i = 0; i < stars.length; i++) {
        stars[i].y -= 0.1;
        if (stars[i].y < -2.1875) {
            stars[i].y += 132.375;
            stars[i].x = 128 * Math.random();
        }

        stars[i].cycle += 0.025;
    }

    for (let i = 0; i < damageParticles.length; i++) {
        damageParticles[i].x += damageParticles[i].dx;
        damageParticles[i].y += damageParticles[i].dy;
        damageParticles[i].rot += damageParticles[i].dr;

        if (damageParticles[i].y < -10) {
            damageParticles.splice(i, 1);
            i--;
        }
    }

    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].x += enemyBullets[i].dx;
        enemyBullets[i].y += enemyBullets[i].dy;

        if (circleCheck(player.x, player.y, 2, enemyBullets[i].x, enemyBullets[i].y, 1)) {
            isDead = true;
            return;
        }
    }

    for (let i = 0; i < playerBullets.length; i++) {
        playerBullets[i].x += playerBullets[i].dx;
        playerBullets[i].y += playerBullets[i].dy;

        if (circleCheck(64, 64, 4, playerBullets[i].x, playerBullets[i].y, 1) && enemyHealth > 0) {
            playerBullets.splice(i, 1);
            enemyHealth--;
            for (let i = 0; i < (enemyHealth === 0 ? 20 : 7); i++) {
                damageParticles.push({
                    x: 61 + Math.random() * 6,
                    y: 60 + Math.random() * 2,
                    dx: (Math.random() - 0.5) * 0.5,
                    dy: -1 + Math.random() * 0.5,
                    rot: 0,
                    dr: (Math.random() - 0.5) * 0.0625
                });
            }
            i--;
            continue;
        }
    }

    player.x += player.dx;
    player.y += player.dy;

    player.dx *= 0.99;
    player.dy *= 0.99;

    if (player.x < -5) {
        player.x += 138;
    }

    if (player.y < -5) {
        player.y += 138;
    }

    if (player.x > 133) {
        player.x -= 138;
    }

    if (player.y > 133) {
        player.y -= 138;
    }

    isDead = circleCheck(64, 64, 4, player.x, player.y, 1) && enemyHealth > 0;
}

function draw() {
    if (!(keys[' '] && (enemyHealth === 0 || isDead))) {
        window.requestAnimationFrame(e => draw());
    } else {
        startGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (enemyHealth === 0) {
        ctx.shadowColor = '#edb1ed';
        ctx.shadowBlur = displayMultiplier * 3;
        drawText(ctx, 64, 64, 'You Win!', 10);
        drawText(ctx, 64, 80, 'Press Space to Restart', 5);
        ctx.shadowBlur = 0;
    } else if (isDead) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#9e1e2f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = displayMultiplier * 3;
        drawText(ctx, 64, 64, 'You Died', 10);
        drawText(ctx, 64, 80, 'Press Space to Restart', 5);
        ctx.shadowBlur = 0;

        document.querySelector(':root').style.setProperty('--bg', '#5f1132');
        return;
    }

    if (!isDead) {
        update();
    }

    for (let i = 0; i < stars.length; i++) {
        drawStar(stars[i].x, stars[i].y, stars[i].cycle, true);
    }

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < damageParticles.length; i++) {
        const poly = [];
        for (let n = 0; n < 3; n++) {
            const angle = damageParticles[i].rot + n * Math.PI * 2 / 3;
            poly.push([Math.cos(angle), Math.sin(angle)]);
        }
        ctx.shadowColor = '#edb1ed';
        ctx.shadowBlur = displayMultiplier * 3;
        drawPoly(ctx, damageParticles[i].x, damageParticles[i].y, poly);
        ctx.shadowBlur = 0;
    }

    drawPlayer(player.x, player.y);

    drawBullets();

    if (enemyHealth > 0) {
        drawEnemy(64, 64);
    }
}

function drawEnemy(x, y) {
    const enemyPoly = [[0, 3], [-2, -2], [0, -1], [2, -2]];

    for (let i = 0; i < enemyPoly.length; i++) {
        enemyPoly[i][0] *= 3;
        enemyPoly[i][1] *= 3;
    }
    
    ctx.shadowColor = '#edb1ed';
    ctx.shadowBlur = displayMultiplier * 3;
    ctx.fillStyle = '#ffffff';
    drawPoly(ctx, x, y, enemyPoly);
    ctx.shadowBlur = 0;
}

function drawBullets() {
    ctx.shadowColor = '#ff3033';
    ctx.shadowBlur = displayMultiplier * 2;
    ctx.fillStyle = '#ff3033';
    for (let i = 0; i < enemyBullets.length; i++) {
        drawCircle(ctx, enemyBullets[i].x, enemyBullets[i].y, 1);
    }

    
    ctx.shadowColor = '#71bde1';
    ctx.shadowBlur = displayMultiplier * 2;
    ctx.fillStyle = '#71bde1';
    for (let i = 0; i < playerBullets.length; i++) {
        drawCircle(ctx, playerBullets[i].x, playerBullets[i].y, 0.5);
    }
    ctx.shadowBlur = 0;
}

function drawPlayer(x, y) {
    if (hoverid !== -1) {
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x * displayMultiplier, y * displayMultiplier);
        ctx.lineTo(hookPoints[hoverid].x * displayMultiplier, hookPoints[hoverid].y * displayMultiplier);
        ctx.closePath();
        ctx.strokeStyle = '#8953b2';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    ctx.lineDashOffset = (Date.now() - start) / 100;

    for (let i = 0; i < hookPoints.length; i++) {
        drawHookPoint(hookPoints[i].x, hookPoints[i].y, hookPoints[i].hoverTime);
    }

    const diffX = mouse.x - x;
    const diffY = mouse.y - y;
    const angle = Math.atan2(diffY, diffX) + Math.PI * 0.5;

    const playerPoly = [[0, -3], [-2, 2], [0, 1], [2, 2]];
    for (let i = 0; i < playerPoly.length; i++) {
        const x = playerPoly[i][0];
        const y = playerPoly[i][1];

        playerPoly[i][0] = x * Math.cos(angle) - y * Math.sin(angle);
        playerPoly[i][1] = x * Math.sin(angle) + y * Math.cos(angle);
    }
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#edb1ed';
    ctx.shadowBlur = displayMultiplier * 3;
    drawPoly(ctx, x, y, playerPoly);
    ctx.shadowBlur = 0;
}

function drawStar(x, y, angle, first) {
    const modifier = first ? 1 : 0.5;
    const scale = (0.25 + Math.sin(angle) * 0.0625) * modifier;
    const arr = [[7*scale, 0], [0, 3*scale], [-7*scale, 0], [0, -3*scale]];

    if (first) {
        ctx.shadowBlur = displayMultiplier * 3;
        ctx.shadowColor = '#411f77';
        ctx.fillStyle = '#411f77';
    } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#64329a';
    }
    drawPoly(ctx, x, y, arr);
    for (let i = 0; i < 4; i++) {
        const interchange = arr[i][0];
        arr[i][0] = arr[i][1];
        arr[i][1] = interchange;
    }

    drawPoly(ctx, x, y, arr);

    if (first) {
        drawStar(x, y, angle, false);
    }
}

function drawHookPoint(x, y, hoverTime) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#120119';
    drawCircle(ctx, x, y, 10 + hoverTime / 10);
    drawCircle(ctx, x, y, 7);
    ctx.globalAlpha = 1;

    if (hoverTime > 0) {
        ctx.strokeStyle = '#ef86ef';
        ctx.shadowColor = '#ef86ef';
        ctx.shadowBlur = displayMultiplier * 3;
        ctx.beginPath();
        ctx.arc(
            x * displayMultiplier,
            y * displayMultiplier,
            (10 + hoverTime / 10) * displayMultiplier, 
            0, Math.PI * 2);
        ctx.closePath();
        ctx.setLineDash([10, 6, 6, 6]);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

function startGame() {
    document.querySelector(':root').style.setProperty('--bg', '#210435');

    isDead = false;
    enemyHealth = 20;
    playerBulletCooldown = 40;
    enemyBulletCooldown = 30;

    start = Date.now();

    playerBullets = [];
    enemyBullets = [];

    player.x = 64;
    player.y = 120;
    player.dx = 0;
    player.dy = 0;

    draw();
}

function titleScreen() {
    if (!keys[' ']) {
        window.requestAnimationFrame(e => titleScreen());
    } else {
        startGame();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
        drawStar(stars[i].x, stars[i].y, stars[i].cycle, true);
    }

    for (let i = 0; i < stars.length; i++) {
        stars[i].y -= 0.1;
        if (stars[i].y < -2.1875) {
            stars[i].y += 132.375;
            stars[i].x = 128 * Math.random();
        }

        stars[i].cycle += 0.025;
    }

    ctx.fillStyle = '#edb1ed';
    ctx.shadowColor = '#edb1ed';
    ctx.shadowBlur = displayMultiplier * 3;
    drawText(ctx, 64, 64, 'Gravity Swinger', 10);
    drawText(ctx, 64, 80, 'Press Space to Start', 5);
    drawText(ctx, 64, 90, 'Hold mouse down on the gravity anchors to move', 3);
    ctx.shadowBlur = 0;
}

titleScreen();