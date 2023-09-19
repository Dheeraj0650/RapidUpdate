const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");

require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');

const mongodb_password = process.env.mongodb_password;
const saltRounds = 20;
const port = process.env.PORT || 3001;
const io = new Server(server);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://kottedheeraj:"+ mongodb_password + "@cluster0.kugvsrx.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.get("/", (req, res) => {
    console.log(__dirname);
    res.send("<h1>Hello World</h1>")
});

//login and register api handlers

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    
    User.find({email:email}).then(function(doc){
        if(doc && doc.length > 0){
            if(doc[0].email === email){
                bcrypt.compare(password, doc[0].password, function(err, result) {
                    console.log(result);
                });
                res.send(JSON.stringify("Authentication successful"));
            }
            else{
                res.send(JSON.stringify("Invalid credentials"));
            }
        }
        else {
            res.send(JSON.stringify("Invalid credentials"));
        }
    })
    .catch(function(err){
        res.send(JSON.stringify(err));
    })
});

app.post("/register", (req, res) => {
    User.register({username:req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
        } 
        else {
            passport.authenticate("local")(req, res, function(){
                console.log(req);
            })
        }
    });
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const usercreds = {
    //         email:req.body.username,
    //         password:hash
    //     }
    //     const newUser = new User(usercreds);
    //     newUser.save();
    // });
});

server.listen(port, () => {
    console.log("server running on port 3000");
});