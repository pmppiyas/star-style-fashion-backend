import { IUser } from '@app/module/user/user.interface';
import { User } from '@app/module/user/user.model';
import { hashingPassword } from '@app/utils/hashingPassword';

export const signup = async (payload: IUser) => {
  const { password, ...rest } = payload;
  let hashPassword = '';

  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const user = await User.create({
    password: hashPassword,
    ...rest,
  });

  const userObj = user.toObject();

  const { password: pass, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};

export const UserServices = {
  signup,
};
