var mongose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongose.Schema;
var email_data_Scheme = new Schema({
    fbid: {type: Number},
    topic:{ type : String , "default" : "" },
    email:{ type : String , "default" : "" },
    name: { type : String , "default" : "" },
    lname:{ type : String , "default" : "" },
    message:{ type : String , "default" : "" }
});
email_data_Scheme.plugin(mongoosePaginate);
module.exports = mongose.model("email_data",email_data_Scheme);