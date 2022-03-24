import http from "http";
import fs from "fs";
import generateBranchList from "./src/branch";
import { chdir } from "process";

const PROJECT_PATH = "/Users/yidoon/Desktop/shifang/crm-fe";

const createServer = () => {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/close") {
      process.exit();
    }
    if (req.url === "/branchs") {
      const branchs = await generateBranchList();
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.write(JSON.stringify(branchs));
      res.end();
    }
    if (req.url === "/") {
      fs.readFile("index.html", (err, data) => {
        console.log(data, "ddd");
        chdir(PROJECT_PATH);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(data);
        res.end();
      });
    }
  });
  server.listen(8080);
  console.log("Node.js web server at port 8080 is running..");
};

export default createServer;
