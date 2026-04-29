import { User } from '@app/module/user/user.model';
import { IJwtPayload } from '@app/types/share';

const getMe = async (payload: IJwtPayload) => {
  const user = await User.findById(payload.userId);

  return user;
};

export const AuthServices = {
  getMe,
};
