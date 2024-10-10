const { AsyncHandler } = require("../../utils/Handlers");
const { addLike, removeLike } = require("../controllers/likeController");
const verifyUser = require("../middleware/isLoggedin");

const Router=require("express").Router();

Router.route("/").post(AsyncHandler(verifyUser),AsyncHandler(addLike));

Router.route("/").delete(AsyncHandler(verifyUser),AsyncHandler(removeLike));
module.exports=Router;