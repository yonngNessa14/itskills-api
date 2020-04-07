const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const Users = mongoose.model('users');

// serializeuser creates a unique token for the users in database to pass to the cookie
// the first arg (user) is user that is returned by the done() in the passport callback
// i.e line 20 and 25
    
    passport.serializeUser((user, done) => {
        // user.id is the id from the database
        // it helps to give a unique id to the same user coming from different platforms like
        // facebook, twitter, google etc
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // this function takes the unique id from the above function 
        // and converts that id back to a user
        // find the user by the id from the DB
        Users.findById(id)
            .then(user => {
                done(null, user);
            })
    });

    passport.use(new FacebookStrategy({
        clientID: keys.facebookClientID,
        clientSecret: keys.facebookClientSecret,
        callbackURL: '/auth/facebook/callback',
        proxy: true,
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            
            // const getUser = await Users.findOne({ googleId: profile.id });
            // if (getUser) {
            //     console.log("already in");
                
            //     done(null, getUser);
            // }
            // else {
            //     const user = await new Users({ googleId: profile.id }).save();
            //     console.log("hello new");
                
            //     done(null, user);
            // }
        }));