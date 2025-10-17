const express = require('express');
const cors = require("cors");
const { connectToDB, getDb } = require('./db')
const { ObjectId } = require('mongodb');


// initializing express app
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://jeffs-blog-59acf.web.app/'], // Allow localhost and production URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
};

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

//  Variable assignment for MongoDB collections name 
const blogs_db = "prod_blogs";



// Sample route
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Node.js!" });

});



// Route handlers
app.get('/blogs', (req, res) => {
    database.collection(blogs_db).find().toArray()
    .then(blogs => res.json(blogs))
})

// app.post('/test-api', (req, res) => {
//     const newBook = req.body;
//     console.log(newBook);
//     res.json(newBook);
// })

// retrieve single blog through route parameter
app.get("/blog/:id", (req, res)=>{
    database.collection(blogs_db).findOne({_id: new ObjectId(req.params.id)})
    .then(doc=>{
        res.status(200).json(doc)
    }).catch(err=>res.status(500).json({error: "Could not fetch doc."}))
})

// Receives POST request at /blogs route to add data to MongoDB.
app.post('/blogs', (req, res)=>{
    console.log(req.body);
    const doc = req.body;
    database.collection(blogs_db).insertOne(doc)
        .then(result=>{
            res.status(201).redirect("/")
        }).catch(err=>{
            res.status(500).json({error: "error sending json"})
        })
})

// Finds desired database and and sends data as response to front-end for editing through route params.
app.get('/edit/:id', (req, res)=>{
    const {id} = req.params.id;
    console.log('request made', req.params.id);
    database.collection(blogs_db).findOne({_id: new ObjectId(req.params.id)})
    .then(doc=>res.status(200).json(doc))
    .catch(err=>console.log)
})

//Updates data based on route paramater
app.put('/editblog/:id', (req, res) => {
  const id = req.params.id;
  const updateData = { ...req.body }; // clone to avoid mutating original

    // Remove _id field if present
  delete updateData._id;
  console.log('Id', id);
  console.log(updateData);

  database.collection(blogs_db).updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    .then(result => {
        res.json({ message: 'Document updated successfully' })
        console.log('i think it worked.')
        console.log(result);
    })
    .catch(err => {
        res.status(500).json({ error: err.message })
        console.log(err);
    });
});

// Deletes blog
app.delete('/deleteblog/:id', (req, res) => {
    const id = req.params.id;

    database.collection(blogs_db).deleteOne({ _id: new ObjectId(id) })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: "Blog deleted successfully"})
                console.log("Result: ", result)
                // console.log("response: ", res)
            } else {
                res.status(404).json({error: "Blog not found"})
                console.log("result: ", result);
                console.log("response: ", res);
            }
        })
        .catch(err=> {
            res.status(500).json({error: "could not delete blog"})
            console.log(err);
        })

})