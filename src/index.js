import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";

/** dotenv initialize */
dotenv.config();

/** initialize express */
const app = express();

/** middleware */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/** initialize server */
const server = http.createServer(app);
const port = process.env.PORT || 5000;

/** starting chat server */
server.listen(port, () => {
  console.log(`Chat server started listening on ${port}`);
});
