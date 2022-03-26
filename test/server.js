const express = require("express");
const app = express();
const fs = require("fs");

const cors = require("cors");

const http = require("http");
const https = require("https");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(
    "File server up and running on ports (HTTP: " +
      portHTTP +
      ", HTTPS: " +
      portHTTPS
  );
});

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(options, app);

const portHTTP = 3001;
const portHTTPS = 3002;

serverHTTP.listen(portHTTP);
serverHTTPS.listen(portHTTPS);

console.log("HTTP listening on " + portHTTP);
console.log("HTTPS listening on " + portHTTPS);
