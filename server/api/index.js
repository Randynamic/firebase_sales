const bodyParser = require("body-parser");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const isProdEnv = process.env.NODE_ENV === "production";
const configDir = "./server/api/config/";

require("dotenv").config({ path: isProdEnv ? configDir + "production.env" : configDir + "development.env" });

const api_v1_routes = require("./routes/v1");
const api_v1_routes_storage = require("./routes/v1/storage");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  "/api",
  cors({
    allowedHeaders: ["Content-Type", "isAuthorized"],
    exposedHeaders: [],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: true
  })
);

app.use("/api/v1", api_v1_routes);
app.use("/api/v1/storage", api_v1_routes_storage);
app.use("/", (req, res, next) => {
  res.json({ API: "v1", PROJECT_ID: process.env.PROJECT_ID });
  next();
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ ok: false, error });
});

app.listen(PORT, console.log(`App listening on port ${PORT}!`));

app.on("error", error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});
