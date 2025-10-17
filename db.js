const {MongoClient} = require('mongodb');

let dbConnection;

const local_db_uri = "'mongodb://localhost:27017/blogsList'"

// URI for MongoDB Atlas 
const URI = 'mongodb+srv://jeffreyBuencamino:Sk9boarding%24@node-course.chzvvjp.mongodb.net/production-blogs?retryWrites=true&w=majority&appName=node-course'

module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect(URI)
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