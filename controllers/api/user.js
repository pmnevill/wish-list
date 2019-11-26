let secured = require('../../lib/middleware/secured');
let UserModel = require('../../models/user');

module.exports = function (router) {

  router.get('', secured.authenticated(false), getUser);

  router.get('/list', secured.authenticated(true), getUsers);

  router.get('/:id/image', secured.authenticated(false), getUserImage);

};

const getUser = (req, res) => {
  const userModel = new UserModel();
  userModel.getUser(req.user.id)
    .then((user) => {
      res.json(user);
    });
};

const getUsers = (req, res) => {
  const userModel = new UserModel();
  userModel.getUsers()
    .then((users) => {
      res.json(users);
    });
};

const getUserImage = (req, res) => {
  const userModel = new UserModel();
  userModel.getUser(req.params.id).then((user) => {
    if (user && user.auth0) {
      res.json(user.auth0.picture);
    } else {
      res.sendStatus(404);
    }
  });
};
