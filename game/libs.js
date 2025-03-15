const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let displayMultiplier;

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
}

window.onkeydown = keyDown;
window.onkeyup = keyUp;

window.onblur = onBlur;

window.onresize = () => {
    displayMultiplier = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 128);

    canvas.width = 128 * displayMultiplier;
    canvas.height = 128 * displayMultiplier;
}

window.onresize();