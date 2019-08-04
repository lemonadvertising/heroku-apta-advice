const uniqid = require('uniqid');
const sanitize = require('mongo-sanitize');
const GlobalData = require('./GlobalData');

const UserChat = require('../models/UserChat.model');
const ChatHistory = require('../models/ChatHistory.model');
const UserFb = require('../models/UserFb.model');
var SendUpdate = require('../models/send_update.model');

var io = null;
module.exports = {
    "io": "1",
    "onConnection": (socket) => {
        socket.on('new-message-WbINSag0HY', (data) => {
            if (data.hasOwnProperty("userType") && (data.userType == "representative" || data.userType == "admin")) {
                if (data.hasOwnProperty("fbid") && data.hasOwnProperty("from") && data.hasOwnProperty("msgType") && data.hasOwnProperty("msg")) {
                    io.emit('new-message-WbINSag0HY', data);
                     var newChatMsg = ChatHistory();
                     newChatMsg.fbid = data.fbid;
                     newChatMsg.from = data.rid;
                     newChatMsg.fromname = data.from;

                    if (data.msgType == "new thread") {
                        UserChat.findOne({"fbid": data.fbid}, 
                        (err, user) => {
                            if (!err) {
                                if (user == null) {
                                    var newUser = UserChat();
                                    newUser.fbid = data.fbid;
                                    newUser.userName = data.from;
                                    newUser.status = 1;
                                    newUser.save((err, user) => {});
                                } else {
                                    UserChat.findOneAndUpdate(
                                        {fbid: data.fbid},
                                        {$set: {"started_at": new Date()},$inc: {chatCount: 1}},
                                        {upsert: false},
                                        (err, user) => {}
                                    );
                                }
                            }
                        });
                        newChatMsg.msgType = "new_thread";
                        newChatMsg.msg = "";
                    }
                    else if (data.msgType == "thread end") {
                        io.emit('new-message-WbINSag0HY', data);
                        newChatMsg.msgType = "thread_end";
                        newChatMsg.msg = data.msg;

                        UserChat.findOneAndUpdate({fbid: data.fbid}, 
                            {$set: {"status": 0,"ended_at": new Date()}}, 
                            {upsert: false},
                            (err, user) => {}
                        );
                        let messageObj = {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "button",
                                    "text": "Thanks for chatting with us.\nWhat do you want to know about?",
                                    "buttons": [{
                                            "type": "postback",
                                            "title": "Pregnancy",
                                            "payload": "pregnancy"
                                        },
                                        {
                                            "type": "web_url",
                                            "title": "Motherhood",
                                            "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+data.fbid,
                                            "webview_height_ratio": "full"
                                        },
                                        {
                                            "type": "postback",
                                            "title": "Contact Careline",
                                            "payload": "talkHuman"
                                        }
                                    ]
                                }
                            }
                        };
                        GlobalData.sendGenericMessageFb(data.fbid, messageObj);
                        UserFb.findOneAndUpdate(
                            {fbid: data.fbid}, 
                            { $set: { "lastAction": "welcomeMessage","offBot":0}},
                            {upsert: false},
                            function (err, usser) {}
                        );
                    }
                    else if (data.msgType == "text") {
                        GlobalData.sendTextMessageFB(data.fbid, data.msg);
                        newChatMsg.msgType = data.msgType;
                        newChatMsg.msg = data.msg;
                        SendUpdate.findOneAndUpdate(
                            {fbid:data.fbid,status:1,msg_type:"tth"},
                            {$set: {"status":0}},
                            {upsert:false},
                            function(err,update){});
                    }
                    newChatMsg.save((err, chat) => {});
                }
            }
        });
    },
    "sendMessage": (data) => {
        console.log(data);
        if (data.hasOwnProperty("fbid") && data.hasOwnProperty("from") && data.hasOwnProperty("msgType") && data.hasOwnProperty("msg")) {
            data.userType = "user";
            if (data.msgType == "new thread"){
                io.emit('new-message-WbINSag0HY', data);
                UserChat.findOne({ "fbid": data.fbid}, (err, user) => {
                    if (!err){
                        if (user == null){
                            var newUser = UserChat();
                            newUser.fbid = data.fbid;
                            newUser.userName = data.from;
                            newUser.status = 1;
                            newUser.save((err, user) => {
                            });
                        }
                        else{
                            UserChat.findOneAndUpdate(
                                { fbid: data.fbid},
                                { $set: { "started_at": new Date(),"status": 1 }, $inc: { chatCount:1} },
                                { upsert: false },
                                (err, user) => {});
                        }
                        var newChatMsg = ChatHistory();
                        newChatMsg.fbid = data.fbid;
                        newChatMsg.from = data.fbid;;
                        newChatMsg.fromname = data.from;
                        newChatMsg.msgType = "new_thread";
                        newChatMsg.msg = "";
                        newChatMsg.save((err, chat) => {
                        });
                    }
                });
            }
            else if (data.msgType == "thread end") {
                io.emit('new-message-WbINSag0HY', data);
                var newChatMsg = ChatHistory();
                newChatMsg.fbid = data.fbid;
                newChatMsg.from = data.fbid;
                newChatMsg.fromname = data.from;
                newChatMsg.msgType = "thread_end";
                newChatMsg.msg = data.msg;
                newChatMsg.save((err, chat) => {});
                
                UserChat.findOneAndUpdate({fbid: data.fbid},
                    {$set: {"status": 0,"ended_at": new Date()}},
                    {upsert: false},
                    (err, user) => {}
                );
                let messageObj = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "Thanks for chatting with us.\nWhat you want to know about?",
                            "buttons": [{
                                    "type": "postback",
                                    "title": "Pregnancy",
                                    "payload": "pregnancy"
                                },
                                {
                                    "type": "web_url",
                                    "title": "Motherhood",
                                    "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+data.fbid,
                                    "webview_height_ratio": "full"
                                },
                                {
                                    "type": "postback",
                                    "title": "Contact Careline",
                                    "payload": "langAr"
                                }
                            ]
                        }
                    }
                };
                GlobalData.sendGenericMessageFb(data.fbid, messageObj);
                UserFb.findOneAndUpdate(
                    {fbid: data.fbid},
                    { $set: { "lastAction": "welcomeMessage","offBot":0}},
                    {upsert: false},
                    function (err, usser) {}
                );
            }
            else if (data.msgType == "text") {
                io.emit('new-message-WbINSag0HY', data);
                var newChatMsg = ChatHistory();
                newChatMsg.fbid = data.fbid;
                newChatMsg.from = data.fbid;
                newChatMsg.fromname = data.from;
                newChatMsg.msgType = "text";
                newChatMsg.msg = data.msg;
                newChatMsg.save((err, chat) => {
                });
            }
            return true;
        }
        return false;
    },
    "sendMessageWeb": (socket,data) => { 
        socket.emit('new message', data);
        return true;
    },
    "setIo": (obj) => {
        io=obj;
    },
    "getIo": () => {
        return io;

    }
};