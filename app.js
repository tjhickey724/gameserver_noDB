/*
gameserver
This is a minimal app to allow phone apps to communicate with each other.
The goal of this app was to build the simplest possible app that would meet that goal.
*/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

let rooms ={'152a':{a:5,b:6},'test':{a:1,b:2}};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res,next) => {
  res.json("Game Server "+Date());
})

app.get("/home",(req,res, next) => {
  res.render('homepage')
})

app.post('/postdemo', (req,res,next) => {
  res.locals.name=req.body.firstname;
  res.locals.grade = req.body.grade;
  res.render('postdemopage')
})

app.get("/rooms", (req,res,next) => {
  res.locals.rooms = rooms
  res.render('showrooms');
})

app.post("/rooms", (req,res,next) => {
  res.locals.rooms = rooms
  const id = req.body.id;
  const uid = req.body.uid;
  const data = req.body.data;
  if (id in rooms) {
    if (uid==""){
      delete rooms[id]
    }
    else if (data=="") {
      delete rooms[id][uid]
    } else {
      rooms[id][uid] = data;
    }  
  } else if ((id!="") && (uid!="")){
    rooms[id] = {};
    rooms[id][uid] = data;
  }
  res.render('showrooms');
})

app.get("/room", (req,res,next) => {
  const id = req.query.id;
  res.json(rooms[id]);
})

/*
 You can encode any JSON object x as a string with 
 s = JSON.stringify(x)
 and you can parse it from a string s to an object with
 x = JSON.parse(s)
*/
app.post("/room", (req,res,next) => {
  console.log('handling post request to room')
  console.dir(req.body)
  const id = req.body.id;
  const uid = req.body.uid;
  const data = req.body.data;
  if (id in rooms) {
    rooms[id][uid] = data;
  } else {
    rooms[id] = {};
    rooms[id][uid] = data;
  }
  res.json(rooms[id])
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
