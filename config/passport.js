const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const googleUser = require('../models/googleUserModel');

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/userVerification/google/callback",
  passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) =>{
  try {
    let user = await googleUser.findOne({ googleId: profile.id });
    if (!user) {
      user = new googleUser({
        googleId: profile.id,
        email: profile.email,
        name: profile.displayName,
      });
      await user.save();
    }
    return done(null, {user,email:profile.email});
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await googleUser.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

module.exports = passport;
