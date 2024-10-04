const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
require("dotenv").config();
const UserSchema=new mongoose.Schema({
    admin:{
        type:Boolean,
        default:false
    },
    fullName:{
        type:String,
        required:[true,"name field required"],
        trim:true,
        validate:{
            validator:(v)=>/^[a-zA-z\s'`]+$/.test(v),
            message:props=>`${props.value} is not a valid string for fullName`
        }
    },
    email:{
        type:String,
        required:[true,"email field required"],
        unique:[true,"email already exists"],
        lowercase:true,
        trim:true,
        validate:{
            validator:(v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message:props=>`${props.value} is not a valid email`
        }
    },
    journey:[
        {
        name:String,
        skills:[],
        completed:{type:Number,default:0}
    }
    ],
    mobileNo:{
        type:String,
        required:[true,"mobile number field required"],
        unique:[true,"mobile Number already exists"],
        maxlength:[10,"mobile number should not be greater than 10"],
        minlength:[10,"mobile number should not be greater than 10"],
        trim:true,
        validate:{
            validator:function(v){
                return /^\d{10}$/.test(v)
            },
            message:props=>`${props.value} is an invlid mobile number`
        }
    },
    password:{
        type:String,
        required:[true,"password field required"],
        validate:{
            validator:(v)=>/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)},
            message:props=>`${props.value} password validation failed`
    },
    avtar:{
        type:String
    },
    articles:{
        type:[
            {
                _id:{
                type:mongoose.Schema.ObjectId,
                ref:"Article"
                },
                name:String,
                post:String
            }
        ]
    },
    challenges:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Challenge"
            }
        ]
    },
    followers:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    following:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    },
    refreshToken:String
    
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

UserSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        fullName:this.fullName
    },
    process.env.JWT_SECRET,
    {
        expiresIn: 86400
    }
    );
}

UserSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },process.env.JWT_SECRET,
    {
        expiresIn:"30d"
    }
);
}
module.exports=mongoose.model("User",UserSchema);