const express=require("express");
const cookieParser=require("cookie-parser")
const cors=require("cors")
const Db=require("./src/config/DB");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 4000;
app.use(express.json());
app.use(cors({
    origin:"",
    credentials:true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:true}));
Db();

app.listen(PORT,()=>console.log(`server is running on PORT: ${PORT}`));