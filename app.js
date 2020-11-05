main();
function main () {
    const canvas = document.querySelector('#game');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        alert("Webgl is not enabled. Try getting out of the cave.");
    }
    gl.clearColor(0.0, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}