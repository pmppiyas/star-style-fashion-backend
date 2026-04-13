import { User } from '@app/module/user/user.model';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcryptjs from 'bcryptjs';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'identifier',
      passwordField: 'password',
    },
    async (identifier: string, password: string, done: any) => {
      try {
        const isUserExist = await User.findOne({
          $or: [{ email: identifier }, { number: identifier }],
        });

        if (!isUserExist) {
          return done(null, false, {
            message: 'User not found.',
          });
        }

        if (isUserExist && !isUserExist.password) {
          return done(null, false, {
            message:
              'You are joined by Google. First login by google and then set a password.',
          });
        }

        const isPasswordMatch = await bcryptjs.compare(
          password,
          isUserExist.password || ''
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Password is wrong.' });
        }

        return done(null, isUserExist, { message: 'Login successfull.' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
