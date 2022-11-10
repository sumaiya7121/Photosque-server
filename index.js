const express = require('express');
const cors = require('cors');
const app= express();
require('dotenv').config();
const port =process.env.PORT || 5000;

//middle wires
app.use(cors());
app.use(express.json());

//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@project1.puheqno.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){


try{

const serviceCollection = client.db('photosque').collection('services');
const reviewCollection = client.db('photosque').collection('review');

app.get('/service',async(req,res)=>{

const query ={}
const limit = 3;
const cursor =serviceCollection.find(query).limit(limit);
const services =await cursor.toArray();
res.send(services);


});

app.get('/services',async(req,res)=>{

const query ={}

const cursor =serviceCollection.find(query);
const services =await cursor.toArray();
res.send(services);


});



app.get('/services/:id',async(req,res)=>{

const id= req.params.id;

const query ={_id: ObjectId(id)}
const service = await serviceCollection.findOne(query)
res.send(service);

});


app.post('/services',async (req,res)=>{

    const service=req.body;
    const result= await serviceCollection.insertOne(service);
    res.send(result);

})


//reviews

app.get('/reviews',async(req,res)=>{

const query ={}

const cursor =reviewCollection.find(query);
const services =await cursor.toArray();
res.send(services);


})

app.get('/myreviews',async(req,res)=>{
let query={};

    if(req.query.email)
    {
    query={
    email:req.query.email
          }
    }
    const options = {
      sort: { createdTime: -1 },
    };


const cursor= reviewCollection.find(query,options);
const review = await cursor.toArray();
res.send(review);



});

app.post('/myreviews', async(req,res)=>{

    const review=req.body;
    const result =await reviewCollection.insertOne(review);
    res.send(result);


});

//delete

app.delete('/myreviews/:id',async(req,res)=>{

const id =req.params.id;
const query={_id: ObjectId(id)};
const result = await reviewCollection.deleteOne(query);
res.send(result);




})

// update review API start
app.patch("/reviews/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const previousReview = req.body;
    const updatedReview = {
      $set: {
        review: previousReview.review,
        username: previousReview.username,
        photoURL: previousReview.photoURL,
        useremail: previousReview.useremail,
        ratings: previousReview.ratings,
      },
    };
    const result = await reviewsCollection.updateOne(filter, updatedReview);
    res.send(result);
  });



}




finally{


}
}
run().catch(err=>console.log(err));


app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})