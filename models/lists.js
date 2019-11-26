const mongo = require('mongodb');
const mongoUtil = require( '../utils/mongo');
const db = mongoUtil.getDb();

class ListsModel {

  constructor() {

  }


  getLists() {
    return db.collection('lists').aggregate([
      {
        $match: {
          deleted: {$ne: true},
        },
      },
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
    ]).toArray();
  }

  updateLists(lists) {
    const requests = [];

    lists.forEach(list => {
      const dbRequest = db.collection('lists').findOneAndUpdate(
        {
          _id: new mongo.ObjectID(list._id)
        },
        {
          $set: {
            name: list.name,
            position: list.position,
          }
        }
      );
      requests.push(dbRequest);
    });

    return Promise.all(requests);
  }

  getList(id) {
    return db.collection('lists').aggregate([
      {
        $match: {
          _id: new mongo.ObjectID(id)
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
    ]).toArray();
  }

  addList(list) {
    const listsModel = new ListsModel();
    return db.collection( 'lists' ).insertOne(
      {
        ...list,
        items: [],
      }
    )
      .then((result) => listsModel.getList(result.insertedId));
  }

  updateList(id, list) {
    const listsModel = new ListsModel();
    return db.collection('lists').updateOne(
      {
        _id: new mongo.ObjectID(id)
      },
      {
        $set: {
          name: list.name || '',
          user: list.userId || null,
        },
      }
    )
      .then(() => listsModel.getList(id));
  }

  deleteList(id) {
    return db.collection( 'lists' ).updateOne(
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

}

module.exports = ListsModel;
