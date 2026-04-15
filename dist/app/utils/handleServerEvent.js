"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shutdownServer = (server, signal, error) => {
    console.log(`${signal} detected. Server shutting down...`);
    if (error)
        console.error(error);
    if (server) {
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const handleServerEvents = (server) => {
    process.on('unhandledRejection', (err) => shutdownServer(server, 'Unhandled Rejection', err));
    process.on('uncaughtException', (err) => shutdownServer(server, 'Uncaught Exception', err));
    ['SIGTERM', 'SIGINT'].forEach((signal) => {
        process.on(signal, () => shutdownServer(server, signal));
    });
};
exports.default = handleServerEvents;
