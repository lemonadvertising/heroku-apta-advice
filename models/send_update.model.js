var mongose = require('mongoose');
var Schema = mongose.Schema;
var UserScheme = new Schema({
    fbid: {type: Number},
    msg_type:{ type : String , "default" : "" },
    fuction_name:{ type : String , "default" : "" },
    msg_obj: { type : Schema.Types.Mixed },
    send_time:{type : Date},
    status:{type : Number , "default" : 1},
    created_at : { type: Date, default: Date.now },
});
    module.exports = mongose.model("send_update",UserScheme);