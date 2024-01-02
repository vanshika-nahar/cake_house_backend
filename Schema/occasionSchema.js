const { truncate } = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const occasionSchema = new Schema({
    occasionname:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model("Occasion",occasionSchema);