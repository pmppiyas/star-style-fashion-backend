import { User } from '../../module/user/user.model';
import { IJwtPayload } from '../../types/share';

const getMe = async (payload: IJwtPayload) => {
  const user = await User.findById(payload.userId);

  return user;
};

export const AuthServices = {
  getMe,
};
