let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
let dx = 0, dy = 0, dz = 0;
const SPEED = 10;
var onKeyDown = function(event) {
    console.log(dx, dy, dz);
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
    }
};
var onKeyUp = function(event) {
    console.log(dx, dy, dz);
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
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);