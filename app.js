//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/userDB");

//create a full mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//create a mongoose model to use
const User = new mongoose.model("User",userSchema);
// basic get/post routes
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

  bcrypt.hash(req.body.password, saltRounds, function(err,hash){
    const regUser = new User({
      email: req.body.username,
      //md5() function will hash the inputs inside the ()
      password: hash
    });
  //save your data to database
    regUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  //compare the hashed password with the entered hashed Password
  //hashing always results in the same output for the given input
  const password = req.body.password;
  //mongoose encrypt will decrypt and get the password when we use find()
  User.findOne({email:username}, function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===True){
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000,function(req,res){
  console.log("app.js started");
});
