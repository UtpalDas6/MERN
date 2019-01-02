const express = require("express");
const router = express.Router();
const mongosse= require("mongoose");
const passport= require("passport");

//Load profiles
const Profile= require('../../models/Profile');
//Load Users
const User = require('../../models/User');
//Profile Validation
const validateProfileInput = require('../../validation/profile');

// @route GET api/profile/test
// @desc Test profile
// @access PUBLIC
router.get('/test', (req, res) => res.json({ msg: "Profile Works!" }));

// @route GET api/profile
// @desc Find profile
// @access PUBLIC
router.get('/', passport.authenticate('jwt', {session: false }), (req,res) => {
    const errors = {};
    
    Profile.findOne({user : req.user.id})
        .populate('user',['name','avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile="User Profile Not Found";
                return res.status(404).json(errors);
            }
        })
        .catch(err => res.status(404).json(err))
});

// @route POST api/profile
// @desc Create user profile
// @access PRIVATE
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const profileFields={};
    profileFields.user=req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //skills split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills=req.body.skills.split(',');
    }
    //social
    profileFields.social={};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id})
        .then(profile => {
            //update
            if(profile) {
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    { $set: profileFields },
                    {new:true}
                    )
                    .then(profile => res.json(profile));
            }//create
            else{
                //check if handle exists
                Profile.findOne({handle:profileFields.handle}).then(profile=>{
                    if(profile){
                        errors.handle='That handle already exists';
                        res.status(404).json(errors);
                    }
                    //save profile
                    
                    new Profile(profileFields).save().then(profile => res.json(profile));
                    
                });
            }
        })

});

module.exports = router;