// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080/socket');
// Connection opened
function a0to10(socket, msg = "") {
    socket.send(msg);
    if (!closed) {
        msg.length <= 10
            ? setTimeout(a0to10, 100, socket, msg + "a")
            : setTimeout(a120to130, 100, socket);
    }
}
function a120to130(socket, msg = new Array(120).fill("a").join("")) {
    socket.send(msg);
    if (!closed) {
        msg.length <= 130
            ? setTimeout(a120to130, 100, socket, msg + "a")
            : setTimeout(a2pow16toInf, 100, socket);
    }
}
function a2pow16toInf(socket, msg = new Array(Math.pow(2, 8 * 2) - 20).fill("a").join("")) {
    socket.send(msg);
    if (!closed)
        setTimeout(a2pow16toInf, 100, socket, msg + "a");
}
socket.addEventListener("open", function (event) {
    closed = false;
    console.log("open", event);
    a0to10(socket);

    // // socket.send("");
    // setTimeout(() => {
    //     socket.send("abcdefghijklmnopqrstuvwxyz");
    //     setTimeout(() => {
    //         socket.send("test");
    //         setTimeout(() => {
    //             mongol(socket);
    //         }, 100);
    //     }, 100)
    // }, 100);
    // // socket.send(0);
    // socket.send(new Int8Array([97, 98]));
});
socket.addEventListener("message", function (event) {
    console.log("message", event);
});
let closed = true;
socket.addEventListener("close", function (event) {
    console.log("close", event);
    closed = true
});
socket.addEventListener("error", function (event) {
    console.log("error", event);
});