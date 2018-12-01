const mongo = require('mongodb');
const mongoUtil = require( '../../utils/mongo' );
const db = mongoUtil.getDb();
var secured = require('../../lib/middleware/secured');

module.exports = function (router) {

  const updateItem = (req, res) => {
    db.collection( 'items' ).updateOne(
      {
        _id: new mongo.ObjectID(req.params.id)
      },
      {
        $set: {
          name: req.body.name || '',
          price: req.body.price || 0,
          url: req.body.url || '',
          img: req.body.img || '',
          purchased: req.body.purchased || false,
          favorite: req.body.favorite || false,
        },
      }
    ).then(() => {
      db.collection('items').findOne({
        _id: new mongo.ObjectID(req.params.id),
      }).then((item) => {
        res.json(item)
      });
    })
  };

  const deleteItem = (req, res) => {
    db.collection( 'items' ).updateOne(
      {
        _id: new mongo.ObjectID(req.params.id)
      },
      {
        $set: {
          deleted: true,
        },
      }
    ).then(() => {
      res.sendStatus(204);
    })
  };

  const addItem = (req, res) => {
    db.collection( 'items' ).insertOne(
      {
        ...req.body,
        list: new mongo.ObjectID(req.body.list),
        deleted: false,
        purchased: false,
      }
    ).then((result) => {
      db.collection('items').findOne({
        _id: result.insertedId,
      }).then((item) => {
        res.json(item)
      });
    })
  };

  router.post('', secured.authenticated(), secured.admin(), addItem);

  router.put('/:id', secured.authenticated(), secured.admin(), updateItem);

  router.delete('/:id', secured.authenticated(), secured.admin(), deleteItem);

};
