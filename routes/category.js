const express = require("express");
const router = express.Router();
const Category = require("../Schema/categorySchema");
const upload = require("./multer");
let fs = require('fs');
let dotenv = require("dotenv");

dotenv.config();
const filepath = process.env.FILEPATH;

// Api to submit category
router.post("/submit_category", upload.single("icon"), async (req, res) => {
        try {
            const { categoryname } = req.body;
            const icon = req.file.filename;
    
            const category = new Category({ categoryname, icon });
            await category.save();
    
            console.log(JSON.stringify(category)); 
    
            res.status(200).json({ status: true, message: "Category submitted successfully" });
        } catch (error) {
            console.error("Error submitting category:", error.message); // Improved error logging
            res.status(500).json({ status: false, message: "Server error..." });
        }
    });

// Api to display all the categories
router.get("/display_all_category", async (req, res) => {
        try {
            const categories = await Category.find();
            for(let i = 0;i<categories.length;i++){
                console.log(JSON.stringify(categories[i]))
        }
            res.status(200).json({
                status: true,
                data: categories,
                message: "Categories Fetched Successfully",
            });
        } catch (error) {
            console.error("Error fetching categories:", error.message); // Improved error logging
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    
// Api to edit category
router.post("/edit_category", async (req, res) => {
        const { categoryId, categoryname } = req.body;
        console.log(req.body);
        try {
            await Category.updateOne({ _id: categoryId }, { $set: { categoryname } });
            res.status(200).json({ status: true, message: "Category Updated Successfully" });
        } catch (error) {
            console.error("Error", error);
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    

// Api to Delete category
router.post("/delete_category", async (req, res) => {
        const { categoryid, oldIcon } = req.body;
        console.log("Category Id and Icon: ", JSON.stringify(req.body));
    
        try {
            const category = await Category.findById(categoryid);
    
            if (!category) {
                return res.status(404).json({ status: false, message: "Category is not found" });
            }
    
            const previousIcon = oldIcon || category.icon; // Corrected access to category's icon
    
            await Category.deleteOne({ _id: categoryid });
    
            if (previousIcon) {
                const imagePath = `${filepath}/${previousIcon}`;
                try {
                    fs.unlinkSync(imagePath);
                    console.log("Previous image deleted successfully");
                } catch (err) {
                    console.error("Error deleting previous image: ", err);
                }
            }
    
            return res.status(200).json({ status: true, message: "Category deleted Successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    

// Api to Edit Category Icon
router.post("/edit_picture", upload.single("icon"), async (req, res) => {
        const { categoryid } = req.body;
        const newIcon = req.file.filename;
    
        try {
            const category = await Category.findById({ _id: categoryid });
    
            if (!category) {
                return res.status(404).json({ status: false, message: "Category is not found" });
            }
    
            const previousIcon = category.icon;
    
            await Category.updateOne(
                { _id: categoryid },
                { $set: { icon: newIcon } }
            );
    
            if (previousIcon && previousIcon !== newIcon) {
                const imagePath = `${filepath}/${previousIcon}`;
                try {
                    fs.unlinkSync(imagePath);
                    console.log("Previous image deleted successfully");
                } catch (err) {
                    console.error("Error deleting previous image: ", err);
                }
            }
    
            res.status(200).json({ status: true, message: "Category Icon Updated Successfully" });
        } catch (error) {
            console.error("Error updating category icon:", error);
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });    
    
module.exports = router;
