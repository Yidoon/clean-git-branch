"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var createServer = function () {
    var server = http_1.default.createServer(function (req, res) {
        console.log(req.url, "reqq");
        if (req.url === "/close") {
            console.log("Exiting NodeJS server");
            process.exit();
        }
        res.writeHead(200);
        res.end("Hello, World!");
    });
    console.log("http");
    server.listen(8080);
    console.log("Node.js web server at port 6000 is running..");
};
exports.default = createServer;
