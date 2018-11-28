const mongo = require('mongodb');
const mongoUtil = require( '../../utils/mongo' );
const db = mongoUtil.getDb();

module.exports = function (router) {

  const getLists = (req, res) => {
    db.collection('lists').find().toArray().then((lists) => {
      res.json(lists);
    })
  };

  const getList = (req, res) => {
    let list;

    db.collection('lists').findOne({
      _id: new mongo.ObjectID(req.params.id)
    }).then(
      (resList) => {
        if (!resList) {
          res.sendStatus(404);
        } else {
          list = resList;
          return db.collection('items').find({
            list: new mongo.ObjectID(req.params.id),
            deleted: false,
          }).toArray();
        }
      },
    ).then(
      (items) => {
        res.json({
          ...list,
          items: items || [],
        })
      },
    )
  };

  router.get('', getLists);

  router.get('/:id', getList);

};
