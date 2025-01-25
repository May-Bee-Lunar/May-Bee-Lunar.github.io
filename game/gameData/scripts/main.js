import {Vector2D, Vector3D, cylinder, box, degToRad, radToDeg, tau} from "./mathFunctions.js";
import {drawCircle} from "./draw.js";
import {handlePlayerMovement} from "./player.js";
import {collider} from "./classes.js"

// #region initialize
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d");

const offscreenCanvas = new OffscreenCanvas(640, 360);
const offscreenContext = offscreenCanvas.getContext("2d");

let gameScreen = {
    x: null,
    y: null,
    width: null,
    height: null,
}

resize();
window.addEventListener('resize', resize);
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gameScreenScale = Math.floor(Math.min(canvas.width / offscreenCanvas.width, canvas.height / offscreenCanvas.height));
    gameScreen.width = offscreenCanvas.width * gameScreenScale;
    gameScreen.height = offscreenCanvas.height * gameScreenScale;
    gameScreen.x = canvas.width / 2 - gameScreen.width / 2;
    gameScreen.y = canvas.height / 2 - gameScreen.height / 2;

    context.imageSmoothingEnabled = false;
}

document.addEventListener("click", function () {
    document.body.requestPointerLock();
    document.body.requestFullscreen();
});

let buttonMap = {
    up: "w",
    left: "a",
    down: "s",
    right: "d",
    jump: " "
};
let inputs = {
    up: false,
    left: false,
    down: false,
    right: false,
    jump: false,
    framesSinceJumpStart: 10
};

document.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (!event.repeat) {
        let keys = Object.keys(buttonMap); // by keys we mean the keys into the objects...
        for (let index = 0; index < keys.length; index++) {
            let key = keys[index]; // by keys we mean the keys into the objects...
            if (event.key == buttonMap[key]) {
                inputs[key] = true;
                if (key == "jump") {
                    inputs.framesSinceJumpStart = 0
                }
            }
        }
    }
});
document.addEventListener("keyup", (event) => {
    if (!event.repeat) {
        let keys = Object.keys(buttonMap); // by keys we mean the keys into the objects...
        for (let index = 0; index < keys.length; index++) {
            let key = keys[index]; // by keys we mean the keys into the objects...
            if (event.key == buttonMap[key]) {
                inputs[key] = false;
            }
        }
    }
});

let player = {
    cylinder: new cylinder(new Vector3D(490, 0, 270), 8, 36),
    speed: 2,
    onGround: true,
    velocityY: 0,
    facing: 0
};

let colliders = [];
colliders.push(new collider(new cylinder(new Vector3D(100, 0, 100), 36, 20), null));
colliders.push(new collider(new cylinder(new Vector3D(150, 0, 120), 28, 30), null));
colliders.push(new collider(new cylinder(new Vector3D(120, 0, 170), 20, 10), null));
colliders.push(new collider(new box(new Vector3D(300, 0, 200), new Vector3D(32, 16, 32)), null));
colliders.push(new collider(new box(new Vector3D(340, 0, 200), new Vector3D(32, 32, 32)), null));
colliders.push(new collider(new box(new Vector3D(380, 0, 200), new Vector3D(32, 48, 32)), null));
colliders.push(new collider(new box(new Vector3D(420, 0, 200), new Vector3D(32, 64, 32)), null));
colliders.push(new collider(new box(new Vector3D(452, 0, 200), new Vector3D(32, 64, 64)), null));

// #endregion

// Make: Polygon Collision maybe?
// Revamp the way vertical collision is handled
// Revamp drawing system and also add a frickin shadow to indicate height...
// and implement some dang coyote time!
function main(milliseconds) {
    
    offscreenContext.clearRect(0, 0, 640, 360);
    context.clearRect(0, 0, canvas.width, canvas.height);

    offscreenContext.strokeStyle = "white";
    offscreenContext.lineWidth = 1
    offscreenContext.fillStyle = "rgba(255, 255, 255, 1)";

    offscreenContext.strokeRect(0.5, 0.5, 639, 359);

    handlePlayerMovement(player, inputs, colliders);

    
    for (let colliderIndex = 0; colliderIndex < colliders.length; colliderIndex++) {
        switch (colliders[colliderIndex].shape.getColliderType()) {
            case "cylinder":
                
                drawCircle(colliders[colliderIndex].shape.position3D.getXZPosition(), colliders[colliderIndex].shape.radius, offscreenContext);
                break;

            case "box":
                offscreenContext.fillStyle = "rgba(128, 128, 128, 1)";
                offscreenContext.fillRect(colliders[colliderIndex].shape.position3D.x, colliders[colliderIndex].shape.position3D.z - colliders[colliderIndex].shape.size3D.y, colliders[colliderIndex].shape.size3D.x, colliders[colliderIndex].shape.size3D.z + colliders[colliderIndex].shape.size3D.y);
                offscreenContext.fillStyle = "rgba(200, 200, 200, 1)";
                offscreenContext.fillRect(colliders[colliderIndex].shape.position3D.x, colliders[colliderIndex].shape.position3D.z - colliders[colliderIndex].shape.size3D.y, colliders[colliderIndex].shape.size3D.x, colliders[colliderIndex].shape.size3D.z);
                offscreenContext.fillStyle = "rgba(255, 255, 255, 1)";    
        }
    }

    let playerSprite = new Image();
    playerSprite.src = "../gameData/graphics/player.png";
    console.log(player.cylinder.position3D.y)


    drawCircle(player.cylinder.position3D.getXZPosition().getDifference(new Vector2D(0, player.cylinder.position3D.y)), player.cylinder.radius, offscreenContext);
    offscreenContext.drawImage(playerSprite, 32, 0, 32, 48, Math.round(player.cylinder.position3D.x) - 16, Math.round(player.cylinder.position3D.z - player.cylinder.position3D.y) - 36, 32, 48);


    context.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, gameScreen.x, gameScreen.y, gameScreen.width, gameScreen.height);
    requestAnimationFrame(main);
}

requestAnimationFrame(main);

