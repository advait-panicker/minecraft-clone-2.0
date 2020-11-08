let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
let turnLeft = false, turnRight = false;
let dx = 0, dy = 0, dz = 0;
var rotY = 0.0, rotX = 0;
const SPEED = 10;
var onKeyDown = function(event) {
    updatef3();
    switch (event.keyCode) {
        case 87: // w
        case 38: // up
            moveForward = true;    
            break;
        case 83: // s
        case 40: // down
            moveBackward = true;    
            break;
        case 65: // a
        case 37: // left
            moveLeft = true;    
            break;
        case 68: // d
        case 39: // right
            moveRight = true;    
            break;
        case 32: // space
            moveUp = true;    
            break;
        case 16: // shift
            moveDown = true;    
            break;
        case 81:
            turnLeft = true;
            break;
        case 69:
            turnRight = true;
            break;
    }
};
var onKeyUp = function(event) {
    updatef3();
    switch (event.keyCode) {
        case 87: // w
        case 38: // up
            moveForward = false;    
            break;
        case 83: // s
        case 40: // down
            moveBackward = false;    
            break;
        case 65: // a
        case 37: // left
            moveLeft = false;    
            break;
        case 68: // d
        case 39: // right
            moveRight = false;    
            break;
        case 32: // space
            moveUp = false;    
            break;
        case 16: // shift
            moveDown = false;    
            break;
        case 81:
            turnLeft = false;
            break;
        case 69:
            turnRight = false;
            break;
    }
};
function updatef3() {
    document.getElementById('dx').innerText = dx;
    document.getElementById('dy').innerText = dy;
    document.getElementById('dz').innerText = dz;
}
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

var canvas = document.querySelector('#game');

canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

function updatePosition(e) {
    rotY += e.movementX / 400; 
    rotX += e.movementY / 500;
}