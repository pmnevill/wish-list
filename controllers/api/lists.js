const mongo = require('mongodb');
const mongoUtil = require( '../../utils/mongo' );
const _ = require('lodash');
const db = mongoUtil.getDb();

module.exports = function (router) {

  const getLists = (req, res) => {
    db.collection('lists').find().toArray().then((lists) => {
      res.json(lists);
    })
  };

  const getList = (req, res) => {
    let list;
    let items;

    db.collection('lists').findOne({
      _id: new mongo.ObjectID(req.params.id)
    }).then((resList) => {
      if (!resList) {
        res.sendStatus(404);
      } else {
        list = resList;
        return db.collection('items').find({
          list: new mongo.ObjectID(req.params.id),
          deleted: false,
        }).toArray();
      }
    })
    .then((resItems) => {
      items = resItems;
      if (req.user) {
        return db.collection('users').findOne({
          'auth0.id': req.user.id,
        });
      }
      return;
    })
    .then(filterList)

    function filterList(user) {
      res.json({
        ...list,
        items: _.map(items, (item) => {
          return !list.userId || (user && user._id.toString() !== list.userId.toString()) ? item : {...item, purchased: false}
        }) || [],
      })
    }
  };

  router.get('', getLists);

  router.get('/:id', getList);

};
