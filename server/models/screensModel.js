const mongoose = require('mongoose');
const Theatres = require('./theatresModel');

const { Schema } = mongoose;

const screensSchema = new mongoose.Schema(
    {
        screen_no : {
            type : String,
            required : true
        },

        theatre_id : {
            type : Schema.Types.ObjectId,
            ref : Theatres,
            required : true
        },

        rows : {
            type : Number,
            required : true
        },

        cols : {
            type : Number,
            required : true
        },
    }
)

const Screens = mongoose.model("screens", screensSchema);

module.exports = Screens;