const User = require("../models/user.js");

module.exports.userSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userRegistered = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Wellcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.userLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userInformation = async (req, res) => {
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    req.flash("success", "Wellcome back to wanderlust");
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
