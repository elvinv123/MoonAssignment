const express = require("express");
const router = express.Router();
const User = require('../../models/User'); // User model
const bcrypt = require('bcryptjs'); // Used to salt and hash password
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken'); 
const passport = require('passport'); 

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// Allows a new user to register for an account
// Body of request must have 'email', 'password', and 'password 2' as keys with the corresponding values as your input
router.post('/register', (req, res) => {

    // Validates inputs within the body of the request
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check to make sure nobody has already registered with a duplicate email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // Use the validations to send the error
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
})

// Allows registered users to login with their email and password.
// Returns JSON web tokens to be used for protected routes
// Body of request must have 'email' 'password' as keys with the corresponding values as your input

router.post('/login', (req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    // Validates inputs within the body of the request
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: email})
        .then(user => {
            if(!user){
                // Use the validations to send the error
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {
                            id: user.id,
                            email: user.email
                        }
                        // create JSON web token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            }
                        )
                    } else {
                        errors.password = 'Incorrect password'
                        return res.status(400).json(errors);
                    }
                })
        })
})

// Passport added as middleware function to protect route, allowing access to only users who are logged in
// Corresponding JSON web token must be added as Authorization header in request to have access
// Request (req) object will have a user key that will be the current user based on JSON web token

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email
    });
})

module.exports = router;