import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserDao from "../daos/mongodb/user.dao.js";

const userDao = new UserDao();

const strategyOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

const signup = async (req, email, password, done) => {
  try {
    const user = await userDao.getByEmail(email);
    if (user) return done(null, false);
    const newUser = await userDao.register(req.body);
    return done(null, newUser);
  } catch (error) {
    console.log(error);
    return done(error);
  }
};

const login = async (req, email, password, done) => {
  try {
    const user = await userDao.getByEmail(email);
    if (!user) return done(null, false);
    const isValidPassword = await userDao.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) return done(null, false);
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error);
  }
};

passport.use("register", new LocalStrategy(strategyOptions, signup));
passport.use("login", new LocalStrategy(strategyOptions, login));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userDao.getById(id);
  done(null, user);
});
