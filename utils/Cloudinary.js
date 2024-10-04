const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

cloudinary.config({ 
    cloud_name: 'dzeoruero', 
    api_key: '644928563885694', 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localFilePath) {
    if (!localFilePath) {
        return null;
    }

    //console.log(localFilePath);

    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            public_id: "axcdef12984er",
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath); // Remove the file after uploading
        return result; // Return the upload result
    } catch (err) {
        fs.unlinkSync(localFilePath); // Ensure the file is removed even if there's an error
        console.error("Error uploading to Cloudinary:", err); // Improved error logging
        throw err; // Re-throw the error to be handled by the caller
    }
}

module.exports = uploadToCloudinary;
