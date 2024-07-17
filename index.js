const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const session = require("express-session")
const flash = require('connect-flash');
const bodyParser = require("body-parser")
const passport = require('./config/passport');
const {blockCheckMiddleware}=require('./middleware/blockCheck');
const razorpay=require('razorpay');
app.use(flash());
const nocache = require("nocache");
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then((data)=>{
    console.log('mongodb Connected')
  })
const sharp= require('sharp');

app.use(
    express.urlencoded({ extended: true })
  );
app.use(express.json());
const path = require('path');
app.use(session({
  secret: 'mysessionsecret', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:120 * 60 * 60 * 1000,
    httpOnly: true
}    
}));

app.use(blockCheckMiddleware);
app.use(flash());

const UserRoute = require("./routes/UserRoute");
const adminRoute = require("./routes/adminRoute");
app.set('view engine', 'ejs');
app.set('views',[ path.resolve(__dirname, 'views/user'),
path.resolve(__dirname, 'views/admin')]);
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public', {
  extensions: ['html', 'htm', 'webp', 'jpg', 'jpeg', 'png'], 
  setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  }
}));

app.use('/product',express.static('public'));
app.use('/',UserRoute);
app.use('/admin',adminRoute);
app.get("*",(req,res)=>{
  res.render("404")
})

app.listen(process.env.PORT,function(){
    console.log("server is running on port 3000");
}); 

