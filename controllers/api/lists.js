const mongo = require('mongodb');
const mongoUtil = require( '../../utils/mongo' );
const _ = require('lodash');
const db = mongoUtil.getDb();
var secured = require('../../lib/middleware/secured');

module.exports = function (router) {

  const getLists = (req, res) => {
    db.collection('lists').aggregate([
      {
        $lookup: {
          from: 'items',
          let: { 'list_id': '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ '$listId',  '$$list_id' ] },
                    { $eq: [ '$deleted',  false ] }
                  ]
                }
              }
            }
          ],
          as: 'items'
        }
      },
    ]).toArray()
    .then((lists) => {
      res.json(lists);
    })
  };

  const getList = (req, res) => {
    let list;
    let user;

    db.collection('lists').aggregate([
      {
        $match: {
          _id: new mongo.ObjectID(req.params.id)
        }
      },
      { $limit : 1 },
      {
        $lookup: {
          from: 'items',
          let: {
            list_id: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ '$listId',  '$$list_id' ] },
                    { $eq: [ '$deleted',  false ] },
                  ]
                }
              }
            }
          ],
          as: 'items'
        }
      }
    ]).toArray()
    .then((resLists) => {
      if (!resLists[0]) {
        res.sendStatus(404);
        return;
      } else {
        list = resLists[0];
        if (req.user) {
          return db.collection('users').findOne({
            'auth0.id': req.user.id,
          });
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

  router.get('', secured.authenticated(false), getLists);

  router.get('/:id', secured.authenticated(false), getList);

};
