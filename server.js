const express =require('express');
const mongoose= require('mongoose');
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');
const bodyParser= require('body-parser');
const passport= require('passport');




const app=express();
//DB config

app.use(bodyParser.urlencoded({extednded:false}));
app.use(bodyParser.json());


const db=require('./config/keys').mongoURI;
// const client= new MongoClient(db,;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology : true } )
    .then(()=>console.log("connected to Mongo DB"))
    .catch(err=>console.log(err));

app.get('/',(req,res)=>{
    res.send('Hello World!');
});


//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

app.use('/api/users',users);
app.use('/api/profile',profiles);
app.use('/api/posts',posts);

const port= process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`));