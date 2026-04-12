import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: 'development' | 'production';
  FRONTEND_URL1: string;
  DB_URL: string;
  BCRYPT: {
    SALT_ROUND: string;
  };
}

const loadEnvVars = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    'PORT',
    'NODE_ENV',
    'FRONTEND_URL1',
    'DB_URL',
    'SALT_ROUND',
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
  };
};

const env = loadEnvVars();
export default env;
