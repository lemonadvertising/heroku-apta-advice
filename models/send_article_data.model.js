var mongose = require('mongoose');
var Schema = mongose.Schema;
var UserScheme = new Schema({
    fbid: {type: Number},
    pregnancy_type:{ type : String , "default" : "" },
    subscription:{ type : String , "default" : "" },
    obj:{type:Object},
    status:{type : Number , "default" : 0},
    created_at : { type: Date, default: Date.now },
});
    module.exports = mongose.model("send_article_data",UserScheme);