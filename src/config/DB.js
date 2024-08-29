const mongoose=require("mongoose");
require("dotenv").config();
const Db=async()=>{
try{
    let connectionInstance=await mongoose.connect(process.env.MONGO_URI);
    // console.log(connectionInstance)
    console.log(`mongodb connection successfull at host !! ${connectionInstance}`)
}catch(err){
    console.log("error connecting the mongodb server"+err);
    process.exit(1);
}
}

module.exports=Db;