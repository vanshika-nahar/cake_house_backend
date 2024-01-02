const express = require("express");
const router = express.Router();
const Occasion = require("../Schema/occasionSchema");
const upload = require("./multer");
let fs = require('fs');
let dotenv = require("dotenv");

dotenv.config();
const filepath = process.env.FILEPATH;

// Api to submit occasion
router.post("/submit_occasion", upload.single("icon"), async (req, res) => {
        try {
            const { occasionname } = req.body;
            const icon = req.file.filename;
    
            const occasion = new Occasion({ occasionname, icon });
            await occasion.save();
    
            console.log(JSON.stringify(occasion)); 
    
            res.status(200).json({ status: true, message: "Occasion submitted successfully" });
        } catch (error) {
            console.error("Error submitting occasion:", error.message); 
            res.status(500).json({ status: false, message: "Server error..." });
        }
    });

// Api to display all the occasion
router.get("/display_all_occasion", async (req, res) => {
        try {
            const occasion = await Occasion.find();
            for(let i = 0;i<occasion.length;i++){
                console.log(JSON.stringify(occasion[i]))
        }
            res.status(200).json({
                status: true,
                data: occasion,
                message: "Occasion Fetched Successfully",
            });
        } catch (error) {
            console.error("Error fetching occasion:", error.message); 
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    
// Api to edit occasion
router.post("/edit_occasion", async (req, res) => {
        const { occasionId, occasionname } = req.body;
        console.log(req.body);
        try {
            await Occasion.updateOne({ _id: occasionId }, { $set: { occasionname } });
            res.status(200).json({ status: true, message: "Occasion Updated Successfully" });
        } catch (error) {
            console.error("Error", error);
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    

// Api to Delete Occasion
router.post("/delete_Occasion", async (req, res) => {
        const { occasionid, oldIcon } = req.body;
        console.log("Occasion Id and Icon: ", JSON.stringify(req.body));
    
        try {
            const occasion = await Occasion.findById(occasionid);
    
            if (!occasion) {
                return res.status(404).json({ status: false, message: "Occasion is not found" });
            }
    
            const previousIcon = oldIcon || occasion.icon; 
    
            await Occasion.deleteOne({ _id: occasionid });
    
            if (previousIcon) {
                const imagePath = `${filepath}/${previousIcon}`;
                try {
                    fs.unlinkSync(imagePath);
                    console.log("Previous image deleted successfully");
                } catch (err) {
                    console.error("Error deleting previous image: ", err);
                }
            }
    
            return res.status(200).json({ status: true, message: "Occasion deleted Successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, message: "Server Error..." });
        }
    });
    

// Api to Edit Occasion Icon
router.post("/edit_picture", upload.single("icon"), async (req, res) => {
        const { occasionid } = req.body;
        const newIcon = req.file.filename;
    
        try {
            const occasion = await Occasion.findById({ _id: occasionid });
    
            if (!occasion) {
                return res.status(404).json({ status: false, message: "Occasion is not found" });
            }
    
            const previousIcon = occasion.icon;
    
            await Occasion.updateOne(
                { _id: occasionid },
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
    
            res.status(200).json({ status: true, message: "Occasion Icon Updated Successfully" });
        } catch (error) {
            console.error("Error updating occasion icon:", error);
            res.status(500).json({ status: false, message: "Server Error..." });
        }
    });    
    
module.exports = router;
