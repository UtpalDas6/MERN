const express = require("express");
const router = express.Router();
const mongosse= require("mongoose");
const passport= require("passport");

//Load profiles
const Profile= require('../../models/Profile');
//Load Users
const User = require('../../models/User');

// @route GET api/profile/test
// @desc Test profile
// @access PUBLIC
router.get('/test', (req, res) => res.json({ msg: "Profile Works!" }));

// @route GET api/profile
// @desc Test profile
// @access PUBLIC
router.get('/', passport.authenticate('jwt', {session: false }), (req,res) => {
    const errors = {};
    
    Profile.findOne({user : req.user.id})
        .then(profile => {
            if(!profile) {
                errors.noprofile="User Profile Not Found";
                return res.status(404).json(errors);
            }
        })
        .catch(err => res.status(404).json(err))
});

module.exports = router;