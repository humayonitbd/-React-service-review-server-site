const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle ware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('server is running...')
})



const uri = `mongodb+srv://services-reviews:zrkNJWfGhFidpMGT@cluster0.epqkzkd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect(){
    try {
        await client.connect();
        console.log('db connect')
        
    } catch (error) {
        console.log(error.message)
        
    }

}
dbConnect();
const servicesConnection = client.db('services-reviews').collection('services');

app.get('/services', async(req, res)=>{
    try {
        const query = {};
        const cursor = servicesConnection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);

        
    } catch (error) {
        console.log(error.message, error.name)
        
    }
})







app.listen(port,()=>{
    console.log('your port is runnig', port)
})