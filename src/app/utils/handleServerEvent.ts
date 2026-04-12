import { Server } from 'http';

const shutdownServer = (
  server: Server | undefined,
  signal: string,
  error?: any
) => {
  console.log(`${signal} detected. Server shutting down...`);
  if (error) console.error(error);

  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const handleServerEvents = (server: Server) => {
  process.on('unhandledRejection', (err) =>
    shutdownServer(server, 'Unhandled Rejection', err)
  );

  process.on('uncaughtException', (err) =>
    shutdownServer(server, 'Uncaught Exception', err)
  );

  ['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, () => shutdownServer(server, signal));
  });
};

export default handleServerEvents;
