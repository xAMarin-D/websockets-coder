import UserDao from "../daos/mongodb/user.dao.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";
const userDao = new UserDao(UserModel);

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.login(email, password);
    if (!user) {
      return res.status(401).json({ msg: "No estas autorizado" });
    }
    req.session.email = user.email;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    req.session.age = user.age;
    req.session.role = user.role;
    res.redirect("/views/profile");
  } catch (error) {
    throw new Error(error);
  }
};

export const profile = (req, res) => {
  if (!req.session.email) {
    return res.redirect("/views/login");
  }

  const user = {
    first_name: req.session.first_name,
    last_name: req.session.last_name,
    email: req.session.email,
    age: req.session.age,
    role: req.session.role,
  };

  res.render("profile", { user });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      const user = await userDao.register({
        ...req.body,
        role: "admin",
      });
      if (!user) res.status(401).json({ msg: "user exist!" });
      else res.redirect("/views/login");
    } else {
      const user = await userDao.register(req.body);
      if (!user) res.status(401).json({ msg: "user exist!" });
      else res.redirect("/views/login");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const visit = (req, res) => {
  req.session.info && req.session.info.contador++;
  res.json({
    msg: `${req.session.info.username} ha visitado el sitio ${req.session.info.contador} veces`,
  });
};

export const infoSession = (req, res) => {
  res.json({
    session: req.session,
    sessionId: req.sessionID,
    cookies: req.cookies,
  });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/views/login");
  });
};
