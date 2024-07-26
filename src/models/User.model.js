const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name field required"]
    },
    email:{
        type:String,
        required:[true,"email field required"],
        unique:[true,"email already exists"]
    },
    password:{
        type:String,
        required:[true,"password field required"],
    },
    
},{timestamps:true});
module.exports=mongoose.model("User",UserSchema);