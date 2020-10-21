const JwtStrategy = require('passport-jwt').Strategy; //Tell passport to use strategy for JSON web tokens
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users'); // User model
const keys = require('../config/keys'); 

const options = {}; 
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extracting jwt from authorisation header
options.secretOrKey = keys.secretOrKey; // Check to see if signed

module.exports = passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    // return the user to the frontend
                    return done(null, user);
                }
                // return false since there is no user
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};