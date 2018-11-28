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

  router.get('', secured(false), getUser);

};
