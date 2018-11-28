module.exports = function (redirect = true) {
  return function secured (req, res, next) {
    if (req.user) {
      return next();
    }
    if (redirect) {
      res.redirect('/login');
    } else {
      res.sendStatus(401);
    }
  };
};
