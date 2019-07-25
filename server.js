var express =  require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var session = require('express-session')

// set view  for server side template engine
app.set("view engine", "ejs");

app.set("views", path.join(__dirname,"app"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname)));

//session configuration
app.use(session({
  secret:"triviaApplication",
  saveUninitialized:true,
  resave:true
}))

//session authentication
var auth=function(req,res,next){
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.result){
    res.redirect("/");
  }else{
  next();
  }
}


var home = require('./app/home/route');
var second = require('./app/second/route');
var third = require('./app/third/route');
var result = require('./app/result/route');
var history = require('./app/history/route'); 

//routes
app.use('/', home);
app.use('/second', second);
app.use('/third',auth, third);
app.use('/result',auth, result);
app.use('/history', history);

//error handling
app.use((req, res, next) => {
    const error = new Error("unauthorized access");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      message: error.message
    });
});

//server listening..
app.listen(5555,(err)=>
{
  if(err)
    console.log(err);
    else
    console.log("Server is listening at 127.0.0.1:5555");
});
