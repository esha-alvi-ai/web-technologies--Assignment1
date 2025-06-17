module.exports = function (req, res, next) {
  if ( !req.session.user) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
  next();
};
