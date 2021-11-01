const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWAORD}@cluster0.cc39d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db("Travel");
        const servicesCollection = database.collection("services")
        const myOrdersCollection = database.collection("myOrders")

        // Get Single Item
        app.get('/services/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get("/myOrders/:email", (req, res) => {
        console.log(req.params);
        myOrdersCollection
            .find({ email: req.params.email })
            .toArray((err, results) => {
                res.send(results);
            });
        });

        app.get('/orders', async (req, res) => {
        const results = await myOrdersCollection.find({}).toArray()
        res.send(results)

        })


        // POST API
        app.post('/services', async (req,res) => {
        
        const service = req.body;
        
        const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);


        app.post('/myOrders/:id', (req, res) => {
            
            myOrdersCollection.insertOne(req.body).then((documents) => {
            res.send(documents.insertedId);
            });

        })


        // DELETE API 
        app.delete('/cancelOrder/:id', async (req, res) => {
            const id = req.params.id;

            const query = {_id : ObjectId(id)};
            const result =  await myOrdersCollection.deleteOne(query);

            res.json(result);
        })
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
