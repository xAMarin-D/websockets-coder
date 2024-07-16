import UserDao from "../daos/mongodb/user.dao.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";
import CartDao from "../daos/mongodb/cart.dao.js";

const userDao = new UserDao(UserModel);
const cartDao = new CartDao();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.login(email, password);
    if (!user) {
      return res.status(401).json({ msg: "No estás autorizado" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = user; // Almacenar los datos del usuario en la sesión
      res.redirect("/views/profile");
    });
  } catch (error) {
    next(error);
  }
};

export const profile = (req, res) => {
  console.log("User in session:", req.session.user); // LogS para verificar los datos del usuario
  console.log("User from passport:", req.user);

  if (
    !req.session.user &&
    (!req.session.passport || !req.session.passport.user)
  ) {
    return res.redirect("/views/login");
  }

  const user = req.session.user || req.user;
  res.render("profile", { user });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    let cart = await cartDao.createCart();
    if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      const user = await userDao.register({
        ...req.body,
        role: "admin",
        cartId: cart._id, // Asignar el ID del carrito al usuario
      });
      if (!user) res.status(401).json({ msg: "user exist!" });
      else {
        req.session.user = user; // Almacenar los datos del usuario en la sesión
        res.redirect("/views/login");
      }
    } else {
      const user = await userDao.register({
        ...req.body,
        cartId: cart._id, // Asignar el ID del carrito al usuario
      });
      if (!user) res.status(401).json({ msg: "user exist!" });
      else {
        req.session.user = user; // Almacenar los datos del usuario en la sesión
        res.redirect("/views/login");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const githubResponse = async (req, res) => {
  res.redirect("/views/profile");
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/views/login");
  });
};

export const getCurrentSession = (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ msg: "No user session found" });
  }
};
