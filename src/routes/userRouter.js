const Router=require("express").Router();
const {registerUser,logInUser, logOut, updateUser, changePassword, getUserById}=require("../controllers/userController");
const {AsyncHandler}=require("../../utils/Handlers");
const upload=require("../middleware/multer");
const verifyUser = require("../middleware/isLoggedin");
const { logInValidator, registerValidator } = require("../../utils/Validators");
Router.route("/register").post(
    upload.fields(
   [{name:"avtar",maxCount:1},
    {name:"coverImage",maxCount:1}]),
    registerValidator,
    AsyncHandler(registerUser))

Router.route("/login").post(logInValidator,AsyncHandler(logInUser));

Router.route("/logout").post(AsyncHandler(verifyUser),AsyncHandler(logOut));

Router.route("/updateuser").put(AsyncHandler(verifyUser),AsyncHandler(updateUser))

Router.route("/changepassword").patch(AsyncHandler(verifyUser),AsyncHandler(changePassword))

Router.route("/:_id").get(AsyncHandler(verifyUser),AsyncHandler(getUserById))


module.exports=Router;