const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema(
    {

        firstName : {
            type : String,
            required : true
        },

        lastName : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true,
            unique: true
        },

        phone : {
            type : String,
            required : true
        },
        
        username : {
            type : String,
            required : true,
            unique: true
        },
        
        password : {
            type : String,
            required : true
        },

        role : {
            type : String,
            required : true
        },

        rewards : {
            type : Number,
            required : false
        },

        movieHistory: [{
            date: Date,
            movieName: String
        }]
    }
)

const Members = mongoose.model("members", membersSchema);

module.exports = Members;