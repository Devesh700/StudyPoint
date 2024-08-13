const Router=require("express").Router();
const {AsyncHandler}=require("../../utils/Handlers");
const { getArticleById, postArticle, editArticle, deleteArticle, getAllArticle, populateAllArticle } = require("../controllers/articleController");
const verifyUser = require("../middleware/isLoggedin");
const upload = require("../middleware/multer");

Router.route("/addarticle").post(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(postArticle))

Router.route("/:_id").put(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(editArticle))

Router.route("/:_id").delete(AsyncHandler(verifyUser),AsyncHandler(deleteArticle))


Router.route("/:_id").get(AsyncHandler(verifyUser),AsyncHandler(getArticleById));

Router.route("/").get(AsyncHandler(verifyUser),AsyncHandler(getAllArticle));

Router.route("/get/all").get(AsyncHandler(populateAllArticle));

module.exports=Router;