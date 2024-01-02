const express = require("express");
const router = express.Router();
const upload = require("./multer");
const Banner = require("../Schema/bannerSchema");
let fs = require('fs');
let dotenv = require("dotenv");

dotenv.config();
const filepath = process.env.FILEPATH;

// Api to submit or post the data
router.post("/submit_banner", upload.single("icon"), async (req, res) => {

        try {
                const { bannername } = req.body;
                const icon = req.file.filename;
                const banner = new Banner({ bannername, icon });
                await banner.save();

                console.log(JSON.stringify(banner));
                res
                        .status(200)
                        .json({ status: true, message: "Banner saved successfully" });
        } catch (err) {
                console.log("Error:", err);
                res.status(500).json({ status: false, message: "Server error" });
        }
});

// Api to fetch all the data
router.get("/display_all_banners", async (req, res) => {
        try {
                const banners = await Banner.find({});
                console.log(JSON.stringify(banners));

                res
                        .status(200)
                        .json({
                                status: true,
                                data: banners,
                                message: "Banner fetched successfully",
                        });
        } catch (err) {
                console.log("Error:", err);
                res.status(500).json({ status: false, data: [], message: "Server error" });
        }
});

// Api to Delete banner
router.post("/delete_banner", async (req, res) => {
        const { bannerid, oldIcon } = req.body;

        try {
                const banner = await Banner.findById(bannerid);

                if (!banner) {
                        return res.status(400).json({ status: false, message: "Category is not found" });
                };
                const previousIcon = oldIcon || Banner.icon;

                await Banner.deleteOne({ _id: bannerid });

                if (previousIcon) {
                        const imagePath = `${filepath}/${previousIcon}`;
                        try {
                                fs.unlinkSync(imagePath);
                                console.error("Error deleting previous image: ", err);
                        }
                        catch (err) {
                                console.log("Previous image deleted successfully");
                        }

                }
                res.status(200).json({ status: true, message: "Banner deleted Successfully" })
        } catch (error) {
                console.log(error);
                res.status(500).json({ status: false, message: "Server Error..." })
        }
});

// Api to Edit Category Icon
router.post("/edit_picture", upload.single("icon"), async (req, res) => {
        const { bannerid } = req.body;
        const newIcon = req.file.filename;

        try {
                const banner = await Banner.findById(bannerid);

                if (!banner) {
                        return res.status(404).json({ status: false, message: "Banner is not found" });
                };

                const previousIcon = Banner.icon;
                await Banner.updateOne(
                        { _id: bannerid },
                        { $set: { icon: newIcon } }
                );

                if (previousIcon && previousIcon !== newIcon) {
                        const imagePath = `${filepath}/${previousIcon}`;
                        try {
                                fs.unlinkSync(imagePath);
                                console.error("Error deleting previous image: ", err);
                        }
                        catch (err) {
                                console.log("Previous image deleted successfully");
                        }
                }

                res.status(200).json({ status: true, message: "Banner Icon Updated Successfully" })
        } catch (error) {
                console.log("Error", error);
                res.status(500).json({ status: false, message: "Server Error..." })
        }
});

module.exports = router;
