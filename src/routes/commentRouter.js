const Router=require("express").Router();
const {AsyncHandler}=require("../../utils/Handlers");
const {addComment,editComment,deleteComment,getAllComment} = require("../controllers/commentController");
const verifyUser = require("../middleware/isLoggedin");
const upload = require("../middleware/multer");

Router.route("/addcomment").post(AsyncHandler(verifyUser),AsyncHandler(addComment))

Router.route("/:_id")
.put(AsyncHandler(verifyUser),AsyncHandler(editComment))
.delete(AsyncHandler(verifyUser),AsyncHandler(deleteComment))

// Router.route("/:_id").get(AsyncHandler(verifyUser),AsyncHandler(getCommentById));

Router.route("/").get(AsyncHandler(verifyUser),AsyncHandler(getAllComment));

module.exports=Router;