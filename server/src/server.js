require("dotenv").config();

const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");

const setupProxy = require("./middlewares/proxy");

const clientPath = path.join(__dirname, "../..", "client/build/");
const api = require("./api");
const app = require("./app")(clientPath);

const server = express();

server.disable("x-powered-by");

server.use(cors({ credentials: true }));
server.use(cookieParser());
server.use(compression());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ extended: true, limit: "50mb" }));
server.use(express.static(path.join(__dirname, "../../client/build")));

server.use("/api", api);
server.use("/", app);

setupProxy(server);

const { PORT = 5000 } = process.env;

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
