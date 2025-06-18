exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "No account with that email.");
      return res.redirect("/login");
    }

    if (user.password !== password) {
      req.flash("error", "Incorrect password.");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success", "Welcome back!");
    res.redirect("/dashboard");

  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Login failed.");
    res.redirect("/login");
  }
};
