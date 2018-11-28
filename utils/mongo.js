const MongoClient = require('mongodb').MongoClient;

let _db;

module.exports  = {
  connectToServer: (url, srv, user, password, callback) => {
    if (srv) {
      url = `mongodb+srv://${user}:${password}@${url}`;
    } else {
      url = `mongodb://${url}`;
    }
    const client = new MongoClient(url, { useNewUrlParser: true });

    if (client) {
      client.connect(function (err) {
        if (err) {
          throw err;
        } else {
          _db = client.db('christmasList');
          if (callback) {
            return callback(err);
          }
        }
      });
    }
  },
  getDb: function() {
    return _db;
  }
};
