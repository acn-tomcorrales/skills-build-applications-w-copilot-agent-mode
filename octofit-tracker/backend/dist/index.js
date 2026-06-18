"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
async function startServer() {
    await (0, app_1.initializeDatabase)();
    app_1.app.listen(app_1.port, () => {
        console.log(`Octofit Tracker API listening on port ${app_1.port}`);
    });
}
void startServer();
