const Router=require("express").Router();
const {AsyncHandler}=require("../../utils/Handlers");
const { getSkillSubTitle, CreateSkillSubTitle, updateSkillSubTitle, deletSkillSubTitle, getAllSkillSubTitle, populateAllSkillSubTItle } = require("../controllers/SkillSubTitleController");
const verifyUser = require("../middleware/isLoggedin");
const upload = require("../middleware/multer");

Router.route("/add").post(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(CreateSkillSubTitle))

Router.route("/:id").put(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(updateSkillSubTitle))

Router.route("/:id/:titleId").delete(AsyncHandler(verifyUser),AsyncHandler(deletSkillSubTitle))


Router.route("/:id").get(AsyncHandler(verifyUser),AsyncHandler(getSkillSubTitle));

Router.route("/").get(AsyncHandler(verifyUser),AsyncHandler(getAllSkillSubTitle));

Router.route("/get/all").get(AsyncHandler(populateAllSkillSubTItle));

module.exports=Router;