const secured = require('../../lib/middleware/secured');
const ListsModel = require('../../models/lists');
const UserModel = require('../../models/user');
const _ = require('lodash');

module.exports = function (router) {

  router.get('', secured.authenticated(false), getLists);

  router.put('', secured.authenticated(false), updateLists);

  router.get('', secured.authenticated(false), getLists);

  router.get('/:id', secured.authenticated(false), getList);

  router.post('', secured.authenticated(false), secured.admin(), addList);

  router.put('/:id', secured.authenticated(false), secured.admin(), updateList);

  router.delete('/:id', secured.authenticated(false), secured.admin(), deleteList);

};

const getLists = (req, res) => {
  const listsModel = new ListsModel();
  listsModel.getLists()
    .then((lists) => {
      res.json(lists);
    });
};

const updateLists = (req, res) => {
  const listsModel = new ListsModel();
  listsModel.updateLists(req.body)
    .then((lists) => {
      getLists(req, res);
    });
};

const getList = (req, res) => {
  const listsModel = new ListsModel();
  const userModel = new UserModel();
  let list;
  let user;

  listsModel.getList(req.params.id)
    .then((resLists) => {
      if (!resLists[0]) {
        res.sendStatus(404);
        return;
      } else {
        list = resLists[0];
        if (req.user) {
          return userModel.getUser(req.user.id);
        }
        return;
      }
    })
    .then((resUser) => {
      user = resUser;
      if (list.userId && (!resUser || resUser._id.toString() === list.userId.toString())) {
        list.items = _.filter(list.items, {hidden: false});
      }
      res.json({
        ...list,
        items: _.map(list.items, (item) => {
          return !list.userId || (user && user._id.toString() !== list.userId.toString()) ? item : {
            ...item,
            purchased: false
          }
        }) || [],
      })
    });
};

const addList = (req, res) => {
  const listsModel = new ListsModel();
  listsModel.addList(req.body)
    .then((list) => {
      res.json(list);
    });
};

const updateList = (req, res) => {
  const listsModel = new ListsModel();
  listsModel.updateList(req.params.id, req.body)
    .then((list) => {
      res.json(list);
    });
};


const deleteList = (req, res) => {
  const listsModel = new ListsModel();
  listsModel.deleteList(req.params.id)
    .then(() => {
      res.sendStatus(204);
    });
};
