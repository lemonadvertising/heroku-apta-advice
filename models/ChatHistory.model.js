var mongose = require('mongoose');
var Schema = mongose.Schema;
var ChatHistoryScheme = new Schema({
    fbid: { type: String, index: true },
    from: { type: String, "default": "" },
    fromname: { type: String, "default": "" },
    msgType: { type: String, "default": "" },
    msg: { type: String, "default": "" },
    created_at: { type: Date, default: Date.now }
});
module.exports = mongose.model("ChatHistory", ChatHistoryScheme);