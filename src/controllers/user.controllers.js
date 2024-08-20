import UserDao from "../daos/mongodb/user.dao.js";
import { UserModel } from "../daos/mongodb/models/user.model.js";
import CartDao from "../daos/mongodb/cart.dao.js";
import { logger } from "../utils/logger.js";
import { sendPasswordRecoveryEmail } from "../services/email.service.js";
import { HttpResponse } from "../utils/http.response.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const httpResponse = new HttpResponse();
const userDao = new UserDao(UserModel);
const cartDao = new CartDao();

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.login(email, password);

    if (!user) {
      return res.status(401).json({ msg: "No estás autorizado" });
    }
    req.session.user = user;
    res.send("Usuario logeado correctamente");
    // req.login(user, (err) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   req.session.user = user; // Almacenar los datos del usuario en la sesión
    //   //res.redirect("/views/profile");
    // });
    logger.info(
      `Detalles del usuario en la sesión: ${JSON.stringify(req.session.user)}`
    );
  } catch (error) {
    next(error);
  }
};

export const profile = (req, res) => {
  logger.info(`Usuario en la sesión: ${JSON.stringify(req.session.user)}`);
  logger.info(`Usuario de passport: ${JSON.stringify(req.user)}`);

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
    if (email === process.env.ADMIN_USR && password === process.env.ADMIN_PWD) {
      const user = await userDao.register({
        ...req.body,
        role: "admin",
        cartId: cart._id, // Asignar el ID del carrito al usuario
      });
      if (!user) res.status(401).json({ msg: "Usuario existe!" });
      else {
        req.session.user = user; // Almacenar los datos del usuario en la sesión
        res.redirect("/views/login");
      }
    } else {
      const user = await userDao.register({
        ...req.body,
        cartId: cart._id, // Asignar el ID del carrito al usuario
      });
      if (!user) res.status(401).json({ msg: "Usuario existe!" });
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
      return res.status(500).send("No se pudo cerrar sesión .");
    }
    res.redirect("/views/login");
  });
};

export const getCurrentSession = (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  } else {
    return res.status(401).json({ msg: "No se encuentra sesión del usuario" });
  }
};

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (req, res, next) => {
  try {
    const user = req.session.user;
    if (!user) {
      return httpResponse.Unauthorized(
        res,
        "Debes estar logueado para solicitar la recuperación de contraseña."
      );
    }

    // Generar un token de recuperación
    const resetToken = crypto.randomBytes(20).toString("hex");
    const tokenExpiration = Date.now() + 3600000; // Expiración de 1 hora

    // Guardar el token en la bbdd
    await UserModel.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: tokenExpiration,
      }
    );

    // Enviar correo con el enlace de restablecimiento
    const resetLink = `http://localhost:8080/api/users/reset-password/${resetToken}`;

    await sendPasswordRecoveryEmail(user.email, resetLink);

    httpResponse.Ok(res, "Correo de recuperación enviado.");
  } catch (error) {
    next(error);
  }
};

//RESET
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar al usuario con el tokem
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return httpResponse.BadRequest(res, "Token inválido o expirado.");
    }

    // Verificar que la nueva pwd
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return httpResponse.BadRequest(
        res,
        "No puedes usar la misma contraseña."
      );
    }

    // Encriptar la nueva contraseña y actualiza
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return httpResponse.Ok(res, "Contraseña restablecida exitosamente.");
  } catch (error) {
    next(error);
  }
};
