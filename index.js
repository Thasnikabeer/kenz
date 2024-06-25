const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const session = require("express-session")
const flash = require('connect-flash');
const bodyParser = require("body-parser")
const passport = require('./config/passport');
const {blockCheckMiddleware}=require('./middleware/blockCheck');
// mongoose.connect("mongodb://127.0.0.1:27017/kenzEcommerce");
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
//to resolve validation error
app.use(
    express.urlencoded({ extended: true })
  );
app.use(express.json());
const path = require('path');

// const cookieParser = require("cookie-parser");

app.use(session({
  secret: 'mysessionsecret', // Change this to a long, random string
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:120 * 60 * 60 * 1000,
    httpOnly: true
}    
}));

app.use(blockCheckMiddleware);


const UserRoute = require("./routes/UserRoute");
const adminRoute = require("./routes/adminRoute");

// -------------------------------------------------------------
// // Define a route
// app.get('/top-product-sale', (req, res) => {
//   // Handle the request and send a response
//   res.send('This is the top product sale route');
// });

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views',[ path.resolve(__dirname, 'views/user'),
path.resolve(__dirname, 'views/admin')]);

// Serve static files
app.use(express.static('public', {
  extensions: ['html', 'htm', 'webp', 'jpg', 'jpeg', 'png'], // Specify allowed file extensions
  setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  }
}));

 app.use('/product',express.static('public'));








// Use the router defined in userRoute.js

app.use('/',UserRoute);

//for admin routes

app.use('/admin',adminRoute);


//error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
//   });

app.get("*",(req,res)=>{
  res.render("404")
})

app.listen(process.env.PORT,function(){
    console.log("server is running on port 3000");
}); 

