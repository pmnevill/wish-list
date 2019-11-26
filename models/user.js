const mongoUtil = require( '../utils/mongo' );
const db = mongoUtil.getDb();

class UserModel {

  getUser(id) {
    return db.collection('users').findOne({
      'auth0.id': id,
    });
  }

  getUsers() {
    return db.collection('users')
      .find()
      .project({
        'auth0.displayName': 1,
        'auth0.id': 1,
        'auth0.picture': 1,
      })
      .toArray();
  }

}

module.exports = UserModel;
