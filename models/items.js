const mongo = require('mongodb');
const mongoUtil = require( '../utils/mongo');
const _ = require('lodash');
const db = mongoUtil.getDb();

class ItemsModel {

  constructor() {

  }

  updateItem(id, item) {
    const itemsModel = new ItemsModel();

    return db.collection('items').updateOne(
      {
        _id: new mongo.ObjectID(id)
      },
      {
        $set: {
          name: item.name || '',
          price: item.price || 0,
          url: item.url || '',
          img: item.img || '',
          purchased: item.purchased || false,
          favorite: item.favorite || false,
          position: item.position || null,
        },
      }
    )
      .then(() => itemsModel.findItem(id))
  }

  findItem(id) {
    return db.collection('items').findOne({
      _id: new mongo.ObjectID(id),
    });
  }

  deleteItem(id) {
    return db.collection( 'items' ).updateOne(
      {
        _id: new mongo.ObjectID(id)
      },
      {
        $set: {
          deleted: true,
        },
      }
    );
  }

  addItem(item) {
    const itemsModel = new ItemsModel();

    return db.collection( 'items' ).insertOne(
      {
        ...item,
        hidden: _.isBoolean(item.hidden) ? item.hidden : false,
        listId: new mongo.ObjectID(item.listId),
        deleted: false,
        purchased: false,
      }
    )
      .then((result) => itemsModel.findItem(result.insertedId));
  }

}

module.exports = ItemsModel;
