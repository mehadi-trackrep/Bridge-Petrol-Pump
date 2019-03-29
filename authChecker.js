var Parse = require("parse/node");
authChecker = function authChecker(req, res, next) {
  console.log("checking auth");
  Parse.User.enableUnsafeCurrentUser();
  let currentUser = Parse.User.current();
  if (currentUser) {
    console.log("user found ", currentUser);
    next();
  } else {
    console.log("user  not found ");
    res.redirect("/account/login");
  }
};
module.exports = authChecker;
