export const validateLogin = (req, res, next) => {
  if (req.session && req.session.email) {
    next();
  } else {
    res.redirect("/views/login");
  }
};
