const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 6000;

// MIDDLEWARE 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWAORD}@cluster0.cc39d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{

        await client.connect();
        const database = client.db("Travel & Tourism");
        const servicesCollection = database.collection("services")

        // Get Single Item
        app.get('/services/:id', async(req,res) => {
            const id = req.params.id;
            console.log("getting id", id);
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // POST API
        app.post('/services', async (req,res) => {
        
        const service = req.body;
        console.log('hit the post api', service);
        
        const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);
    })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running travel Project")
})

app.listen(port, () =>{
    console.log("server Running on port", port);
})
