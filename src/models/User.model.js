const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"name field required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email field required"],
        unique:[true,"email already exists"],
        lowercase:true,
        trime:true
    },
    password:{
        type:String,
        required:[true,"password field required"],
    },
    articles:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"Artcile"
            }
        ]
    },
    
},{timestamps:true});

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        return next();
    }
    next();
})

UserSchema.methods.isPasswordCorrect=async function(password){
    return bcrypt.compare(password,this.password);
}

UserSchema.method.generateAccessToken=function(){
    return jwt.verify({
        _id:this._id,
        email:this.email,
        fullName:this.fullName
    },
    "i_m_scrt",
    {
        expiresIn:"10D"
    }
    );
}

UserSchema.method.generateRefreshToken=function(){
    return jwt.verify({
        _id:this._id,
    },"i_m_scrt",
    {
        expiresIn:"10D"
    }
);
}
module.exports=mongoose.model("User",UserSchema);