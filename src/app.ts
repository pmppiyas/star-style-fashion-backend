import env from './app/config/env.config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';
import router from './app/routes';
import { globalErrHandler } from './app/middleware/globalErrHandler';
import { notFound } from './app/middleware/notFound';
import passport from 'passport';
import session from 'express-session';
import './app/config/passport.config';

const app = express();

const allowedOrigin = [env.FRONTEND_URL1];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not alloed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production' ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.set('trust proxy', 1);

app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({
    success: true,
    message: 'Hello, Wellcome to Star Style',
  });
});

app.use(globalErrHandler);

app.use(notFound);

export default app;
