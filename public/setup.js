// window.onload = start;
let scene = {};
// const canvas = document.querySelector('#game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
if (!gl) {
    alert("Webgl is not enabled. Try getting out of the cave.");
}

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}
`;
const fsSource = `
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`;

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

const programInfo = {
    program : shaderProgram,
    attribLocations : {
        vertexPosition : gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord : gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix : gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix : gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
};

const texture = loadTexture(gl, 'textures.png');

var then = 0;
function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    dz += (Math.sin(rotY)*(moveRight-moveLeft)-Math.cos(rotY)*(moveForward-moveBackward))*SPEED*deltaTime;
    dy += (moveUp-moveDown)*SPEED*deltaTime;
    dx += (Math.cos(rotY)*(moveRight-moveLeft)+Math.sin(rotY)*(moveForward-moveBackward))*SPEED*deltaTime;
    rotY += (turnRight-turnLeft)*deltaTime;
    socket.emit('move', {x : dx, y : dy, z : dz});
    drawScene(gl, programInfo, scene, texture);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragementShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragementShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('uh oh shader program dont work' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('shader dont work D: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader();
        return null;
    }

    return shader;
}

function addToScene(gl, geom, name) {
    const {positions, textureCoordinates, indices} = geom;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);
    
    const textureCoordBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);
    
    scene[name] = {
        bufferData: {
            position : positionBuffer,
            textureCoord : textureCoordBuffer,
            indices : indexBuffer,},
        tris: indices.length
    };
}

function drawScene(gl, programInfo, scene, texture) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.SAMPLE_COVERAGE);
    gl.sampleCoverage(0.5, false);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const projectionMatrix = mat4.create();

    mat4.perspective(
        projectionMatrix,
        45 * Math.PI / 180,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        100.0);
    
    const modelViewMatrix = mat4.create();

    // Movement
    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        rotX,
        [1, 0, 0]);

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        rotY,
        [0, 1, 0]);

    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-dx, -dy, -dz]);
    
    for (let name in scene) {
        const obj = scene[name];
        const buffers = obj.bufferData;
        // Bind Position
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,
            3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        // Bind Textures
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord,
            2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        
        // Bind indicies
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        gl.drawElements(gl.TRIANGLES, obj.tris, gl.UNSIGNED_SHORT, 0);
    }
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };
    image.src = url;   
    return texture;
}