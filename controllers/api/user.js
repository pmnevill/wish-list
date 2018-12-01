const mongoUtil = require( '../../utils/mongo' );
const db = mongoUtil.getDb();
var secured = require('../../lib/middleware/secured');

module.exports = function (router) {

  const getUser = (req, res) => {
    db.collection('users').findOne({
      'auth0.id': req.user.id
    }).then((user) => {
      res.json(user);
    });
  };

  const getUserImage = (req, res) => {
    db.collection('users').findOne({
      'auth0.id': req.params.id
    }).then((user) => {
      if (user && user.auth0) {
        res.json(user.auth0.picture);
      } else {
        res.sendStatus(404);
      }
    });
  };

  router.get('', secured.authenticated(false), getUser);

  router.get('/:id/image', getUserImage);

};
