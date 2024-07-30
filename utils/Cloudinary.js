const cloudinary=require("cloudinary").v2;
require("dotenv").config();
const fs=require("fs")


    cloudinary.config({ 
        cloud_name: 'dzeoruero', 
        api_key: '644928563885694', 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    function uploadToCloudinary(localFilePath){
        if(!localFilePath){ return null};
        try{
            cloudinary.uploader.upload(localFilePath,{
                public_id:"profile_image",
                resource_type:auto
            });
            fs.unlinkSync(localFilePath);
        }catch(err){
            fs.unlinkSync(localFilePath);
            console.log(err);
        }
    }
    module.exports=uploadToCloudinary;