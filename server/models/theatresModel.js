const mongoose = require('mongoose');

const theatresSchema = new mongoose.Schema(
    {
        theatreName : {
            type : String,
            required : true
        },

        city : {
            type : String,
            required : true
        }
    }
)

const Theatres = mongoose.model("theatres", theatresSchema);

module.exports = Theatres;