export const validateLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/views/login");
};
