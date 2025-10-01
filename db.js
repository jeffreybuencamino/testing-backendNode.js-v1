const {MongoClient} = require('mongodb');

let dbConnection;

module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/blogsList')
        .then((result) => {
            dbConnection = result.db()
            return cb()
        }) //result is client we just created when connecting to db
        .catch((err) => {
            console.log(err);
            return cb(err)
        })
    },

    getDb: () => dbConnection
}