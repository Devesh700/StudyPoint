const Log=require("../models/LogModel");
const {AsyncHandler,APIError,APIResponse}=require("../../utils/Handlers")


// GET LOGS

const getLogs=AsyncHandler(async function(req,res,next){
    if(!req.user && !req.user._id)
        throw APIError(400,"unauthorized access","you are not authorized to access this data");

    const logs=await Log.find();
    if(!logs)
        throw APIError(400,"databse error","unable to fetch logs try again");
    res.status(200,logs,"fetched logs successfully");
})


// CREATE LOGS

const createLogs=AsyncHandler(async function(req,res,next){
  const logEntry = Log.create({
    method: req.method,
    url: req.url,
    ip: req.ip,
    status: res.statusCode,
    responseTime: res.responseTime,
    pid:process.pid
  });

//   logEntry.save((err) => {
//     if (err) {
//       console.error('Error saving log to MongoDB:', err);
//     }
//   });

  next();
});

module.exports={getLogs,createLogs};