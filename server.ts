import http from "http";

const createServer = () => {
  const server = http.createServer((req, res) => {
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

export default createServer;
