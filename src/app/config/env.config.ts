import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

interface EnvConfig {
  PORT: string;
  NODE_ENV: 'development' | 'production';
  FRONTEND_URL1: string;
  DB_URL: string;
  BCRYPT: {
    SALT_ROUND: string;
  };
  EXPRESS_SESSION_SECRET: string;
  JWT: {
    ACCESS_SECRET: string;
    ACCESS_EXPIRED: string;
    REFRESH_SECRET: string;
    REFRESH_EXPIRED: string;
  };
  GOOGLE: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CALLBACK_URL: string;
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    'PORT',
    'NODE_ENV',
    'FRONTEND_URL1',
    'DB_URL',
    'SALT_ROUND',
    'EXPRESS_SESSION_SECRET',
    'ACCESS_SECRET',
    'ACCESS_EXPIRED',
    'REFRESH_SECRET',
    'REFRESH_EXPIRED',
    'CLIENT_ID',
    'CLIENT_SECRET',
    'CALLBACK_URL',
    'CLOUD_NAME',
    'API_KEY',
    'API_SECRET',
  ];

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    FRONTEND_URL1: process.env.FRONTEND_URL1 as string,
    DB_URL: process.env.DB_URL as string,
    BCRYPT: {
      SALT_ROUND: process.env.SALT_ROUND as string,
    },
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    JWT: {
      ACCESS_SECRET: process.env.ACCESS_SECRET as string,
      ACCESS_EXPIRED: process.env.ACCESS_EXPIRED as string,
      REFRESH_SECRET: process.env.REFRESH_SECRET as string,
      REFRESH_EXPIRED: process.env.REFRESH_EXPIRED as string,
    },
    GOOGLE: {
      CLIENT_ID: process.env.CLIENT_ID as string,
      CLIENT_SECRET: process.env.CLIENT_SECRET as string,
      CALLBACK_URL: process.env.CALLBACK_URL as string,
    },
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUD_NAME as string,
      API_KEY: process.env.API_KEY as string,
      API_SECRET: process.env.API_SECRET as string,
    },
  };
};

const env = loadEnvVars();
export default env;
