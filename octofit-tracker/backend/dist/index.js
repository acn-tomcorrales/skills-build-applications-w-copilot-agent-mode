"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
async function startServer() {
    await (0, server_1.initializeDatabase)();
    server_1.app.listen(server_1.port, () => {
        console.log(`Octofit Tracker API listening on port ${server_1.port}`);
    });
}
void startServer();
