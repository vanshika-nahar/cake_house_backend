const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subCategorySchema = new Schema({
	categoryid:{
		type: Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true
	},
	subcategoryname:{
		type:String,
		required:true
	},
	priority:{
		type:Number,
		required:true
	},
	icon:{
		type:String,
		require:true
	}
})

module.exports = mongoose.model("SubCategory",subCategorySchema);