import { IJwtPayload } from '@app/types/types';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
