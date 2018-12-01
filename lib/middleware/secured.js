const mongoUtil = require( '../../utils/mongo' );
const db = mongoUtil.getDb();

module.exports = {
  admin: function () {
    return function secured (req, res, next) {
      db.collection('users').findOne({
        'auth0.id': req.user.id
      }).then((user) => {
        if (user && user.isAdmin) {
          return next();
        }
        res.sendStatus(401);
      });
    };
  },
  authenticated: function (redirect = true) {
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
  }
};
