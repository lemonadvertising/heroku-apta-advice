var mongose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongose.Schema;
var ArticleScheme = new Schema({
    article_for:{ type : String , "default" : "" },
    article_frequency:{ type : String , "default" : "" },
    article_type: { type : String , "default" : "" },
    article_title:{ type : String , "default" : "" },
    article_lang:{ type : String , "default" : "" },
    img_url: { type : String , "default" : "" },
    article_url: { type : String , "default" : "" },
    createdDate : { type: Date, default: Date.now },
    article_order:{type : Number , "default" : 0},
    old_week:{type : Number , "default" : 0},
    article_status:{type : Number , "default" : 1},
    user_id:{type : String , "default" : ""},
    deleted_by:{type : String , "default" : ""}
});
ArticleScheme.plugin(mongoosePaginate);
module.exports = mongose.model("Article",ArticleScheme);