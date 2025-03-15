const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const sources = [
    'example1.jpg', // https://commons.wikimedia.org/wiki/File:Prionailurus_viverrinus_07.jpg
    'example2.jpg', // https://commons.wikimedia.org/wiki/File:Prionailurus_viverrinus_01.jpg
    'example3.jpg'  // https://commons.wikimedia.org/wiki/File:Fishing_cat_amidst_mangroves.jpg
];

const images = [];

function draw() {
    for (let i = 0; i < images.length; i++) {
        const scale = images[i].height / images[i].width;
        ctx.drawImage(images[i], 10 + 130*i , 10, 120, 120 * scale);

    }
}

let loadCounter = sources.length;

for (let i = 0; i < sources.length; i++) {
    images.push(new Image());
    images[i].onload = e => {
        loadCounter--;
        if (loadCounter === 0) {
            draw();
        }
    }

    images[i].src = sources[i];
}