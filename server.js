const express=require("express");
const cookieParser=require("cookie-parser")
const cors=require("cors")
const Db=require("./src/config/DB");
const userRouter=require("./src/routes/userRouter")
const articleRouter=require("./src/routes/articleRouter")
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:"*",
    credentials:true
}));

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

Db();

app.use("/api/v1/article",articleRouter)
app.use("/api/v1/users",userRouter)

app.listen(PORT,()=>console.log(`server is running on PORT: ${PORT}`));