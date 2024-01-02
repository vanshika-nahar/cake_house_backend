const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bannerSchema = new Schema({
    bannername:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Banner",bannerSchema);