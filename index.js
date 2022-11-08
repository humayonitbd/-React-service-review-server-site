const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
// console.log(uri)
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
const reviewConnection = client.db('services-reviews').collection('reviewMessage');

//service data load home page
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

//service all data load service page 
app.get('/allService', async(req, res)=>{
    try {
        const query = {};
        const cursor = servicesConnection.find(query);
        const allServices = await cursor.toArray();
        res.send(allServices)
        
    } catch (error) {
        console.log(error.message)
        
    }
})


//single services data load 
app.get('/allService/:id', async(req, res)=>{
    try {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const singleService = await servicesConnection.findOne(query);
        res.send(singleService)
        
    } catch (error) {
        console.log(error.message)
        
    }
})


//review message post 
app.post('/reviewMessage', async(req, res)=>{
    try {
        const body = req.body;
        const review = await reviewConnection.insertOne(body);
        if(review.insertedId){
            res.send({
                success: true,
                message: 'Thanks for product review !!'
            })
        }else{
            res.send({
                success: false,
                error: 'Faild! your review, please try !!'
            })
        }

        
    } catch (error) {
        console.log(error.message)
        
    }
})

//review message get all post
app.get('/reviewMessage', async(req, res)=>{
    try {
        const query = {};
        const cursor = reviewConnection.find(query);
        const reviewData = await cursor.toArray();
        res.send(reviewData);
        
    } catch (error) {
        console.log(error.message)
        
    }
}) 





app.listen(port,()=>{
    console.log('your port is runnig', port)
})