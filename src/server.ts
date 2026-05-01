import app from './app';
import env from './app/config/env.config';
import handleServerEvents from './app/utils/handleServerEvent';
import { Server } from 'http';
import mongoose from 'mongoose';

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(env.DB_URL);
    console.log('Connected to Star Style Database');
    server = app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });

    handleServerEvents(server);
  } catch (error) {
    console.error('Error during startup:', error);
  }
};

(async () => {
  await startServer();
})();
