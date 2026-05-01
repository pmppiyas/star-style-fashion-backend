import { IJwtPayload } from '../types/types';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
