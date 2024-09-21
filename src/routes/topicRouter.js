const Router=require("express").Router();
const {AsyncHandler}=require("../../utils/Handlers");
const { getTopic, CreateTopic, updateTopic, deleteTopic, getAllTopic, populateAllTopic } = require("../controllers/TopicController");
const verifyUser = require("../middleware/isLoggedin");
const upload = require("../middleware/multer");

Router.route("/add").post(AsyncHandler(verifyUser),upload.single("file"),AsyncHandler(CreateTopic))

Router.route("/:id").put(AsyncHandler(verifyUser),upload.single("file"),AsyncHandler(updateTopic))

Router.route("/:id/:subTitleId").delete(AsyncHandler(verifyUser),AsyncHandler(deleteTopic))


Router.route("/:id").get(AsyncHandler(getTopic));

Router.route("/").get(AsyncHandler(verifyUser),AsyncHandler(getAllTopic));

Router.route("/get/all").get(AsyncHandler(populateAllTopic));

module.exports=Router;