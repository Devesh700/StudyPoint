const multer=require("multer");
const uploadToCloudinary=require("../../utils/Cloudinary")

const diskStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets/images");
    },
    filename:function(req,file,cb){
        const suffixName=Date.now()+"-"+Math.round(Math.random()*1E9);
        cb(null, file.fieldname+"_"+suffixName+".avif");
    }
})
const upload=multer({storage:diskStorage});
module.exports=upload