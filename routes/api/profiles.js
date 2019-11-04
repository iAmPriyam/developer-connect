const express = require('express');
const router = express.Router();
const passport = require('passport');


//Load profiles model
const Profile = require('../../models/Profile');

//Load User Profile
const User = require('../../models/User');

//Load Profile validation
const validateProfileInput = require('../../validation/profiles');

//@route GET api/profiles/test
//@desc tests profiles route
//@access Public
router.get('/test', ( req,res) => res.json({msg:"profile works"}));


//@route GET api/profiles/
//@desc get current profile
//@access Public
router.get('/', passport.authenticate("jwt", {session: false}), (req,res)=>{
    const errors ={};
    Profile.findOne({user : req.user.id})
    .then(profile =>{
        if(!profile){
            errors.noProfile="Profile not found";
            return res.status(404).json(errors);
        }
        else
            res.json(profile);
    })
        .catch(err => res.status(404).json(err));
});



//@route POST api/profiles/
//@desc create profile
//@access Public
router.post('/', passport.authenticate("jwt", {session: false}), (req,res)=>{

    const {errors, isValid} = validateProfileInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle= req.user.handle;
    if(req.body.company) profileFields.company= req.body.company;
    if(req.body.website) profileFields.website= req.body.website;
    if(req.body.location) profileFields.location= req.body.location;
    if(req.body.bio) profileFields.bio= req.body.bio;
    if(req.body.githubusername) profileFields.githubusername= req.body.githubusername;
    if(req.body.status) profileFields.status= req.body.status;
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills =req.body.split(',')
    } 
    profileFields.social ={};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user : req.user.id})
        .then(profile =>{
            if(profile){
                //Update
                Profile.findOneAndUpdate({user : req.user.id}, 
                    {$set: profileFields},
                    { new: true}
                    )
                .then(profile =>{
                    return res.json({profile});
                })
            }
            else{
                //Create

                //Check if handle exists
                Profile.findOne({handle : profileFields.handle})
                    .then(profile =>{
                        if(profile){
                            errors.handle= `User with handle ${profileFields.handle} already exists!`;
                            res.status(400).json(errors);
                        }
                        else{

                            // Create and save a new profile
                            new Profile(profileFields).save()
                                    .then(profile=>{
                                        return res.json(profile);
                                    })
                        }
                    })
            }
        })
});


module.exports = router;