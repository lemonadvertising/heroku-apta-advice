const LocalStrategy = require('passport-local').Strategy;
//const passport = require('passport');
const bcrypt = require('bcryptjs');

const UserLogin = require('../models/UserLogin.model');

module.exports = (passport) => {
    // Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        // Match Username
        let query = { email: username };
        UserLogin.findOne(query, (err, user) =>  {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'No user found' });
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    //console.log(req);
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong password' });
                }
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        UserLogin.findById(id,(err, user) => {
            done(err, user);
        });
    });
};