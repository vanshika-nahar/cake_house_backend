const express = require("express");
const router = express.Router();
const SubCategory = require("../Schema/subCategorySchema");
const upload = require("./multer");
let fs = require("fs");
let dotenv = require("dotenv");

dotenv.config();
const filepath = process.env.FILEPATH;

// Api to submit sub-category
router.post("/submit_sub_category", upload.single("icon"), async (req, res) => {
        try {
                const { categoryid, subcategoryname, priority } = req.body;
                const icon = req.file.filename;
                const subCategory = new SubCategory({
                        categoryid,
                        subcategoryname,
                        priority,
                        icon,
                });
                await subCategory.save();
                console.log(JSON.stringify(subCategory));
                return res
                        .status(200)
                        .json({ status: true, message: "SubCategory submitted successfully" });
        } catch (error) {
                console.error("Error submitting Subcategory:", error.message);
                return res.status(500).json({ status: false, message: "Server error..." });
        }
});

// Api to display all the sub-categories
router.get("/display_all_subcategory", async (req, res) => {
        try {
                const subcategories = await SubCategory.find({}).populate(
                        "categoryid",
                        "categoryname"
                );
                for (let i = 0; i < subcategories.length; i++) {
                        console.log(JSON.stringify(subcategories[i]));
                }
                return res
                        .status(200)
                        .json({
                                status: true,
                                data: subcategories,
                                message: "Sub-Categories Fetched Successfully",
                        });
        } catch (error) {
                console.error("Error fetching subcategories:", error.message); // Improved error logging
                res.status(500).json({ status: false, message: "Server Error..." });
        }
});

// Api to edit category
router.post("/edit_sub_category", async (req, res) => {
        const { subcategoryid, categoryid, subcategoryname, priority } = req.body;
        console.log(req.body);

        try {
                await SubCategory.updateOne(
                        { _id: subcategoryid },
                        { $set: { categoryid, subcategoryname, priority } }
                );

                res.status(200).json({ status: true, message: "Sub-Category Updated Successfully" });
        } catch (error) {
                console.error("Error updating sub-category:", error);
                res.status(500).json({ status: false, message: "Server Error..." });
        }
});

// Api to Delete category
router.post("/delete_subcategory", async (req, res) => {
        const { subcategoryid, oldIcon } = req.body;
        console.log("Sub Category Id and Icon: ", JSON.stringify(req.body));

        try {
                const subcategory = await SubCategory.findById(subcategoryid);
                if (!subcategory) {
                        return res
                                .status(404)
                                .json({ status: false, message: "Sub-Category is not found" });
                }

                const previousIcon = oldIcon || SubCategory.icon;

                await SubCategory.deleteOne({ _id: subcategoryid });

                if (previousIcon) {
                        const imagePath = `${filepath}/${previousIcon}`;
                        try {
                                fs.unlinkSync(imagePath);
                                console.log("Previous image deleted successfully");
                        } catch (err) {
                                console.error("Error deleting previous image: ", err);
                        }
                }
                res
                        .status(200)
                        .json({ status: true, message: "Sub-Category deleted Successfully" });
        } catch (error) {
                console.log(error);
                res.status(500).json({ status: false, message: "Server Error..." });
        }
});

// Api to Edit Category Icon

router.post("/edit_picture", upload.single("icon"), async (req, res) => {
        const { subCategoryid } = req.body;
        const newIcon = req.file.filename;

        try {
                const subCategory = await SubCategory.findOne({ _id: subCategoryid });

                if (!subCategory) {
                        return res
                                .status(404)
                                .json({ status: false, message: "Sub-Category Not Found" });
                }

                const previousIcon = subCategory.icon;

                await SubCategory.updateOne(
                        { _id: subCategoryid },
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

                res
                        .status(200)
                        .json({
                                status: true,
                                message: "Sub-Category Icon Updated Successfully",
                        });
        } catch (error) {
                console.log("Error", error);
                res.status(500).json({ status: false, message: "Server Error..." });
        }
});

module.exports = router;
