import http from "http";
import url from "url";
import fs from "fs";
import generateBranchList, { deleteBranchs } from "./branch";
import { chdir } from "process";
import path from "path";
import { Server } from "node-static";
import { parse } from "querystring";

const fileServer = new Server(path.join(__dirname, "../public"));
// const PROJECT_PATH = "/Users/yidoon/Desktop/shifang/crm-fe";
const PROJECT_PATH = "/Users/abc/Desktop/Project/crm-fe";

const createServer = () => {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/") {
      req
        .addListener("end", function () {
          fileServer.serve(req, res);
        })
        .resume();
    }
    if (req.url === "/close") {
      process.exit();
    }
    if (req.url === "/branchs") {
      chdir(PROJECT_PATH);
      const branchs = await generateBranchList();
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      const data = {
        code: 0,
        msg: "",
        data: branchs,
      };
      res.write(JSON.stringify(data));
      res.end();
    }
    if (req.url!.match(".css$") || req.url!.match(".js$")) {
      // const htmlPath = path.join(__dirname, "../public/index.html");
      const cssPath = path.join(__dirname, "../public", req.url!);
      const mindType = req.url!.match(".css$") ? "text/css" : "text/javascript";
      fs.readFile(cssPath, (err, data) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", mindType);
        res.write(data);
        res.end();
      });
    }
    if (req.url === "/branchs/delete" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body = chunk.toString();
      });
      req.on("end", async () => {
        const payload = JSON.parse(body);
        chdir(PROJECT_PATH);

        if (payload.branchs) {
          try {
            await deleteBranchs(payload.branchs as string[]);
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            const data = {
              code: 0,
              msg: "",
              data: "",
            };
            res.write(JSON.stringify(data));
            res.end();
          } catch (error) {
            res.writeHead(200, {
              "Content-Type": "application/json",
            });
            const data = {
              code: 0,
              msg: error,
              data: "",
            };
            res.write(JSON.stringify(data));
            res.end();
          }
        }
      });
    }
  });
  server.listen(8080);
  console.log("Node.js web server at port 8080 is running..");
};

export default createServer;
