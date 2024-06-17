import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import UserDao from "../daos/mongodb/user.dao.js";

const userDao = new UserDao();

const strategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ["user:email"],
};

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    const email =
      profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error("No email found in GitHub profile"));
    }
    let user = await userDao.getByEmail(email);
    if (!user) {
      const newUser = {
        first_name: profile.displayName || profile.username,
        last_name: "Not provided",
        email: email,
        password: "N/A", // No es necesario pwd en el GBLog
        githubId: profile.id,
      };
      user = await userDao.register(newUser);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};

passport.use(new GithubStrategy(strategyOptions, registerOrLogin));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userDao.getById(id);
  done(null, user);
});
