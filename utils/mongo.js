const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

let _db;

module.exports  = {
  connectToServer: (privateKey, url, callback) => {
    const keyFile = fs.readFileSync(privateKey);

    if (keyFile) {
      const client = new MongoClient(url, {
        sslValidate: true,
        sslCA: [keyFile]
      });

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
    }
  },
  getDb: function() {
    return _db;
  }
};
