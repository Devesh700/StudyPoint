const mongoose=require("mongoose")
const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  method: String,
  url: String,
  ip: String,
  pid:String,
  status: String,
  responseTime: Number,
}, { capped: { size: 1024 * 1024 * 10, max: 10000} }); // Example of a capped collection
logSchema.index({timestamp:1},{expires:7*24*60*60})
const Log = mongoose.model('Log', logSchema);
module.exports=Log;