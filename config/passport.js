// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;
// // const googleUser = require('../models/googleUserModel');
// const User = require("../models/userModel");

// passport.use(new GoogleStrategy({
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/userVerification/google/callback",
//   passReqToCallback: true
// },
// async (request, accessToken, refreshToken, profile, cb) =>{
//   console.log("Profile is :::",profile)
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//      const user = new User({
//         name:"fdfhb",
//         email:,
//        phone:googleUser.id
//       });
//       await user.save();
//     }
//     return cb(null, user ,{ successRedirect: "",});
//   } catch (error) {
//     console.log(error.message);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // passport.deserializeUser(async (id, done) => {
// //   try {
// //     const user = await googleUser.findById(id);
// //     done(null, user);
// //   } catch (error) {
// //     done(error, null);
// //   }
// // });

// module.exports = passport;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require("../models/userModel");

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/userVerification/google/callback",
  passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, cb) => {
  console.log("Profile is :::", profile);
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        phone: profile.id, // You can change this to a default value if needed
        image: profile.photos[0].value,
        googleId: profile.id,
        is_varified: profile.email_verified,
        // Add other necessary fields if needed
      });
      await user.save();
    }
    return cb(null, user);
  } catch (error) {
    console.log(error.message);
    return cb(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
