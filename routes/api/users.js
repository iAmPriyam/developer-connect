const express = require('express');
const router = express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const key =require('../../config/keys');
const passport=     require('passport')


//Load User Model
const User = require('../../models/User');



// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


//@route GET api/users/test
//@desc tests users route
//@access Public
router.get('/test', ( req,res) => res.json({msg:"User works"}));


//route     POST api/users/register
//@desc     Register User
//@access   Public
router.post('/register', (req,res)=>{

    const {errors, isValid} =validateRegisterInput(req.body)

    // Input validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            return res.status(400).json({email:'Email already exists!'});
        }
        else{
            const avatar=gravatar.url(req.body.email,{
                s:'200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    // if(err) {throw err};
                    newUser.password=hash;
                    newUser.save()
                        .then(user=> res.json(user))
                        .catch(err=> console.log(err))
                });
            });
        }
    });
});



//route     POST api/users/register
//@desc     Register User
//@access   Public
router.post('/login',(req, res)=>{

    const {errors, isValid} =validateLoginInput(req.body);

    // Input validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email=req.body.email;
    const password=req.body.password;    
    User.findOne({email:email})
        .then(user=>{
            //Check for user
            if(!user){
                errors.email="Email not found"
                res.status(400).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch =>{
                    if(isMatch){
                        //Email found, Password correct
                        const payload= {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }

                        // sign token
                        jwt.sign(
                            payload, 
                            key.secretOrKey, 
                            { expiresIn : 3600}, 
                            (err, token) => { 
                                if(err) throw err;
                                res.json({
                                    success:true,
                                    token : "Bearer " + token
                                })
                            });
                    }
                    else{
                        errors.password="Password Incorrect";
                        res.status(400).json(errors);
                    }
                })
        })
});




//@route GET api/users/current
//@desc returns current user
//@access Protected
router.get('/current', passport.authenticate('jwt', {session:false}), (req,res)=>{
    res.json(req.user)
});

module.exports = router;