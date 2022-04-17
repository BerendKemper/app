// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080/socket');
// Connection opened
function mongol(socket, counter = 0, msg = "") {
    socket.send(msg);
    if (++counter < 1200)
        if (!closed)
            setTimeout(mongol, 100, socket, counter, msg + "a");
}
socket.addEventListener("open", function (event) {
    closed = false;
    console.log("open", event);
    socket.send("");
    setTimeout(() => {
        socket.send("abcdefghijklmnopqrstuvwxyz");
        setTimeout(() => {
            // socket.send("test");
        }, 100)
    }, 100);
    // socket.send(0);
    // socket.send(new Int8Array([97, 98]));
    // mongol(socket);
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