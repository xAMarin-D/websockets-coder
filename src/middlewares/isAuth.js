export const isAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res
      .status(401)
      .json({ msg: "Debes estar logueado para acceder a esta ruta." });
  }
};
