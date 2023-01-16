var express = require("express")
var cors = require("cors")
var mongoose  = require("mongoose")

var app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');

mongoose.connect('mongodb://127.0.0.1:27017/myLoginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/myLoginDB'
  })
}));

const User = mongoose.model('User',{
	name: { type: String },
	email: { type: String },
    password: { type: String}
});


app.post("/login", (req, res)=> {
  console.log(req.body);
  const { email, password} = req.body
  User.findOne({ email: email}, (err, user) => {
      if(user){
          if(password === user.password ){
              res.send({message: "Login  Successfull", user: user})
          } else {
              res.send({ message: "Password didn't match"})
          }
      } else {
          res.send({ message: "User not registered"})
      }
  })
})

app.post("/register", (req, res)=> {
    console.log(req.body);
    const {name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                console.log(err)
                if(err) {
                    res.send(err)
                } else {
                    res.send( {message: "Successfully Registered"})
                 }
             })
         }
     })
 })


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 9002;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});