const express = require('express');
const router = express.Router();
const passport = require('passport');


//Load profiles model
const Profile = require('../../models/Profile');

//Load User Profile
const User = require('../../models/User');

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
    
});


module.exports = router;