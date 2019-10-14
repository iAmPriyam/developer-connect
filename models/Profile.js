const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create profile schema

const ProfileSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref: 'users'
    },
    handle : {
        type: String,
        required : true,
        max : 40
    },
    company :{
        type: String
    },
    website :{
        type : String
    },
    location : {
        type : String
    },
    status : {
        type : String,
        required : true
    },
    skills : {
        type : [String],
        required : true
    },
    bio : {
        type : String
    },
    githubusername:{
        type : String
    },
    experience : [
        {
            title : {
                type : String,
                required : true
            },
            company: {
                title : String,
                // required : true
            },
            location : {
                type  : String,
            },
            from : {
                type : Date,
                required : true
            },
            to : {
                type : Date
            },
            current : {
                type : Boolean,
                default : true
            },
            description :{
                type : String
            }
        }
    ],
    education : [
        {
            school : {
                type : String,
                required : true
            },
            degree: {
                title : String,
                // required : true
            },
            fieldOfStudy : {
                type  : String,
                required : true
            },
            from : {
                type : Date,
                required : true
            },
            to : {
                type : Date
            },
            current : {
                type : Boolean,
                default : true
            },
            description :{
                type : String
            }
        }
    ],
    social : {
        youtube: {
            type : String
        },
        twitter: {
            type : String
        },
        instagram: {
            type : String
        },
        linkedin: {
            type : String
        },
        facebook: {
            type : String
        }
    },
    date : {
        type : Date,
        default : Date.now
    }

});


module.exports = Profile = mongoose.model('profile', ProfileSchema);