const Router=require("express").Router();
const {AsyncHandler}=require("../../utils/Handlers");
const { getSkillTitle, CreateSkillTitle, updateSkillTitle, deletSkillTitle, getAllSkillTitle, populateAllSkillTItle } = require("../controllers/SkillTitleController");
const verifyUser = require("../middleware/isLoggedin");
const upload = require("../middleware/multer");

Router.route("/add").post(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(CreateSkillTitle))

Router.route("/:id").put(AsyncHandler(verifyUser),upload.single("post"),AsyncHandler(updateSkillTitle))

Router.route("/:id").delete(AsyncHandler(verifyUser),AsyncHandler(deletSkillTitle))


Router.route("/:id").get(AsyncHandler(verifyUser),AsyncHandler(getSkillTitle));

Router.route("/").get(AsyncHandler(verifyUser),AsyncHandler(getAllSkillTitle));

Router.route("/get/all").get(AsyncHandler(populateAllSkillTItle));

module.exports=Router;