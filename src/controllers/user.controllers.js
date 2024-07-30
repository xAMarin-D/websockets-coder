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
      return res.status(401).json({ msg: "Unauthorized" });
    }

    req.login(user, async (err) => {
      if (err) {
        return next(err);
      }

      let userCartId = user.cartId;
      if (!userCartId) {
        const newCart = await cartDao.create(); // Crear un carrito si no existe
        userCartId = newCart._id;
        // Guardar el nuevo cartId en el usuario, si no estaba previamente asignado
        await userDao.update(user._id, { cartId: newCart._id });
      }

      req.session.user = { ...user.toObject(), cartId: userCartId };
      console.log("Session User After Login:", req.session.user);

      res.redirect("/views/profile");
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    let cart = await cartDao.create();
    let role = "user";

    if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      role = "admin";
    }

    const user = await userDao.register({
      ...req.body,
      role: role,
      cartId: cart._id,
    });

    if (!user) {
      res.status(401).json({ msg: "User exists!" });
    } else {
      req.session.user = { ...user.toObject(), cartId: cart._id }; // Asegúrate de usar `toObject()`
      res.redirect("/views/login");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ msg: error.message || "Internal Server Error" });
  }
};

export const profile = (req, res) => {
  console.log("User in session:", req.session.user);
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
  if (req.session.user || req.user) {
    return res.json({ user: req.session.user || req.user });
  } else {
    return res.status(401).json({ msg: "No user session found" });
  }
};
