import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import UserDao from "../daos/mongodb/user.dao.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";
const userDao = new UserDao(UserModel);

const strategyConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userDao.getByGitHubId(profile.id);
    if (!user) {
      user = await userDao.register({
        first_name: profile.displayName || profile.username,
        last_name: "Not provided",
        email: profile.emails[0].value,
        githubId: profile.id,
        password: "",
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(new GithubStrategy(strategyConfig, registerOrLogin));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userDao.getById(id);
  done(null, user);
});
