import env from '@app/config/env.config';
import bcryptjs from 'bcryptjs';

export const hashingPassword = async (password: string): Promise<string> => {
  const saltRound = Number(env.BCRYPT.SALT_ROUND);

  return await bcryptjs.hash(password, saltRound);
};
