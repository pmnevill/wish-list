const mongo = require('mongodb');
const mongoUtil = require( '../utils/mongo' );
const db = mongoUtil.getDb();
var passport = require('passport');

module.exports = function (router) {

  const login = (req, res) => {
    res.redirect('/');
  };

  const callback = (req, res, next) => {
    passport.authenticate('auth0', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        const { _raw, _json, ...userProfile } = user;
        db.collection('users').findOneAndUpdate(
          {
            'auth0.id': user.id,
          },
          {
            $set: {
              auth0: userProfile,
            },
          },
          {
            upsert: true,
          }
        ).then(
          res.redirect('/')
        );
      });
    })(req, res, next);
  };

  const logout = (req, res) => {
    req.logout();
    const returnTo = encodeURIComponent(process.env.AUTH0_CALLBACK_URL);
    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}`);
  };

  router.get(
    '/login',
    passport.authenticate('auth0', {
      scope: 'openid email profile'
    }),
    login
  );

  // Perform the final stage of authentication and redirect to previously requested URL or '/user'
  router.get('/callback', callback);

  // Perform session logout and redirect to homepage
  router.get('/logout', logout);

};
