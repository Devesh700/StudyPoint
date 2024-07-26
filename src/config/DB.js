const mongoose=require("mongoose");
require("dotenv").config();
const Db=async()=>{
try{
    await mongoose.connect(process.env.MONGO_URI,{
});
    console.log(`mongodb connection successfull at ${process.env.MONGO_URI}`)
}catch(err){
    console.log("error connecting the mongodb server"+err);
    process.exit(1);
}
}

module.exports=Db;