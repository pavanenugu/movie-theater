const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
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
            required : true
        },

        phone : {
            type : String,
            required : true
        },

        role : {
            type : String,
            required : true
        }
    }
)

const Users = mongoose.model("users", usersSchema);

module.exports = Users;