const mongoose = require('mongoose');

const { Schema } = mongoose;

const showtimesSchema = new mongoose.Schema(
    {
        movieid : {
            type : Schema.Types.ObjectId,
            required : true
        },
        
        showDate : {
            type : Date,
            required : true
        },

        showStartTime : {
            type : String,
            required : true
        },

        price : {
            type : Number,
            required : true
        },

        screen_id : {
            type : Schema.Types.ObjectId
        },

        seats_booked : {
            type : Array
        }
    }
)

const Showtimes = mongoose.model("showtimes", showtimesSchema);

module.exports = Showtimes;