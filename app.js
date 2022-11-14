//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/userDB");

//create a full mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  pasword: String
});

//key for encryption
const secret = process.env.SECRET;
//specifying what to encrypt
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]});

//create a model for the schema
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const regUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  //mongoose encrypt will encrypt when we use save
  regUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  //mongoose encrypt will decrypt and get the password when we use find()
  User.findOne({email: username},function(err,result){
    if(!err){
      if(result){
        if(result.password === password){
          res.render("secrets");
        }else{
          console.log("Password incorrect bro, try again bro, bye bro")
        }
      }
    }else{
      console.log("There seems to be some error");
    }
  });
});


app.listen(3000,function(req,res){
  console.log("app.js started");
});
