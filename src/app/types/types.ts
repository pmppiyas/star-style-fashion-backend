import { Router } from 'express';

export type ImoduleRoutes = {
  path: string;
  route: Router;
};

export type IJwtPayload = {
  userId: string;
  identifier: string;
  role: string;
};
