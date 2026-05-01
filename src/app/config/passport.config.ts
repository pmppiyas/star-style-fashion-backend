import { User } from '@app/module/user/user.model';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcryptjs from 'bcryptjs';
import env from '@app/config/env.config';
import { IStatus } from '@app/module/user/user.interface';

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

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE.CLIENT_ID as string,
      clientSecret: env.GOOGLE.CLIENT_SECRET as string,
      callbackURL: env.GOOGLE.CALLBACK_URL as string,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const profilePhoto = profile.photos?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: 'No email found from Google account',
          });
        }

        let isExistUser = await User.findOne({ email });

        if (isExistUser) {
          return done(null, isExistUser);
        }

        const newUser = await User.create({
          name: name,
          email: email,
          profileImage: profilePhoto,
          status: IStatus.ACTIVE,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, false);
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
