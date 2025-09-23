import "dotenv/config";
import "./config/db.config.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import registerSockets from "./sockets/index.js";

const PORT = process.env.PORT || 8080;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.set("io", io);

registerSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

httpServer.on("error", (err) => console.error("Server error:", err));

process.on("SIGINT", () => {
  console.log("Recibido SIGINT, apagando servidor...");
  httpServer.close(() => {
    console.log("Servidor apagado.");
    process.exit(0);
  });
});
