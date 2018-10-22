const express= require("express");
const mongoose= require("mongoose");
const users= require("./routes/api/users")
const posts = require("./routes/api/posts")
const profile = require("./routes/api/profile")
const bodyParser = require("body-parser");
const passport=require("passport");

const app=express();
//Body-Parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db=require("./config/keys").mongoURI;
//Connect Mongo DB
mongoose
    .connect(db)
    .then(() => console.log("MongoDb Connected"))
    .catch(err => console.log(err));

app.get('/', (req,res) => res.send("Hello World!!"));
//Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

var PORT=process.env.PORT || 5001 ;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));