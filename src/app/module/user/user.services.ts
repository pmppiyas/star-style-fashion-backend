import { AppError } from '../../error/appError';
import { IUser } from '../../module/user/user.interface';
import { User } from '../../module/user/user.model';
import { hashingPassword } from '../../utils/hashingPassword';
import { StatusCodes } from 'http-status-codes';

export const signup = async (payload: IUser) => {
  const { password, number, location, ...rest } = payload;

  const isExist = await User.findOne({ number });

  if (isExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Account already exist by this number.'
    );
  }

  const hashPassword = password ? await hashingPassword(password) : '';

  const locationArray = location
    ? Array.isArray(location)
      ? location
      : [location]
    : [];

  await User.create({
    password: hashPassword,
    number,
    location: locationArray,
    ...rest,
  });

  return null;
};

export const UserServices = {
  signup,
};
