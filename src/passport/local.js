import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UserDao from "../daos/mongodb/user.dao.js";
const userDao = new UserDao();

const strategyOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

const register = async (req, email, password, done) => {
  try {
    const user = await userDao.getByEmail(email);
    if (user) return done(null, false);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userDao.register({
      ...req.body,
      password: hashedPassword,
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
};

const login = async (req, email, password, done) => {
  try {
    const user = await userDao.getByEmail(email);
    if (!user) return done(null, false);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use("register", new LocalStrategy(strategyOptions, register));
passport.use("login", new LocalStrategy(strategyOptions, login));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userDao.getById(id);
  done(null, user);
});
