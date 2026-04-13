import env from '@app/config/env.config';
import { IUser } from '@app/module/user/user.interface';
import { generateToken } from '@app/utils/jwt';

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    identifier: user.email || user.number,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.JWT.ACCESS_SECRET,
    env.JWT.ACCESS_EXPIRED
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.JWT.REFRESH_SECRET,
    env.JWT.REFRESH_EXPIRED
  );
  return {
    accessToken,
    refreshToken,
  };
};
