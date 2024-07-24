const express=require("express");
const Db=require("./config/DB");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
Db();

app.listen(PORT,()=>console.log(`server is running on PORT: ${PORT}`));