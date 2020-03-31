//Fire up our node express server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname + '/public'));

http.listen(3000, function(){
    console.log("Server is running on port:3000")
});

//Get our Arduino Board and Johnny-Five doing its thing
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function(){
    var xPin = new five.Sensor({
        pin: "A0",
    });

    var yPin = new five.Sensor({
        pin: "A1",
    });

    var clicker = new five.Sensor({
        pin: "2",
    });



    xPin.on("data", function()  {
        //console.log(this.value);
        //emit data to form to the front-end
        io.sockets.emit("xVal", this.value);
    });

    yPin.on("data", function()  {
        //console.log(this.value);
        //emit data to form to the front-end
        io.sockets.emit("yVal", this.value);
    });

    clicker.on("data", function()  {
        //console.log(this.value);
        //emit data to form to the front-end
        io.sockets.emit("clicker", this.value);
    });
});