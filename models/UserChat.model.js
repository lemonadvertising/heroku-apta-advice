var mongose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongose.Schema;
var UserChatScheme = new Schema({
    fbid: {type: Number, index: true, unique: true},
    chatCount: { type: Number, "default": 1 },
    userName: { type: String, "default": "" },
    started_at: { type: Date, default: Date.now },
    ended_at: { type: Date},
    status: { type: Number, "default": 1 }
});
UserChatScheme.plugin(mongoosePaginate);
module.exports = mongose.model("UserChat", UserChatScheme);