const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const cors = require("cors");

require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;

const mongodb_password = process.env.mongodb_password;
const saltRounds = 20;
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    withCredentials:true
}))

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // console.log(arg);
    console.log('a user connected');

    // mongoose.connection.on('open', function() {
    //     console.log('Connected to mongo server.');
    //     const changeStream = mongoose.connection.collection('users').watch();
    //     changeStream.on('change',(change) => {
    //         console.log(change);
    //         socket.emit("change_text_global", change);
    //     })
    // });

    socket.on("join_room", (data) => {
        console.log("joined room");
        socket.join(data);
    });

    socket.on("change_text", (data) => {
        socket.to(data.room).emit("change_text_global", data.realtimetext)
    });
});

// app.use(function(req, res, next) {
//     res.header('Content-Type', 'application/json;charset=UTF-8')
//     res.header('Access-Control-Allow-Credentials', true)
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     )
//     next()
//   });
  
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://kottedheeraj:"+ mongodb_password + "@cluster0.kugvsrx.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const realTimeTextSchema = new mongoose.Schema({
    email:String,
    realtimetext:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
const RealTimeText = mongoose.model("RealTimeText", realTimeTextSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser(function(){
    done(null, false, 'bad password')
}));
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res) => {
    console.log(__dirname);
});

app.post("/register", (req, res) => {
    console.log(req.body);
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.send(err);
        }
        else {
            passport.authenticate("local")(req, res, function(){
                console.log("authenticated");
                const realTimeTextData = new RealTimeText({
                    email: req.body.username,
                    realtimetext:''
                })
                realTimeTextData.save();
                res.send("authenticated successfully");
            })
        }
    })
});

app.get("/isAuthenticated", (req, res) => {
    res.send(req.isAuthenticated());
});

//login and register api handlers
app.post("/login", (req, res) => {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        res.send("authenticated successfully");
    }else{
        const user = new User({
            email: req.body.username,
            password: req.body.password
        });

        passport.authenticate("local")(req, res, function(){
            console.log("Authenticated");
            res.send("authenticated successfully");
        });
    }
});


app.post("/realtime-text", async (req, res) => {
    const filter = {'email': req.body.username};

    if(req.body.type === "push"){
        const update = { 'realtimetext': req.body.realtimetext};

        const realTimeData = await RealTimeText.findOneAndUpdate(filter, update);
        res.send(JSON.stringify(realTimeData));
    }
    else if(req.body.type === "pull"){
        const realTimeData = await RealTimeText.findOne(filter);
        console.log(realTimeData)
        res.send(realTimeData);
    }
});

app.get("'/logout", (req, res) =>{
    req.logout();
    res.send(true);
});

server.listen(port, () => {
    console.log("server running on port 3001");
});