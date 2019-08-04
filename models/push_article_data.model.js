var mongose = require('mongoose');
var Schema = mongose.Schema;
var UserScheme = new Schema({
    fbid: {type: Number},
    pregnancy_type:{ type : String , "default" : "" },
    frequency:{ type : String , "default" : "" },
    obj:{type:Object},
    created_at : { type: Date, default: Date.now },
});
    module.exports = mongose.model("push_article_data",UserScheme);