import { AppError } from '@app/error/appError';
import { IUser, Role } from '@app/module/user/user.interface';
import { User } from '@app/module/user/user.model';
import { hashingPassword } from '@app/utils/hashingPassword';
import { StatusCodes } from 'http-status-codes';

export const signup = async (payload: IUser) => {
  const { password, number, ...rest } = payload;
  let hashPassword = '';

  const isExist = await User.findOne({
    number,
  });
  if (isExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Account already exist by this number.'
    );
  }

  if (password) {
    hashPassword = await hashingPassword(password);
  }

  const user = await User.create({
    password: hashPassword,
    number,
    ...rest,
  });

  const userObj = user.toObject();

  const { password: pass, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
};

export const UserServices = {
  signup,
};
