const express = require('express');
const cors = require("cors");
const { connectToDB, getDb } = require('./db')


// initializing express app
const app = express();


// middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json());   // Parse JSON bodies


//db connection
let database; 

connectToDB((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('Listening on port 3000')
        })
        database = getDb();
    }
})


// Sample route
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Node.js!" });

});



// Route handlers
app.get('/blogs', (req, res) => {
    database.collection('blogs').find().toArray()
    .then(blogs => res.json(blogs))
})

app.post('/test-api', (req, res) => {
    const newBook = req.body;
    console.log(newBook);
    res.json(newBook);
})