"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.initializeDatabase = exports.app = exports.apiBaseUrl = void 0;
const codespaceName = process.env.CODESPACE_NAME;
exports.apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : "http://localhost:8000";
var app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
Object.defineProperty(exports, "initializeDatabase", { enumerable: true, get: function () { return app_1.initializeDatabase; } });
Object.defineProperty(exports, "port", { enumerable: true, get: function () { return app_1.port; } });
