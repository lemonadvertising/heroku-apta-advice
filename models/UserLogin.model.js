const mongose = require('mongoose');
const Schema = mongose.Schema;
const UserLoginScheme = new Schema({
    user_id: { type: String, String: true, unique: true },
    email: { type: String, String: true, unique: true },
    name:{ type : String , "default" : "" },
    password:{ type : String , "default" : "" },
    userType: { type: String, "default": "representative" },
    created_on : { type: Date, default: Date.now },
    status:{type : Number , "default" : 1}
});
module.exports = mongose.model("UserLogin",UserLoginScheme);