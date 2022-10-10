/** @type{HTMLCanvasElement} */
import platform from '../img/platform.png';
import hills from '../img/hills.png';
import background from '../img/background.png';
import platformSmallTall from '../img/platformSmallTall.png';

import spriteRunLeft from '../img/spriteRunLeft.png';
import spriteRunRight from '../img/spriteRunRight.png';
import spriteStandLeft from '../img/spriteStandLeft.png';
import spriteStandRight from '../img/spriteStandRight.png';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
const gravity = 1.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.width = 66;
        this.height = 150;
        this.speed = 10;
        this.image = createImage(spriteStandRight);
        this.frames = 0;
        this.sprites = {
            stand:{
                right:createImage(spriteStandRight),
                left:createImage(spriteStandLeft),
                cropWidth :177,
                width :66,
            },
            run:{
                right:createImage(spriteRunRight),
                left:createImage(spriteRunLeft),
                cropWidth:341,
                width:127.875,
            }
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 177;
    }
    draw() {
        //c.fillStyle = "red";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.currentSprite, 
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y,
            this.width,
            this.height,
            );

    }
    update() {
        this.frames++;
        if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)){
            this.frames = 0;
        }else if(this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
            this.frames = 0;
        }
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            //this.velocity.y = 0;
        }

    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
        }
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
        }
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage(imageScr){
    const image = new Image();
    image.src = imageScr;
    return image;
}
let player = new Player();
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);
let platforms = [];
let genericObjects = []
const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    }
}
let currentKey = '';
let scrollOffset = 0;
function init () {
 player = new Player();
 platformImage = createImage(platform);

 platforms = [
new Platform({ x: platformImage.width*4 + 300 -2+ platformImage.width-platformSmallTallImage.width, y: 270 ,image:createImage(platformSmallTall)}),
new Platform({ x: -1, y: 470 ,image:platformImage}), new Platform({ x: platformImage.width-3, y: 470 ,image:platformImage}),
new Platform({ x: platformImage.width*2 + 100, y: 470 ,image:platformImage}),
new Platform({ x: platformImage.width*3 + 300, y: 470 ,image:platformImage}),
new Platform({ x: platformImage.width*4 + 300 -2, y: 470 ,image:platformImage}),
new Platform({ x: platformImage.width*5 + 700 -2, y: 470 ,image:platformImage}),
];
 genericObjects = [
    new GenericObject({
        x:-1,
        y:-1,
        image:createImage(background)
    }),
    new GenericObject({
        x:-1,
        y:-1,
        image:createImage(hills)
    }),
]

 scrollOffset = 0;

}


function animate() {
    requestAnimationFrame(animate);
    c.fillStyle='white';
    c.clearRect(0, 0, canvas.width, canvas.height);
    genericObjects.forEach( genericObject =>{
        genericObject.draw();
    })
   
    platforms.forEach(platform => {
        platform.draw();
    })
    player.update();

    if (keys.right.pressed && player.position.x < 400) player.velocity.x = player.speed;
    else if (keys.left.pressed && player.position.x > 100 || keys.left.pressed && scrollOffset == 0 && player.position.x>0) player.velocity.x = - player.speed;
    else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            scrollOffset += 5;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.x -=  player.speed*0.66;
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -=  player.speed;
            platforms.forEach(platform => {
                platform.position.x +=  player.speed;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.x +=  player.speed*0.66;
            })
        }
    }

    // platform collision dection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    });


if(keys.right.pressed && currentKey === 'right' && player.currentSprite !== player.sprites.run.right){
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
}else if (keys.left.pressed && currentKey === 'left' && player.currentSprite!== player.sprites.run.left){
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
}else if (!keys.left.pressed && currentKey === 'left' && player.currentSprite!== player.sprites.stand.left){
    player.frames = 1;
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
}else if (!keys.right.pressed && currentKey === 'right' && player.currentSprite!== player.sprites.stand.right){
    player.frames = 1;
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
}

    // win condition
    if (scrollOffset > 1800) {
        console.log('you win');
    }

    // lost condition
    if(player.position.y > canvas.height){
        console.log('u lost');
        init();
    }
}

init();
animate();


window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('LEFT');
            keys.left.pressed = true;
            currentKey = 'left';
            break;
        case 83:
            console.log('DOWN');
            break;
        case 68:
            console.log('RIGHT');
            keys.right.pressed = true;
            currentKey = 'right';
            break;
        case 87:
            console.log('UP');
            player.velocity.y -= 25;
            break;
    }
});

window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            console.log('LEFT');
            keys.left.pressed = false;
            break;
        case 83:
            console.log('DOWN');
            break;
        case 68:
            console.log('RIGHT');
            keys.right.pressed = false;
            break;
        case 87:
            console.log('UP');
            break;
    }
});
