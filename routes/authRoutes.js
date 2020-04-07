const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

router.route('/facebook').get(passport.authenticate('facebook'));
router.route('/auth/facebook/callback').get(passport.authenticate('facebook'), (req, res) => {
    res.send("heyy");
})

router.route('/signup').post((req, res) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        message: "User added successfully"
                    });
                }
            ).catch((err) => {
                res.status(500).json({
                    error: err
                })
            })
        }
    );
});
router.route('/login').post((req, res) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            if (!user) {
                // user doesnt exist
               return res.status(401).json({
                    error: new Error('User not found!')
                })
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect password')
                        })
                    }
                    const token = jwt.sign({ userId: user._id }, keys.jwtKey, {
                        expiresIn: '12h'
                    });
                    res.status(201).json({
                        email: user.email,
                        username: user.username,
                        userId: user._id,
                        token: token
                    })
                }
            ).catch((err) => {
                res.status(500).json({
                    error: err
                })
            })
        }
    ).catch((err) => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router;