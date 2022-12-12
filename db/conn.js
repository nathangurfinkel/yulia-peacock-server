/** conn.js
 *
 * Description: This file contains the connection to the MongoDB database.
 *
 * Author: Nathan Gurfinkel
 *
 */

const { MongoClient } = require('mongodb');
const Db = process.env.ATLAS_URI;
console.log('----------ENVARIABLE-----------');
console.log('process.env.ATLAS_URI: ', process.env.ATLAS_URI);
console.log('------------end----------------');

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db('yulia_peacock');
        console.log('Successfully connected to MongoDB.');
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};
