import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import UserDao from "../daos/mongodb/user.dao.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";

const userDao = new UserDao(UserModel);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userDao.getByGitHubId(profile.id);
        if (!user) {
          user = await userDao.register({
            githubId: profile.id,
            first_name: profile.displayName,
            email: profile.emails[0].value,
            password: null, // As GitHub auth does not use password
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userDao.getById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
