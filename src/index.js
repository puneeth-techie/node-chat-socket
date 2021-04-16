import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";

/** dotenv initialize */
dotenv.config();

/** initialize express */
const app = express();

/** middleware */
app.use(express.static("./src/public"));
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

/** initialize socket server */
const io = new Server(server);

/** total clients connected */
const totalClients = new Set();

/** client connected */
io.on("connection", (client) => {
  // console.log(`Client connected: ${client.id}`);

  /** adding clinets to the Set to avoid duplicate. */
  totalClients.add(client.id);

  /** emit the totalClients event to show case the number of clients connected */
  io.emit("totalClients", totalClients.size);

  /** client disconnected */
  client.on("disconnect", () => {
    // console.log(`Client disconnected: ${client.id}`);
    totalClients.delete(client.id);

    /** emit the totalClients event to show case the number of clients connected */
    io.emit("totalClients", totalClients.size);
  });

  /** listening message event from the client */
  client.on("message", (data) => {
    /** broadcasting client message to everyone except the client who sents the message */
    client.broadcast.emit("chat-message", data);
  });
});
