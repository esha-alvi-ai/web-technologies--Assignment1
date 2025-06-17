module.exports = function (req, res, next) {
  if (req.session.user && req.session.user.email === "admin@example.com") {
    return next();
  }

  req.flash("error", "Admins only.");
  res.redirect("/login");
};
