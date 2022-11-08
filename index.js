const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle ware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('server is running...')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.epqkzkd.mongodb.net/?retryWrites=true&w=majority`;
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

//jwt verify 

function verifyJWT(req, res, next){
    const authorization = req.headers.authorization;
    if(!authorization){
        res.status(401).send({message: 'unauthoriziton access'})
    }
    const token = authorization.split(' ')[1];
  
    jwt.verify(token, process.env.JWT_TOKEN, function(err, decoded){
        if(err){
            res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
   
}



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
app.get('/reviewMessage', verifyJWT, async(req, res)=>{
    try {
        // console.log(req.headers)
        const decoded = req.decoded;
        if(decoded.email !== req.query.email){
            res.status(403).send({message: 'unauthorized access!'})
        }

        let query = {};
        if(req.query.email){
            query = {
                email: req.query.email 
            }
        }
        const cursor = reviewConnection.find(query);
        const reviewData = await cursor.toArray();
        res.send(reviewData);
        
    } catch (error) {
        console.log(error.message)
        
    }
}) 

//review message delete
 app.delete('/reviewMessage/:id', async(req, res)=>{
    try {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await reviewConnection.deleteOne(query);
        // res.send(result)
        if(result.deletedCount){
            res.send({
                success: true,
                message: 'Successfully your deleted review!!'
            })
        }else{
            res.send({
                success:false,
                error: 'Do not deleted your review!!!'
            })
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
 })

 //all review get 
 app.get('/reviewMessage/:id', async(req, res)=>{
    try {
        const id = req.params.id;
        const query = {serviceId: id}
        const cursor = reviewConnection.find(query);
        const result = await cursor.toArray();
        res.send(result);
        
    } catch (error) {
        console.log(error.message)
        
    }



 })

//  jwt token post
app.post('/jwt', (req, res)=>{
    try {
        const user = req.body;
        console.log(user)
        const token = jwt.sign(user, process.env.JWT_TOKEN, {expiresIn: '1h'})
        res.send({token})
        
    } catch (error) {
        console.log(error.message)
    }
})


app.listen(port,()=>{
    console.log('your port is runnig', port)
})