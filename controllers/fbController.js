const bodyParser = require('body-parser'),
      express = require('express'),
      request = require('request'),
      lowerCase = require('lower-case');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const sanitize = require('mongo-sanitize');
//const sgMail = require("sendgrid")("socialalivenow10");
const sgMail = require('@sendgrid/mail');
var app = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(fileUpload({
    limits: { fileSize: 1048576 },
}));

var mongoose = require('mongoose');
var User = require('../models/UserFb.model');
var SendUpdate = require('../models/send_update.model');
var SendArticlData = require('../models/send_article_data.model');
var PushArticlData = require('../models/push_article_data.model');
var Article = require('../models/Article.model');
var email_data = require('../models/email_data.model');
const TalkToAHumanController = require('./TalkToAHumanController');
const GlobalData = require('./GlobalData');
const carousel_data = require('./carousel_data');
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();

var errorMsg = ["Oops! That doesn't seem like a valid input! Would you like to try again?","I am sorry I don't seem to understand that! Would you like to try again?","I think you meant to type something else :) Try again, maybe?","Oops! That doesn’t sound right. Let's give that another shot, shall we?"];

var delay = 3000;
app.use(express.static("files"));

var ptype="";

var send_data_array = [];
var send_article_array = [/*{`
			fbid:2023662901055200,
            type:'notification',
			obj: [
				{
				"title": 'test',
				"image_url": 'https://danone-apta-advice.herokuapp.com/fb/Baby-development.jpg',
				"buttons": [
					{
					"title": 'test',
					"type": "web_url",
					"url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+2023662901055200+"&url="+'https://www.apta-advice.com/breastfeeding/'+"&p_type=notification",
					"webview_height_ratio": "full"
					}
				]
				}
			]
		}*/];
/*var years = moment().diff('1981-01-01', 'years',true).toFixed(1);
console.log(years);*/
var send_data_flag = true;
var send_article_flag = true;
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

app.get('/pushNotification',  GlobalData.ensureAuthenticated, (req, res) => {
    var data = { flashType: "", flashMsg: "", name: "", email: "", password: "" };
    res.render('fb_pushNotification', data);
});

app.post('/pushNotification',  GlobalData.ensureAuthenticated, (req, res) => {
    let data = {
        flashType: "",
        flashMsg: ""
    };
    let language = sanitize(req.body.language.trim());
    let subscriptionType = sanitize(req.body["subscription-type"].trim());
    let subscriptionTime = sanitize(req.body["subscription-time"].trim());
    let title = sanitize(req.body.title.trim());
    var url = req.body.url.trim();

    let thumbnailImg = req.files.thumbnail;
    let pic_url = 'thumbnail/' + Date.now() + '_' + thumbnailImg.name.replace(/\s/g,'');
    console.log("pushNotification post");

    thumbnailImg.mv('public/' + pic_url, function(err) {
        if (!err){
            console.log("pushNotification mv");
            var options = {
                url: 'https://www.alivenow.in/chatbots/aptaAdvice/pullImage.php',
                form: {
                    path:'https://danone-apta-advice.herokuapp.com/' + pic_url,
                }
            }
            request.post(options, function(error, response, body) {
                if(!error){
                    console.log("pushNotification post");
                    var b = JSON.parse(body);
                    if(b.url != ''){
                        //find
                        let cond = {"subonoff":1};
                        //language, subscriptionType, subscriptionTime
                        if(language != "All" || subscriptionType != "All" || subscriptionTime != "All"){
                            if(language != "All"){
                                cond.lang = language;
                            }

                            if(subscriptionType == "Pre-Pregnancy"){
                                cond["final_pregnancy_type"] = subscriptionType;
                            }
                            else if(subscriptionType == "Pregnancy"){
                                cond.final_pregnancy_type = subscriptionType;
                                if(subscriptionTime != "All"){
                                    cond.final_article_frequency = subscriptionTime;
                                }

                            }
                            else if(subscriptionType == "Motherhood"){
                                cond.final_pregnancy_type = subscriptionType;

                            }

                        }
                        console.log(cond);
                        User.find(cond).exec(function(err,users){
                            if(!err){
                                console.log(users);
                                for(let i = 0; i<users.length;i++){
                                    var udob = moment(users[i].dob);
                                    var month = moment().diff(udob, 'months');
                                    if(subscriptionType == "Motherhood"){
                                        if(subscriptionTime == "month0_3"){
                                            if(!(month<=3)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "month4_6"){
                                            if(!(month<=6 && month>=4)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "month7_9"){
                                            if(!(month<=9 && month>=7)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "month10_12"){
                                            if(!(month<12 && month>=10)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "oneYr"){
                                            if(!(month<24 && month>=12)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "twoYr"){
                                            if(!(month<36 && month>=24)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "threeYr"){
                                            if(!(month<48 && month>=36)){
                                                continue;
                                            }
                                        }
                                        else if(subscriptionTime == "pre_school"){
                                            if(!(month>48)){
                                                continue;
                                            }
                                        }
                                    }
                                    
                                    let push_obj ={
                                        fbid:users[i].fbid,
                                        type:'notification',
                                        obj: [
                                            {
                                            "title": title,
                                            "image_url": b.url,
                                            "buttons": [
                                                {
                                                "title": 'Read More',
                                                "type": "web_url",
                                                "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+users[i].fbid+"&url="+url+"&type=notification",
                                                "webview_height_ratio": "full"
                                                }
                                            ]
                                            }
                                        ]
                                    };
                                    send_article_array.push(push_obj);
                                    console.log(push_obj);
                                    
                                }
                                console.log("pushNotification end");
                                data.flashType = "success";
                                data.flashMsg = "Notification sent.";
                                res.render('fb_pushNotification', data);
                            }
                            else{
                                //if err
                                res.render('fb_pushNotification', data);
                            }

                        });
                    }
                    else{
                        //b.url == ''
                        res.render('fb_pushNotification', data);
                    }
                    
                }
                else{
                    //if error
                    res.render('fb_pushNotification', data);
                }
            });
        }
    });
});

setInterval(function () {
    if(send_data_array.length==0){
        SendUpdate.find({status:1,send_time:{ $lte: new Date() }}).exec(function(err,users){
            if(!err){
                //res.status(200).send(JSON.stringify(users));
                for(var i =0;i<users.length;i++){

                    send_data_array.push(users[i]);
                }
                //console.log(send_data_array);

            }
        });
    }
    
    
    if(send_article_array.length==0){
        SendArticlData.find({status:0}).exec(function(err,users){
            if(!err){
                //res.status(200).send(JSON.stringify(users));
                for(var i =0;i<users.length;i++){

                    send_article_array.push(users[i]);
                }
                //console.log(send_data_array);

            }
        });
    }
    
}, 120);

//uncomment to start sending article weekly and monthly
//################################################################################################
rule.hour = 12;
rule.minute = 00;
var job_week1 = schedule.scheduleJob(rule, function(){
    var todaysDate = new Date();
        User.find({"subscription":{ $ne: "" },"final_pregnancy_type":{ $ne: "" },"subonoff":1}).exec(function(err,users){
            if(!err){
                addUsers(users);
            }
        });
});

var oobj={
    "_id": {
        "$oid": "5bf5427c5966950004ebda28"
    },
    "first_name": "Rakesh",
    "last_name": "Wadbudhe",
    "lastAction": "sent_courosel",
    "lastPayload": "",
    "offBot": 0,
    "lang": "En",
    "pregnancy_type": "Pregnancy",
    "final_pregnancy_type": "Motherhood",
    "subscription": "weekly",
    "subonoff": 1,
    "careline_count": 0,
    "article_count": 0,
    "article_frequency": 13,
    "final_article_frequency": 6,
    "en_click": 5,
    "ar_click": 0,
    "m_preg_click": 12,
    "preg_click": 10,
    "preg_article_click": 8,
    "pre_preg_click": 0,
    "pre_preg_article_click": 0,
    "motherhood_click": 9,
    "motherhood_article_click": 3,
    "trim_1st_click": 12,
    "trim_1st_more_click": 0,
    "trim_2nd_click": 3,
    "trim_2nd_more_click": 0,
    "trim_3rd_click": 0,
    "trim_3rd_more_click": 0,
    "menu_click": 15,
    "subscription_click": 9,
    "createdDate": {
        "$date": "2018-11-21T11:33:16.544Z"
    },
    "fbid": 2023662901055200,
    "__v": 0,
    "dob": {
        "$date": "2018-11-28T20:00:00.000Z"
    },
    "get_started_click": 3,
    "dob_entry": {
        "$date": "2018-12-13T06:41:00.861Z"
    },
    "week17_click": 1,
    "threeYr_click": 1,
    "week13_click": 2
};

//addUsers1(oobj);
//users[0].fbid == 2023662901055200 || users[0].fbid == 2196224937108368 || users[0].fbid == 2267403429958099 || users[0].fbid == 2372546742773174 || users[0].fbid == 2213589875319271 || users[0].fbid == 2036531283049793 || users[0].fbid == 2238616709536717 
//users[0].fbid == 2023662901055200 || users[0].fbid == 2196224937108368 || users[0].fbid == 2238616709536717

function addUsers(users){
    
    SendArticlData.findOne({fbid: users[0].fbid ,status:0}).exec(function(err,user){
        if(!err){
            
            if(user == null){
                //console.log(users[0].fbid);days.includes(todaysDate.getDay())
                var todaysDate = new Date();
                //var days = [0,1,2,3,4,5,6];//0-sunday
                if(users[0].subscription=="monthly" && todaysDate.getDate()==1){
                    addMonthly(users[0]);
                   }
                else if(users[0].subscription=="weekly" && todaysDate.getDay()==0){
                    //console.log("addWeekly:"+users[0].fbid);
                    addWeekly(users[0]);
                }

            }
            
            //console.log(users.length);
            if(users.length!=1){
                users.shift();
                //console.log(users[0]);
                addUsers(users);
            }
        }
    });
}

/*function addUsers1(users){
    console.log("assa");
    SendArticlData.findOne({fbid: users.fbid ,status:0}).exec(function(err,user){
        if(!err){
            
            if(user == null && users.fbid==2023662901055200){
                console.log(users.fbid);
                if(users.subscription=="monthly"){
                    addMonthly(users);
                   }
                else{
                    addWeekly(users);
                }

            }
            
        }
    });
}*/

/*
setTimeout(function () {
    User.findOne({fbid: 2023662901055200 }).exec(function(err,user){
                        if(!err){
                            addMonthlyMotherhood(user);
                        }
                    });
}, 1000);
*/

function addMonthly(user){
    
    if(user.final_pregnancy_type=='Motherhood'){
        addMonthlyMotherhood(user);
       return;
       }
    
    Article.findOne({article_for: user.final_pregnancy_type.toLowerCase(),article_order:Math.ceil(user.final_article_frequency),article_lang:user.lang,article_status: 1 }).exec(function(err,article){
            if(!err){
                var article_order=1;
                if(article == null){
                    /*if(user.final_pregnancy_type=="Pregnancy"){
                       article_order=6;
                       }
                    Article.findOne({article_for: user.final_pregnancy_type.toLowerCase(),article_frequency:"monthly",article_order:article_order ,article_lang:user.lang}).exec(function(err,article){
                            if(article!=null){
                            User.findOneAndUpdate(
                            {fbid:user.fbid},
                            {$set: {"final_article_frequency":article_order,"article_frequency":article_order}},
                            {upsert:false},
                                function(err,user){
                                    var newUpdate = SendArticlData();
                                    newUpdate.fbid = user.fbid;
                                    newUpdate.pregnancy_type = user.final_pregnancy_type.toLowerCase();
                                    newUpdate.subscription = user.subscription;
                                    newUpdate.obj = [
                                                        {
                                                        "title": article.article_title,
                                                        "image_url": article.img_url,
                                                        "buttons": [
                                                            {
                                                            "title": "View",
                                                            "type": "web_url",
                                                            "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article.article_url+"&p_type="+user.final_pregnancy_type+"&frequency="+article.article_order,
                                                            "webview_height_ratio": "full"
                                                            }
                                                        ]
                                                        }
                                                    ];
                                    newUpdate.save(function(err,user){
                                        if(!err){
                                            //getData(senderID);
                                        }
                                    });
                            });
                        }
                    });*/
                }
                else{
                    var temp_f=1;
                    if(user.final_pregnancy_type=="Pregnancy"){
                        temp_f=4;
                       }
                    User.findOneAndUpdate(
                        {fbid:user.fbid},
                        {$inc: {final_article_frequency:temp_f,article_frequency:temp_f}},
                        {upsert:false},
                        function(err,user){
                            var newUpdate = SendArticlData();
                            newUpdate.fbid = user.fbid;
                            newUpdate.pregnancy_type = user.final_pregnancy_type.toLowerCase();
                            newUpdate.subscription = user.subscription;
                            newUpdate.obj = [
                                                {
                                                "title": article.article_title,
                                                "image_url": article.img_url,
                                                "buttons": [
                                                    {
                                                    "title": "View",
                                                    "type": "web_url",
                                                    "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article.article_url+"&p_type="+user.final_pregnancy_type+"&frequency="+article.article_order,
                                                    "webview_height_ratio": "full"
                                                    }
                                                ]
                                                }
                                            ];
                            newUpdate.save(function(err,user){
                                if(!err){
                                    //getData(senderID);
                                }
                            });
                            
                            if(user.final_article_frequency==40 && user.final_pregnancy_type=="Pregnancy" &&user.subscription=="weekly"){
                                var da=moment(new Date(),"YYYY-MM-DD 00:00:00").add(7, 'day');
                                da.set({hour:0,minute:0,second:0,millisecond:0});
                                User.findOneAndUpdate(
                                {fbid:user.fbid},
                                {$set: {"final_pregnancy_type":"Motherhood","final_article_frequency":1,"article_frequency":1,dob:da}},
                                {upsert:false},
                                    function(err,user){
                                        
                                });
                               }
                            
                    });
                }
            }
    });
}

function addMonthlyMotherhood(user){
    if(user.dob==undefined){
       return;
       }
    var current_date = moment();
    var ageDiff = current_date.diff(user.dob, 'months');
    var daysDiff = current_date.diff(user.dob, 'days');
    //console.log(ageDiff);
    ageDiff = ageDiff*4;
    var p_type;
    var range=1;
    var elements = [];
    for(var i=1;i<=ageDiff;i++){
        range=i+(i*3);
        if(ageDiff<=range){
            break;
           }
    }
    
    if(daysDiff<=90){
        p_type="Motherhood:0_3";
       }
   else if(daysDiff>90 && daysDiff<=181){
       p_type="Motherhood:4_6";
       }
   else if(daysDiff>181 && daysDiff<=273){
       p_type="Motherhood:7_9";
       }
   else if(daysDiff>273 && daysDiff<365){
       p_type="Motherhood:10_12";
       }
   else if(daysDiff>=365 && daysDiff<730){
       p_type="Motherhood:oneYr";
       }
   else if(daysDiff>=730 && daysDiff<1095){
       p_type="Motherhood:twoYr";
       }
   else if(daysDiff>=1095 && daysDiff<1460){
      p_type="Motherhood:threeYr";
       }
   else if(daysDiff>=1460){
      p_type="Motherhood:pre_school";
       }
    
    //console.log(range);
    Article.find({article_for:'motherhood',article_lang:user.lang,article_order:{$gte:range-3,$lte:range},article_status: 1}).exec(function(err,article){
        //console.log(article);
            if(!err){
                //console.log("a");
                if(article != null){
                   // console.log("b");
                    for(var i =0;i<article.length;i++){
                        elements[i]={
                                        "title": article[i].article_title,
                                        "image_url": article[i].img_url,
                                        "buttons": [
                                            {
                                            "title": "View",
                                            "type": "web_url",
                                            "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article[i].article_url+"&p_type="+p_type,
                                            "webview_height_ratio": "full"
                                            }
                                        ]
                                    }
                    }
                    //console.log(elements);
                    var newUpdate = SendArticlData();
                    newUpdate.fbid = user.fbid;
                    newUpdate.pregnancy_type = user.final_pregnancy_type;
                    newUpdate.subscription = user.subscription;
                    newUpdate.obj = elements;
                    newUpdate.save(function(err,user){
                        if(!err){
                            //getData(senderID);
                            //console.log(user);
                        }
                        else{
                            //console.log(err);
                        }
                    });
                    
                    
                }

            }
        });
    
}

function addWeekly(user){
    if(user.final_pregnancy_type=='Motherhood'){
        addWeeklyMotherhood(user);
       return;
       }
    
    if(user.final_article_frequency<6){
        user.final_article_frequency=6;
       }
    Article.findOne({article_for: user.final_pregnancy_type.toLowerCase(),article_order:user.final_article_frequency, article_lang:user.lang,article_status: 1}).exec(function(err,article){
            if(!err){
                //console.log(article);
                var article_order=1;
                if(article == null){
                  /*  if(user.final_pregnancy_type=="Pregnancy"){
                       article_order=6;
                       }
                    Article.findOne({article_for: user.final_pregnancy_type.toLowerCase(),article_frequency:"weekly",article_order:article_order ,article_lang:user.lang}).exec(function(err,article){
                        if(article!=null){
                            User.findOneAndUpdate(
                            {fbid:user.fbid},
                            {$set: {"final_article_frequency":article_order,"article_frequency":article_order}},
                            {upsert:false},
                                function(err,user){
                                    var newUpdate = SendArticlData();
                                    newUpdate.fbid = user.fbid;
                                    newUpdate.pregnancy_type = user.final_pregnancy_type.toLowerCase();
                                    newUpdate.subscription = user.subscription;
                                    newUpdate.obj = [
                                                        {
                                                        "title": article.article_title,
                                                        "image_url": article.img_url,
                                                        "buttons": [
                                                            {
                                                            "title": "View",
                                                            "type": "web_url",
                                                            "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article.article_url+"&p_type="+user.final_pregnancy_type,
                                                            "webview_height_ratio": "full"
                                                            }
                                                        ]
                                                        }
                                                    ];
                                    newUpdate.save(function(err,user){
                                        if(!err){
                                            //getData(senderID);
                                        }
                                    });
                            });
                        }
                    });*/
                }
                else{

                    User.findOneAndUpdate(
                        {fbid:user.fbid},
                        {$inc: {final_article_frequency:1,article_frequency:1}},
                        {upsert:false},
                        function(err,user){
                            var newUpdate = SendArticlData();
                            newUpdate.fbid = user.fbid;
                            newUpdate.pregnancy_type = user.final_pregnancy_type.toLowerCase();
                            newUpdate.subscription = user.subscription;
                            newUpdate.obj = [
                                                {
                                                "title": article.article_title,
                                                "image_url": article.img_url,
                                                "buttons": [
                                                    {
                                                    "title": "View",
                                                    "type": "web_url",
                                                    "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article.article_url+"&p_type="+user.final_pregnancy_type,
                                                    "webview_height_ratio": "full"
                                                    }
                                                ]
                                                }
                                            ];
                            newUpdate.save(function(err,user){
                                if(!err){
                                    //getData(senderID);
                                }
                            });
                            
                            if(user.final_article_frequency==40 && user.final_pregnancy_type=="Pregnancy"){
                                var da=moment(new Date(),"YYYY-MM-DD 00:00:00").add(7, 'day');
                                da.set({hour:0,minute:0,second:0,millisecond:0});
                                User.findOneAndUpdate(
                                {fbid:user.fbid},
                                {$set: {"final_pregnancy_type":"Motherhood","final_article_frequency":1,"article_frequency":1,dob:da}},
                                {upsert:false},
                                    function(err,user){
                                        
                                });
                               }
                            
                    });
                }
            }
    });
}

function addWeeklyMotherhood(user){
    //console.log(user);
    if(user.dob==undefined){
       return;
       }
    var current_date = moment();
    var ageDiff = current_date.diff(user.dob, 'months');
    var daysDiff = current_date.diff(user.dob, 'days');
    //console.log(ageDiff);
    ageDiff = ageDiff*4;
    var p_type;
    var range=1;
    var elements = [];
    range = Math.floor((daysDiff) / 7);
    //console.log("range:"+range);
    
    if(daysDiff<=90){
        p_type="Motherhood:0_3";
       }
   else if(daysDiff>90 && daysDiff<=181){
       p_type="Motherhood:4_6";
       }
   else if(daysDiff>181 && daysDiff<=273){
       p_type="Motherhood:7_9";
       }
   else if(daysDiff>273 && daysDiff<365){
       p_type="Motherhood:10_12";
       }
   else if(daysDiff>=365 && daysDiff<730){
       p_type="Motherhood:oneYr";
       }
   else if(daysDiff>=730 && daysDiff<1095){
       p_type="Motherhood:twoYr";
       }
   else if(daysDiff>=1095 && daysDiff<1460){
      p_type="Motherhood:threeYr";
       }
   else if(daysDiff>=1460){
      p_type="Motherhood:pre_school";
       }
    
    //console.log(range);
    Article.find({article_for:'motherhood',article_lang:user.lang,article_order:range, article_status: 1}).exec(function(err,article){
        //console.log(article);
            if(!err){
                //console.log("B");
                //console.log(article);
                if(article != null){
                   // console.log("b");
                    for(var i =0;i<article.length;i++){
                        elements[i]={
                                        "title": article[i].article_title,
                                        "image_url": article[i].img_url,
                                        "buttons": [
                                            {
                                            "title": "View",
                                            "type": "web_url",
                                            "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+user.fbid+"&url="+article[i].article_url+"&p_type="+p_type,
                                            "webview_height_ratio": "full"
                                            }
                                        ]
                                    }
                    }
                    //console.log(elements);
                    var newUpdate = SendArticlData();
                    newUpdate.fbid = user.fbid;
                    newUpdate.pregnancy_type = user.final_pregnancy_type;
                    newUpdate.subscription = user.subscription;
                    newUpdate.obj = elements;
                    newUpdate.save(function(err,user){
                        if(!err){
                            //getData(senderID);
                            //console.log(user);
                        }
                        else{
                            //console.log(err);
                        }
                    });
                    
                    
                }

            }
        });
}

var flg=true;
setInterval(function () {
    //console.log("a");
    if(send_data_array.length>0 && send_data_flag){
        //console.log("b");
            if(send_data_array[0].msg_type=="subscription"){
                send_data_flag = false;
                push_notification(send_data_array[0]);
               }
            else if(send_data_array[0].msg_type=="tth"){
                
                //console.log("tth:::::");
                    send_data_flag=false;
                    User.findOne({fbid: send_data_array[0].fbid }).exec(function(err,users){
                        if(!err){
                            //console.log(users);
                            if(users.offBot==1){
                                //console.log("tth:send::::");
                                talk_to_human_auto_reply(send_data_array[0]);
                               }
                            else{
                                //res.sendStatus(403);
                                send_data_array.shift();
                                send_data_flag = true;
                            }
                        }
                        else{
                            //res.sendStatus(403);
                            send_data_array.shift();
                            send_data_flag = true;
                        }
                    });   
                }
            
       }
    
    if(send_article_array.length>0 && send_article_flag){
        send_article_flag=false;
        var elements = [];
        if(send_article_array[0].type=='notification'){
            for(var i=0;i<send_article_array[0].obj.length;i++){
                elements[i] = send_article_array[0].obj[i];
            }
            sendArticle1(send_article_array[0].fbid,elements);
            send_article_array.shift();
            send_article_flag=true;
        }
        else{
            
           /* SendArticlData.find({fbid:send_article_array[0].fbid}).exec(function(err,article){
        //console.log(article);
            if(!err){
                for(var i=0;i<article.length;i++){
                    SendArticlData.findOneAndUpdate(
                    {fbid:send_article_array[0].fbid},
                    {$set: {"status":1}},
                    {upsert:false},
                    function(err,user){
                        if(!err){
                        }
                    });
                }
            }
            }*/
            
            SendArticlData.findOneAndUpdate(
                {fbid:send_article_array[0].fbid,status:0},
                {$set: {"status":1}},
                {upsert:false},
                function(err,user){
                    if(!err){
                        
                            for(var i=0;i<send_article_array[0].obj.length;i++){
                                elements[i] = send_article_array[0].obj[i];
                            }
                        sendArticle(send_article_array[0].fbid,elements,user);
                        send_article_array.shift();
                        send_article_flag=true;
                        
                        
                        
                       }
                });
            
            
        }
    }
    /*if(flg){
       flg=false;
        var current_date = moment();
        var dob = moment('2018-10-21', "YYYY-MM-DD");
        var ageDiff = current_date.diff(dob, 'week');
        //today.diff(birthday, 'week');
        console.log(ageDiff);
       }*/
}, 250);


/*
elements[i] = {
               "title": items[i].m_title,
               "image_url": items[i].image,
               "buttons": [
                   {
                       "title": items[i].b_title,
                       "type": "web_url",
                       "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+senderID+"&url="+items[i].url+"&p_type=notification",
                        "webview_height_ratio": "full"

                   }
               ]
           };
*/

function sendArticle(senderID,elements,user){
    
        var messageObj ={
           "attachment":{
               "type":"template",
               "payload":{
                   "template_type":"generic",
                   "elements":elements
               }
           }
       }
        GlobalData.sendGenericMessageFb(senderID, messageObj);
    console.log(messageObj);
    var ele =getParameterByName("p_type",elements[0].url);
    if(user.pregnancy_type!=undefined && ele!=null && getParameterByName("p_type",elements[0].url).startsWith("Motherhood")){
        user.pregnancy_type="Motherhood";
       }
    
    var newUpdate = PushArticlData();
    newUpdate.fbid = user.fbid;
    newUpdate.pregnancy_type = user.final_pregnancy_type;
    newUpdate.obj = elements;
    newUpdate.frequency = getParameterByName("frequency",elements[0].url);
    if(ele!=null && getParameterByName("p_type",elements[0].url).startsWith("Motherhood")){
        newUpdate.frequency = getParameterByName("p_type",elements[0].url).substring(11);
       }
    
    newUpdate.save(function(err,user){
        if(!err){
            //getData(senderID);
        }
    });
   
    
}

function getParameterByName(name,url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function sendArticle1(senderID,elements){
    
        var messageObj ={
           "attachment":{
               "type":"template",
               "payload":{
                   "template_type":"generic",
                   "elements":elements
               }
           }
       }
        GlobalData.sendGenericMessageFb(senderID, messageObj);
   
    
}


//sendMail("dsadfsafads");

app.get('/dob/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    User.findOneAndUpdate(
        {fbid:fbid},
        {$set: {"lastAction":"link","pregnancy_type":"Motherhood"},$inc: {"motherhood_click":1}},
        {upsert:false},
        function(err,user){
            //sengMsg(id,"got url");
    });
    res.render('fb_dob', {
        fbid
    });
});

app.post('/dob/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    var date = req.body.date;
    res.status(200).send("ok");
    var current_date = moment();
    var dob = moment(date, "YYYY-MM-DD").add(1, 'days');
    var ageDiff = current_date.diff(dob, 'months');
    var senderID = fbid;
    //ageDiff = parseInt(ageDiff);
    //console.log("current_date:"+current_date);
    //console.log("dob:"+dob);
    //console.log("age:"+ageDiff);
    User.findOneAndUpdate(
        {fbid:senderID},
        {$set: {"lastPayload":"","offBot":0,"careline_count":0,"dob":dob,"article_frequency":ageDiff,"dob_entry":current_date},$inc:{"next_click":1}},
        {upsert:false},
        function(err,user){
            if(ageDiff<4){
                month0_3(senderID,user);
               }
            else if(ageDiff<7){
               month4_6(senderID,user);
               }
            else if(ageDiff<10){
               month7_9(senderID,user);
               }
            else if(ageDiff<12){
               month10_12(senderID,user);
               }
            else if(ageDiff<24){
               oneYr(senderID,user);
               }
            else if(ageDiff<36){
               twoYr(senderID,user);
               }
            else if(ageDiff<48){
               threeYr(senderID,user);
               }
            else{
                pre_school(senderID,user);
            }
        }
    );    
    
});


app.get('/dobar/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    User.findOneAndUpdate(
        {fbid:fbid},
        {$set: {"lastAction":"link","pregnancy_type":"Motherhood"},$inc: {"motherhood_click":1}},
        {upsert:false},
        function(err,user){
            //sengMsg(id,"got url");
    });
    res.render('fb_dob_ar', {
        fbid
    });
});

app.post('/dobar/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    var date = req.body.date;
    res.status(200).send("ok");
    var current_date = moment();
    var dob = moment(date, "YYYY-MM-DD").add(1, 'days');
    var ageDiff = current_date.diff(dob, 'months');
    var senderID = fbid;
    //ageDiff = parseInt(ageDiff);
    //console.log("current_date:"+current_date);
    //console.log("dob:"+dob);
    //console.log("age:"+ageDiff);
    User.findOneAndUpdate(
        {fbid:senderID},
        {$set: {"lastPayload":"","offBot":0,"careline_count":0,"dob":dob,"article_frequency":ageDiff,"dob_entry":current_date},$inc:{"next_click":1}},
        {upsert:false},
        function(err,user){
            if(ageDiff<4){
                month0_3(senderID,user);
               }
            else if(ageDiff<7){
               month4_6(senderID,user);
               }
            else if(ageDiff<10){
               month7_9(senderID,user);
               }
            else if(ageDiff<12){
               month10_12(senderID,user);
               }
            else if(ageDiff<24){
               oneYr(senderID,user);
               }
            else if(ageDiff<36){
               twoYr(senderID,user);
               }
            else if(ageDiff<48){
               threeYr(senderID,user);
               }
            else{
                pre_school(senderID,user);
            }
        }
    );    
    
});


app.get('/privacy_policy', function (req, res) {
    User.findOneAndUpdate(
        {fbid:1234567890},
        {$inc: {"p_policy_click": 1}},
        {upsert:false},
        function(err,user){

        }
    ); 
    res.render('privacy_policy', {
        //fbid
    });
});
app.get('/privacy_policy/ar', function (req, res) {
    res.render('policyAr', {});
});
app.get('/email/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    User.findOneAndUpdate(
        {fbid:fbid},
        {$inc: {"email_us_click": 1}},
        {upsert:false},
        function(err,user){
    });
    res.render('email_us', {
        fbid
    });
});


app.post('/email/:fbid', function (req, res) {
    let fbid = req.params.fbid;
    var topic = req.body.topic;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var message = req.body.message;
    res.status(200).send("ok");
    User.findOneAndUpdate(
        {fbid:fbid},
        {$set: {"lastPayload":"","offBot":0,"careline_count":0}},
        {upsert:false},
        function(err,user){
            sendMail(fbid,topic,email,message,fname,lname);
        }
    ); 
    
    
});



app.get('/email1', function (req, res) {
    //let fbid = req.params.fbid;
    //console.log("email1");
    User.findOneAndUpdate(
        {fbid:1234567890},
        {$inc: {"email_us_menu_click": 1}},
        {upsert:false},
        function(err,user){

        }
    ); 
    res.render('email_us1', {
        //fbid
    });
});

app.get('/emailAr', function (req, res) {
    //let fbid = req.params.fbid;
    //console.log("email1_ar");
    res.render('email_usAr', {
        //fbid
    });
});

app.post('/emailAr', function (req, res) {
    //let fbid = req.params.fbid;
    var topic = req.body.topic;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var message = req.body.message;
    res.status(200).send("ok");
    User.findOneAndUpdate(
        {fbid:fbid},
        {$set: {"lastPayload":"","offBot":0,"careline_count":0}},
        {upsert:false},
        function(err,user){
            sendMail1(topic,email,message,fname,lname);
        }
    ); 
    
    
});


app.post('/email1', function (req, res) {
    //let fbid = req.params.fbid;
    var topic = req.body.topic;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var message = req.body.message;
    res.status(200).send("ok");
    sendMail1(topic,email,message,fname,lname);
    
    
});


app.get('/res_url', function(req, res) {
    //res.status(200).send("data");
    var url = req.query.url;
    var id = req.query.id;
    var p_type = req.query.p_type;
    var article_frequency = 6;
    var t_type = req.query.t_type;
    if(p_type=="Pregnancy"){
       article_frequency = req.query.frequency;
        //console.log("article_frequency:"+article_frequency)
        if(article_frequency==undefined){
            article_frequency = 6;
           }
       }
    //console.log("id:"+id);
    //console.log("url:"+url);
    /*if(){
       
       }*/
    User.findOneAndUpdate(
        {fbid:id},
        {$set: {"lastPayload":"","offBot":0,"careline_count":0,"article_frequency":article_frequency,"dob_entry":moment()}},
        {upsert:false},
        function(err,user){
            if(user!=null && user.subonoff==0){
                User.findOneAndUpdate(
                    {fbid:id},
                    {$set: {"lastPayload":"","offBot":0,"careline_count":0,"article_frequency":article_frequency,"dob_entry":moment()}},
                    {upsert:false},
                    function(err,user){
                        if(user!=null){
                        if(user.subscription!=""){
                            User.findOneAndUpdate(
                                {fbid:id},
                                {$set: {"final_article_frequency":article_frequency,"article_frequency":article_frequency}},
                                {upsert:false},
                                function(err,user){

                                }
                            );  
                           }
                        if(user.subscription=="monthly" && p_type=="Pregnancy"){
                            var frequency = Math.round((article_frequency*7)/30);
                                    User.findOneAndUpdate(
                                        {fbid:id},
                                        {$set: {"final_article_frequency":frequency,"article_frequency":frequency}},
                                        {upsert:false},
                                        function(err,user){

                                        }
                                    );  
                                   }
                        }
                    }

                );  
            
            }
            else if(user!=null && user.subonoff==1){
                User.findOneAndUpdate(
                    {fbid:id},
                    {$set: {"lastPayload":"","offBot":0,"careline_count":0}},
                    {upsert:false},
                    function(err,user){
                        if(user!=null){
                        }
                    }

                );  
            
            }
        
        });  
    
    var temp_p_type = p_type;
    //console.log("p_type:"+p_type.substring(0, 10));
    if(p_type!=undefined && p_type.substring(0, 10)=="Motherhood"){
        temp_p_type = "Motherhood";
    }
        
    User.findOneAndUpdate(
        {fbid:id},
        {$set: {"lastAction":"link","pregnancy_type":temp_p_type}},
        {upsert:false},
        function(err,user){
            //sengMsg(id,"got url");
            //console.log("1::::::");
            if(user!=null){
                //console.log("a::::::");
                SendUpdate.findOneAndUpdate(
                {fbid:id,status:1,msg_type:"subscription"},
                {$set: {"send_time":moment(new Date()).add(3, 'm'),"fuction_name":p_type}},
                {upsert:false},
                function(err,user){
                if(!err){
                   //console.log("b::::::");
                    //console.log(user);
                    if(user == null){
                        //console.log("c::::::");
                        var d = new Date();
                        //console.log(moment(d).add(30, 'm'));

                        var newUpdate = SendUpdate();
                        newUpdate.fbid = id;
                        newUpdate.msg_type = "subscription";
                        newUpdate.send_time = moment(d).add(3, 'm');//current time+15min
                        newUpdate.status = 1;
                        newUpdate.fuction_name = p_type;
                        newUpdate.save(function(err,user){
                            if(!err){
                                //console.log("d::::::");
                            }
                        });
                    }
                }
            });
            }
            else{
                return;
            }
    });
    
    if(p_type=="Pregnancy"){
        //console.log("week6_EN_click");
        var temp = "week"+parseFloat(article_frequency).toFixed(0)+"_"+t_type+"_click";
        //console.log(temp);
        User.findOneAndUpdate(
            {fbid:id},
            {$inc: {"preg_article_click": 1,[temp]:1}},
            {upsert:false},
            function(err,user){
        });
       }
    else if(p_type=="Pre-Pregnancy"){
        User.findOneAndUpdate(
            {fbid:id},
            {$inc: {"pre_preg_article_click": 1,[t_type]:1}},
            {upsert:false},
            function(err,user){
        });
    }
    else if(p_type!=undefined && p_type.substring(0, 10)=="Motherhood"){
        User.findOneAndUpdate(
            {fbid:id},
            {$inc: {"motherhood_article_click": 1,[t_type]:1}},
            {upsert:false},
            function(err,user){
        });
        motherhood_track(id,p_type.substring(11));
    }
    
    
        return res.redirect(url+"?utm_source=Chatbot&utm_campaign=LinkArticles");
    
});

function motherhood_track(senderID,data){
    switch (data) {
            case '0_3':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"month0_3_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case '4_6':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"month4_6_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case '7_9':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"month7_9_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case '10_12':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"month10_12_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case 'oneYr':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"oneYr_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case 'twoYr':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"twoYr_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case 'threeYr':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"threeYr_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
            case 'pre_school':
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$inc: {"pre_school_click": 1}},
                    {upsert:false},
                    function(err,user){

                });
                break;
    }
}

app.get('/res_url2', function (req, res) {
    var url = req.query.url;
    var type = req.query.type;
    //console.log("res_url2");
    
    if(type=="web"){
        User.findOneAndUpdate(
            {fbid:1234567890},
            {$inc: {"website_click": 1}},
            {upsert:false},
            function(err,user){
                
            }
        ); 
       }
    else if(type=="buy_now"){
            User.findOneAndUpdate(
                {fbid:1234567890},
                {$inc: {"buy_now_click": 1}},
                {upsert:false},
                function(err,user){

                }
            ); 
        }
    
    
    
    return res.redirect(url+"?utm_source=Chatbot&utm_campaign=LinkArticles");
});


app.get('/getAllData/d15f1sd65', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    User.find().exec(function(err,users){
        if(!err){
            res.status(200).send(JSON.stringify(users));
        }
        else{
            res.sendStatus(403);
        }
    });
});


app.get('/getStarted', function(req, res) {
    res.status(200).send("getStarted");
    request({
        uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: GlobalData.accessTokenFb },
        method: 'POST',
        json:  {
            "setting_type":"call_to_actions",
            "thread_state":"new_thread",
            "call_to_actions":[
                {
                    "payload":"getStarted"
                }
            ]
        }
    });
});

app.get('/menu', function(req, res) {
    res.status(200).send("menu");
    var messageData = {
        "persistent_menu":[
            {
                "locale":"default",
                "composer_input_disabled":false,
                "call_to_actions":[
                    {
                        "type":"web_url",
                        "title":"Go to our website",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/res_url2?url=https://www.apta-advice.com&type=web",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type":"postback",
                        "title":"Menu",
                        "payload":"main_menu_menu"
                    },
                    {
                        "title":"Settings",
                        "type":"nested",
                        "call_to_actions":[
                            {
                                "type":"postback",
                                "title":"Manage subscriptions",
                                "payload":"m_alert"
                            },
                            {
                                "type": "web_url",
                                "title": "Buy now",
                                "url":"https://danone-apta-advice.herokuapp.com/fb/res_url2?url=https://www.apta-advice.com/apta-products&type=buy_now",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type":"postback",
                                "title":"Contact Careline",
                                "payload":"talkHuman_m"
                            },
                            {
                                "type": "web_url",
                                "title": "Email us",
                                "url":"https://danone-apta-advice.herokuapp.com/fb/email1",
                                "webview_height_ratio": "full"
                            },
                            {
                                "type":"web_url",
                                "title":"Privacy Policy",
                                "url":"https://danone-apta-advice.herokuapp.com/fb/privacy_policy",
                                "webview_height_ratio": "full"
                            }
                        ]
                    }
                ]
            }
        ]
    };
    
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: GlobalData.accessTokenFb },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        console.log(error);
        console.log(response);
        console.log(body);
    });
});

app.get('/bot', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === "098757857865") {
        //console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        //console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/bot', function(req, res) {
    var data = req.body;
    res.sendStatus(200);
    if (data.object === 'page') {
        data.entry.forEach(function(entry) {
            entry.messaging.forEach(function(event) {
                var senderID = event.sender.id;
                if(event.delivery!=undefined)
                {
                    User.findOne({fbid: senderID}).exec(function(err,user){
                        if(!err){
                            msgsDelivery(senderID,user);
                        }
                    });
                    return;
                }
                var message = event.message;
                User.findOne({fbid: senderID}).exec(function(err,user){
                    if(!err){
                        if(user==null){
                            var newUser = User();
                            newUser.fbid = senderID;
                            newUser.lastAction = "get started";
                            newUser.first_name = "";
                            newUser.last_name = "";
                            newUser.gender = "";
                            newUser.save(function(err,user){
                                if(!err){
                                    getData(senderID);
                                }
                            });
                        }
                        else{
                            if(user.offBot==1){
                                var data = {};
                                if(event.message!=undefined && event.message.attachments!=undefined){
                                    var attachments = event.message.attachments;
                                    let msg = [];
                                    for (var i = 0; i < attachments.length; i++){
                                        msg.push({
                                            "type": attachments[i].type,
                                            "payloadUrl": attachments[i].payload.url
                                        });
                                    }
                                    data = {
                                        "fbid": senderID,
                                        "msgType": "attachments",
                                        "msg": msg,
                                        "from": user.first_name
                                    };
                                }
                                else if (event.message) {
                                    data = {
                                        "fbid":senderID,
                                        "msgType": "text",
                                        "msg": event.message.text,
                                        "from": user.first_name
                                    };
                                }
                                else if(event.postback!=undefined && event.postback.payload!=undefined){
                                    if(event.postback.payload == "getStarted"){
                                        User.findOneAndUpdate(
                                            {fbid:senderID},
                                            {$inc: {"get_started_click": 1}},
                                            {upsert:false},
                                            function(err,user){
                                            
                                        });
                                        welcomeMessage(senderID, user);
                                    }
                                    else if(event.postback.payload == "turnBotOn"){
                                        User.findOneAndUpdate(
                                            {fbid:senderID},
                                            {$set: {"lastAction":"turnBotOn",offBot:0}},
                                            {upsert:false},
                                            function(err,user){
                                                welcomeMessage(senderID,user);
                                            }
                                        );
                                    }
                                    else if(event.postback.payload == "turnBotOn_yes"){
                                        payloadMessage(senderID, user.lastPayload, user);
                                        User.findOneAndUpdate(
                                            {fbid:senderID},
                                            {$set: {"lastPayload":"",offBot:0}},
                                            {upsert:false},
                                            function(err,user){
                                            }
                                        );                                      
                                    }
                                    else if(event.postback.payload == "turnBotOn_no"){
                                        let msg = "Hang on, while one of our experts is with you shortly.";
                                        GlobalData.sendTextMessageFB(senderID, msg);
                                    }
                                    else{
                                        /*var messageObj = {
                                            "attachment": {
                                                "type": "template",
                                                "payload": {
                                                    "template_type": "button",
                                                    "text": "Do you want to turn on Bot and stop chatting with Human?",
                                                    "buttons": [{
                                                            "type": "postback",
                                                            "title": "Yes",
                                                            "payload": "turnBotOn_yes"
                                                        },
                                                        {
                                                            "type": "postback",
                                                            "title": "No",
                                                            "payload": "turnBotOn_no"
                                                        }
                                                    ]
                                                }
                                            }
                                        };
                                        GlobalData.sendGenericMessageFb(senderID, messageObj);
                                        User.findOneAndUpdate({fbid:senderID},{$set: {"lastPayload":event.postback.payload}},{upsert:false},function(err,user){});*/
                                        //console.log("paylod:"+user.lastPayload);
                                        payloadMessage(senderID, event.postback.payload, user);
                                        
                                    }
                                    return;
                                }
                                TalkToAHumanController.sendMessage(data);
                            }
                            else{
                                var eventAction = "";
                                if (event.message!=undefined && event.message.quick_reply!=undefined){
                                    quickReply(senderID,event.message.quick_reply,user);
                                }
                                else if(event.message!=undefined && event.message.attachments!=undefined){
                                    //attachment(senderID,event.message,user);
                                }
                                else if (event.message) {
                                    textMessage(senderID,event.message,user);
                                }
                                else if(event.postback!=undefined && event.postback.payload!=undefined){
                                    console.log("in postback");
                                    payloadMessage(senderID,event.postback.payload,user);
                                }
                            }
                        }
                    }
                });
            });
        });
    }
});
function getData(senderID){
    request({
        uri: 'https://graph.facebook.com/v2.6/'+senderID,
        qs: { access_token: GlobalData.accessTokenFb,fields:'first_name,last_name'},
        method: 'GET'
    },function(error, response, body){
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            User.findOneAndUpdate({fbid:senderID}, {$set: {"first_name": data.first_name, "last_name": data.last_name}},{upsert:false},function(err,user){
                if (err){
                    console.log("has findOneAndUpdate error");
                    
                    welcomeMessage(senderID, user);

                }else{
                    user.first_name = data.first_name;
                    welcomeMessage(senderID,user);
                }
            });
        }
        else if (error){
            console.log("has error");
             welcomeMessage(senderID, user);
        }
    });
}

function msgsDelivery(senderID, user){// for delivery callback
    /* console.log("Delivery - " + user.lastAction);
    if (user.lastAction == "welcome") {
        quiz_starting_text(senderID);
    } */
    switch(user.lastAction){
        case 'weekly':
            //talk_human_mum_opy(senderID, user);
            
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"sss"}},
                {upsert:false},
                function(err,user){
                    if(user.lang=="Ar"){
                       sengMsg(senderID, 'يمكنكِ دائماً إلغاء الاشتراك عن طريق اختيار التحكم في الاشتراكات من قائمة الإعدادات');
                       }
                   else{
                       sengMsg(senderID, 'You can always opt out by selecting manage subscriptions in the settings.');
                   }
            });
            break;
        case 'monthly':
            //talk_human_mum_opy(senderID, user);
            
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"sss"}},
                {upsert:false},
                function(err,user){
                    if(user.lang=="Ar"){
                       sengMsg(senderID, 'يمكنكِ دائماً إلغاء الاشتراك عن طريق اختيار التحكم في الاشتراكات من قائمة الإعدادات');
                       }
                   else{
                       sengMsg(senderID, 'You can always opt out by selecting manage subscriptions in the settings.');
                   }
            });
            break;
        case 'email_sent':
            //talk_human_mum_opy(senderID, user);
            break;
        default:
            break;
            
   }
}
function quickReply(senderID, event, user) {
    var eventAction = event.payload;
    
}

function textMessage(senderID, event, user) {
    //console.log("msg");
    var eventAction = event.text.toLowerCase();
    //console.log("msg: "+event.text);
    if(eventAction=="restart" || eventAction=="getstarted" || eventAction=="get started"){
        welcomeMessage(senderID, user);
       }
    else if(eventAction=="menu"){
        payloadMessage(senderID, "main_menu_menu", user)
       }
    else{
        //console.log(event);
        //console.log("============================================================================");
        //console.log(event.nlp);
        let flag = false;
        if(event.hasOwnProperty("nlp") && event.nlp.hasOwnProperty("entities")){
            var entities = event.nlp.entities;
            if(entities.hasOwnProperty('bye')){
                User.findOneAndUpdate({fbid: senderID}, {$set: {"careline_count": 0}}, {upsert: false}, 
                function (err, user){});
                
                if(user.lang=="Ar"){
                       sengMsg(senderID, "إلى اللقاء، يمكنك التواصل معنا طيلة اليوم على مدار الأسبوع إذا احتجتِ أي مساعدة");
                       }
                   else{
                       sengMsg(senderID, "Bye bye 👋 I'll be available 24x7 if you need me.");
                   }
                flag = true;
            }
            else if(entities.hasOwnProperty('thanks')){
                User.findOneAndUpdate({fbid: senderID}, {$set: {"careline_count": 0}}, {upsert: false}, 
                function (err, user){});
                
                if(user.lang=="Ar"){
                       sengMsg(senderID, "شكراً لكِ! يمكنكِ التعرف على باقي خدماتنا على خط الرعاية");
                       }
                   else{
                       sengMsg(senderID, "You're welcome 😁! Feel free to explore more by playing around.");
                   }
                flag = true;
            }
            else if(entities.hasOwnProperty('greetings')){
                User.findOneAndUpdate({fbid: senderID}, {$set: {"careline_count": 0}}, {upsert: false}, 
                function (err, user){});
                greetings(senderID, user);
                flag = true;
            }

        }
        if(!flag){
            
            errors(senderID, user);
        }
    }
    /*
    English
    Arabic
    */
}

function payloadMessage(senderID, payload, user) {
    var botFlag=true;
    switch (payload) {
        case 'langEn':
            botFlag=false;
            User.findOneAndUpdate({fbid: senderID}, {$set: {"lang": "En"},$inc: {en_click:1}}, {upsert: false}, function (err, user) {
                if(!err){
                   engMenu(senderID, user);
                    
                   }
            });
            
            break;
        case 'langAr':
            var msg = "Coming Soon....";
            botFlag=false;
            User.findOneAndUpdate({fbid: senderID}, {$set: {"lang": "Ar"},$inc: {ar_click:1}}, {upsert: false}, function (err, user) {
                if(!err){
                   //sengMsg(senderID, msg);
                    arMenu(senderID, user);
                   }
            });
                
            break;
        case 'restart':
            welcomeMessage(senderID, user);
            botFlag=false;
            break;
        case 'getStarted':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"get_started_click": 1}},
                {upsert:false},
                function(err,user){

            });
            welcomeMessage(senderID, user);
            botFlag=false;
            break;
        case 'pregnancy':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"m_preg_click": 1}},
                {upsert:false},
                function(err,user){
                    if(user.lang=="Ar"){
                       pregnancy_optAr(senderID, user);
                       }
                   else{
                       pregnancy_opt(senderID, user);
                   }
            });
            
            botFlag=false;
            break;
        case 'Pre-Pregnancy_opt':
            botFlag=false;
            var msg = 'Pre-pregnancy tip: Good ways to increase your chances of getting pregnant are tracking your ovulation, cutting back on caffeine, trying to reduce stress in your daily life and quitting smoking.🤰';
            var msgAr = 'نصيحة لفترة ما قبل الحمل:\n' +"يمكنكِ اتباع بعض الطرق الجيدة لزيادة فرص الحمل مثل متابعة مواعيد التبويض، التقليل من الكافيين، محاولة التقليل من الإجهاد في حياتك اليومية، والإقلاع عن التدخين🤰";
            
            if(user.lang=="Ar"){
               sengMsg(senderID, msgAr);
                setTimeout(function () {
                    User.findOneAndUpdate(
                        {fbid:senderID},
                        {$set: {"lastAction":"Pre-Pregnancy_opt","pregnancy_type":"Pre-Pregnancy"},$inc: {"pre_preg_click": 1}},
                        {upsert:false},
                        function(err,user){
                            sengMsg(senderID, 'مواضيع قد تهمك...');

                            setTimeout(function () {
                                sendCourousel(senderID,carousel_data.pre_pregnancy,"Pre-Pregnancy");
                            }, delay);
                    });

                }, delay);
               }
           else{
               sengMsg(senderID, msg);
                setTimeout(function () {
                    User.findOneAndUpdate(
                        {fbid:senderID},
                        {$set: {"lastAction":"Pre-Pregnancy_opt","pregnancy_type":"Pre-Pregnancy"},$inc: {"pre_preg_click": 1}},
                        {upsert:false},
                        function(err,user){
                            sengMsg(senderID, 'Here are some topics that may interest you.');

                            setTimeout(function () {
                                sendCourousel(senderID,carousel_data.pre_pregnancy,"Pre-Pregnancy");
                            }, delay);
                    });

                }, delay);
           }
            //sengMsg(senderID, msg);
            
            break;
        case 'Pregnancy_opt':
            botFlag=false;
            var msg = 'Which trimester are you in?';
            var msgAr = 'في أي ثلث من الحمل انت الأن؟';
            if(user.lang=="Ar"){
                   sengMsg(senderID, msgAr);
                   }
               else{
                   sengMsg(senderID, msg);
            }
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"Pregnancy_opt","pregnancy_type":"Pregnancy"},$inc: {"preg_click": 1}},
                {upsert:false},
                function(err,user){
                    
                    sendCourousel2(senderID,carousel_data.pregnancy);
            });
            break;
        case 'weekly':
            botFlag=false;
            var msg = 'Nice, I will ping you weekly :)';
            var msgAr = 'جيد، سأرسل إليك رسالة كل شهر 😊 أو أقل من ذلك، إذا كان لدينا أخبار شيقة قد تهمك';
            
            if(user.subscription!="" && user.final_pregnancy_type=="Pregnancy"){
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"weekly","subscription":"weekly","subonoff":1,"final_pregnancy_type":user.pregnancy_type,"final_article_frequency":6,"article_frequency":6}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAr);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }

                });
               }
            else {
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"weekly","subscription":"weekly","subonoff":1,"final_pregnancy_type":user.pregnancy_type,"final_article_frequency":user.article_frequency}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAr);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }

                });
                
            }
            
            break;
        case 'monthly':
            botFlag=false;
            var msg = 'Great, I will ping you once in month :) Or if we have something really interesting for you will ping in between.';
            var msgAr = 'حسناً، سأرسل إليكِ إشعاراً أسبوعيا'+ ':)';
            if(user.subscription!="" && user.final_pregnancy_type=="Pregnancy"){
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"monthly","subscription":"monthly","subonoff":1,"final_pregnancy_type":user.pregnancy_type,"final_article_frequency":6,"article_frequency":6}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAr);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }
                });
            }
            else{
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"monthly","subscription":"monthly","subonoff":1,"final_pregnancy_type":user.pregnancy_type,"final_article_frequency":user.article_frequency}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAr);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }
                });
                
            }
            break;
        case 'email_us':
            var msg = 'Please type your email.';
            botFlag=false;
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"email_us"}},
                {upsert:false},
                function(err,user){
                    //sengMsg(senderID, msg);
            });
            break;
        case 'main_menu':
            botFlag=false;
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"main_menu"},$inc:{"main_menu_click":1}},
                {upsert:false},
                function(err,user){
                    if(user.lang=="Ar"){
                       arMenu(senderID, user);
                       }
                   else{
                       engMenu(senderID, user);
                   }
                    
            });
            break;
        case 'main_menu_menu':
            botFlag=false;
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"main_menu_menu"},$inc: {"menu_click": 1}},
                {upsert:false},
                function(err,user){
                    if(user.lang=="Ar"){
                       arMenu_menu(senderID, user);
                       }
                   else{
                       engMenu_menu(senderID, user);
                   }
                    
            });
            break;
        case '1st_trimester':
            botFlag=false;
            var msg = 'Fun fact about the 1st Trimester: Just six weeks into your pregnancy, your baby already has a heartbeat, yet only the size of a lentil.🤰';
            var msgAr = 'حقائق شيقة عن الثلث الأول من الحمل:\n'+"عند الأسبوع 6 من الحمل يصبح لدى طفلك نبضات قلب ولا يزال حجمه لا يتجاوز حبة العدس🤰";
            //sengMsg(senderID, msg);
            if(user.lang=="Ar"){
                   sengMsg(senderID, msgAr);
                   }
               else{
                    sengMsg(senderID, msg);
               }
            setTimeout(function () {
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"1st_trimester"},$inc: {"trim_1st_click": 1}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, 'في أي أسبوع من الحمل أنتِ؟');
                           }
                       else{
                            sengMsg(senderID, 'Which week are you in?');
                       }
                        
                        setTimeout(function () {
                            sendCourousel(senderID,carousel_data.trimester1st,"Pregnancy");
                        }, delay);
                    });
            }, delay);
            break;
        case '2nd_trimester':
            botFlag=false;
            var msg = 'Fun fact about the 2nd Trimester: 13 weeks into your pregnancy, your baby has his own unique fingerprints, and is about the size of a large plum.🤰';
            var msgAr = 'حقائق شيقة عن الثلث الثانى من الحمل:\n'+'عند الأسبوع 13 من الحمل يظهر لطفلك بصمات أصابع مميزة وهو الآن بحجم ثمرة برقوق كبيرة تقريبا🤰';
            if(user.lang=="Ar"){
                   sengMsg(senderID, msgAr);
                   }
               else{
                    sengMsg(senderID, msg);
               }
            setTimeout(function () {
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"2nd_trimester"},$inc: {"trim_2nd_click": 1}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, 'في أي أسبوع من الحمل أنتِ؟');
                           }
                       else{
                            sengMsg(senderID, 'Which week are you in?');
                       }
                        
                        setTimeout(function () {
                            sendCourousel(senderID,carousel_data.trimester2nd,"Pregnancy");
                        }, delay);
                        
                });
            }, delay);
            break;
        case '3rd_trimester':
            botFlag=false;
            var msg = 'Fun fact about the 3rd Trimester: Your unborn baby’s eyes are open, and in addition to distinguishing light from dark he learns to focus.🤰';
            var msgAr = 'حقائق شيقة عن الثلث الثالث من الحمل:\n'+'بدأ طفلك في فتح عينيه وتمييز الضوء من الظلام وتعلُّم كيفية التركيز🤰';
            if(user.lang=="Ar"){
                   sengMsg(senderID, msgAr);
                   }
               else{
                    sengMsg(senderID, msg);
               }
            setTimeout(function () {
                User.findOneAndUpdate(
                    {fbid:senderID},
                    {$set: {"lastAction":"3rd_trimester"},$inc: {"trim_3rd_click": 1}},
                    {upsert:false},
                    function(err,user){
                        if(user.lang=="Ar"){
                           sengMsg(senderID, 'في أي أسبوع من الحمل أنتِ؟');
                           }
                       else{
                            sengMsg(senderID, 'Which week are you in?');
                       }
                        
                        setTimeout(function () {
                            sendCourousel(senderID,carousel_data.trimester3rd,"Pregnancy");
                        }, delay);
                });
            }, delay);
            break;
        case '1st_trimester_more':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"trim_1st_more_click": 1}},
                {upsert:false},
                function(err,user){
            });
           sendCourousel(senderID,carousel_data.trimester1st_more,"Pregnancy");
            botFlag=false;
            break;
        case '2nd_trimester_more':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"trim_2nd_more_click": 1}},
                {upsert:false},
                function(err,user){
            });
            //var msg = "How about…";
            botFlag=false;
            if(user.lang=="Ar"){
               sengMsg(senderID, 'ماذا عن'+'…');
               }
           else{
                sengMsg(senderID, 'How about…');
           }
            
           sengMsg(senderID, msg);
            setTimeout(function () {
                sendCourousel(senderID,carousel_data.trimester2nd_more,"Pregnancy");
            }, 3000);
            break;
        case '3rd_trimester_more':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"trim_3rd_more_click": 1}},
                {upsert:false},
                function(err,user){
            });
           //var msg = "How about…";
            botFlag=false;
           if(user.lang=="Ar"){
               sengMsg(senderID, 'ماذا عن'+'…');
               }
           else{
                sengMsg(senderID, 'How about…');
           }
            setTimeout(function () {
                sendCourousel(senderID,carousel_data.trimester3rd_more,"Pregnancy");
            }, 3000);
            break;
        case '2nd_more':
           sendCourousel(senderID,carousel_data.trimester2nd2,"Pregnancy");
            botFlag=false;
            break;
        case '3rd_more':
           sendCourousel(senderID,carousel_data.trimester3rd2,"Pregnancy");
            botFlag=false;
            break;
        case 'talkHuman':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"careline_click": 1}},
                {upsert:false},
                function(err,user){
            });
           handle_talktohuman(senderID, user);
            botFlag=false;
            break;
        case 'talkHuman_m':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"careline_m_click": 1}},
                {upsert:false},
                function(err,user){
            });
           handle_talktohuman(senderID, user);
            botFlag=false;
            break;
        case 'turnBotOn':
            break;
        case 'ratebot':
            break;
        case 'm_alert':
            User.findOneAndUpdate(
                {fbid:senderID},
                {$inc: {"subscription_click": 1}},
                {upsert:false},
                function(err,user){
            });
            manage_alerts(senderID, user);
            botFlag=false;
            break;
        case 'msg_on':
            botFlag=false;
            var msg= 'You can always opt out by selecting manage subscriptions in the settings.';
            var msgAR= 'يمكنكِ دائماً إلغاء الاشتراك عن طريق اختيار التحكم في الاشتراكات من قائمة الإعدادات';
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"msg_on","subonoff":1}},
                {upsert:false},
                function(err,user){
                    setTimeout(function () {
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAR);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }
                    }, 3000)
            });
            break;
        case 'msg_off':
            botFlag=false;
            var msg= 'No problem,you can always opt in by selecting manage subscriptions in the settings.';
            var msgAr= 'يمكنكِ دائماً الاشتراك عن طريق اختيار التحكم في الاشتراكات من قائمة الإعدادات';
            User.findOneAndUpdate(
                {fbid:senderID},
                {$set: {"lastAction":"msg_on","subonoff":0}},
                {upsert:false},
                function(err,user){
                    setTimeout(function () {
                        if(user.lang=="Ar"){
                           sengMsg(senderID, msgAr);
                           }
                       else{
                           sengMsg(senderID, msg);
                       }
                    }, 3000)
            });
            break;
        default:
            break;
    }
    if(!botFlag && user.offBot==1){
        User.findOneAndUpdate(
            {fbid:senderID},
            {$set: {"lastPayload":"",offBot:0,careline_count:0}},
            {upsert:false},
            function(err,user){
            }
        );     
       }
}

function sendMail(fbid,topic,email,message,fname,lname){
    
    sgMail.setApiKey("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");
    const msg1 = {
      to: 'careline@apta-advice.com',
      from: email,
      subject: topic,
      text: message,
      html: '<strong>'+message+'</strong>',
    };
    sgMail.send(msg1);
    
    User.findOneAndUpdate(
            {fbid:senderID},
            {$set: {"lastPayload":"",offBot:0,careline_count:0}},
            {upsert:false},
            function(err,user){
                if(user.lang=="Ar"){
                   setTimeout(function () {
                        sengMsg(fbid, "شكراً على رسالتك. رسالتك بأمان معنا وسيتم التواصل معك قريباً");
                    }, 1000);
                   }
               else{
                   setTimeout(function () {
                        sengMsg(fbid, "Thanks for your email, your message is safe with us and will be dealt with as soon as possible.");
                    }, 1000);
               }
            }
        ); 
    
    
    var newUpdate = email_data();
        newUpdate.fbid =fbid;
        newUpdate.topic = topic;
        newUpdate.email = email;
        newUpdate.name = fname;
        newUpdate.lname = lname;
        newUpdate.message = message;
        newUpdate.save(function(err,user){
            if(!err){
                //getData(senderID);
            }
        });
    
}

function sendMail1(topic,email,message,fname,lname){
    
    sgMail.setApiKey("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");
    const msg1 = {
      to: 'careline@apta-advice.com',
      from: email,
      subject: topic,
      text: message,
      html: '<strong>'+message+'</strong>',
    };
    sgMail.send(msg1);
    
    var newUpdate = email_data();
        newUpdate.topic = topic;
        newUpdate.email = email;
        newUpdate.name = fname;
        newUpdate.lname = lname;
        newUpdate.message = message;
        newUpdate.save(function(err,user){
            if(!err){
                //getData(senderID);
            }
        });
    
    /*setTimeout(function () {
        sengMsg(fbid, "Thanks for your email, your message is safe with us and will be dealt with as soon as possible.");
    }, 1000);*/
}

function push_notification(obj){
   // console.log("c");
    SendUpdate.findOneAndUpdate(
        {_id:obj._id},
        {$set: {"status":0}},
        {upsert:false},
        function(err,user){
           // console.log("d");
            if(!err){
               // console.log("f");
                User.findOneAndUpdate(
                {fbid:obj.fbid},
                {$set: {"pregnancy_type":obj.fuction_name,offBot:0,careline_count:0}},
                {upsert:false},
                function(err,user){
                  //  console.log("g");
                    if(user.subscription=="" || user.subonoff==0){
                        subscription_opt1(obj.fbid,user);
                        //console.log("g1");
                       }
                    else{
                        if(user.lang=="Ar"){
                            sengMsg(obj.fbid, "نتمنى أن تكوني قد استمتعتِ بقراءة المقال"+"😊");
                           }
                       else{
                           sengMsg(obj.fbid, "Hope you enjoyed the article 😊");
                       }
                        
                    }
                    send_data_array.shift();
                    send_data_flag = true;
                    
                });
               }
        });
}

function talk_to_human_auto_reply(obj){
    //return;
    User.findOne({fbid: obj.fbid}).exec(function(err,user){
        if(!err){
            if(user != null){
                if(user.lang=="Ar"){
                    sengMsg(obj.fbid, 'جميع خبيراتنا مشغولون الآن بالرد على استفسارات عملاء آخرين. سنعاود التواصل معك في أقرب وقت ممكن.');
                   }
               else{
                   sengMsg(obj.fbid, "All our careline representatives are busy attending other customers. We will get back to you shortly.");
               }
            
            SendUpdate.findOneAndUpdate(
            {_id:obj._id},
            {$set: {"status":0}},
            {upsert:false},
            function(err,user){
               // console.log("d");
                send_data_array.shift();
                send_data_flag = true;
        
            });

            }
        }
    });
}

function handle_talktohuman(senderID, user){
    //console.log("1");
    var date = new Date();
    var current_hour = date.getHours();
    var current_day = date.getDay();
    //console.log("time:"+current_hour);
    
    if(current_day == 5 || current_hour>=18 || current_hour<8){
       email_after_time(senderID, user);
       }
    else{
        //console.log("2");
        var newUpdate = SendUpdate();
        newUpdate.fbid = senderID;
        newUpdate.msg_type = "tth";
        newUpdate.send_time = moment(date).add(1, 'm');//current time+15min
        newUpdate.status = 1;
        newUpdate.save(function(err,user){
            //console.log("3");
            if(!err){
               // console.log("4");
                //getData(senderID);
                talkHuman(senderID, user);
            }
        });
        //talkHuman(senderID, user);
        
    }
}

function email_after_time(senderID, user){
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Thank you for contacting us  😊 We are currently unavailable to take your message. You can email us your query at careline@apta-advice.com now or contact us during business hours from Saturday to Thursday 8am to 6pm.",
                "buttons": [
                    {
                        "type": "web_url",
                        "title": "Email us",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/email/"+senderID,
                        "webview_height_ratio": "full"
                    }
                ]
            }
        }
    };
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "شكراً على تواصلكِ معنا  😊 نحن غير متاحين الآن للرد على رسالتكِ. يمكنكِ إرسال استفساركِ الآن عبر البريد الإلكتروني careline@apta-advice.com  أو التواصل معنا في أوقات العمل من السبت إلى الخميس من الساعة 8 صباحاً حتى 6 مساءً.",
                "buttons": [
                    {
                        "type": "web_url",
                        "title": "راسلينا عبر الإيميل",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/email/"+senderID,
                        "webview_height_ratio": "full"
                    }
                ]
            }
        }
    };
    
    if(user.lang=="Ar"){
           GlobalData.sendGenericMessageFb(senderID, messageObjAr);
           }
       else{
           GlobalData.sendGenericMessageFb(senderID, messageObj);
       }
    
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function manage_alerts(senderID, user){
    if((user.subscription=="weekly" || user.subscription=="monthly") && user.subonoff==1 ){
            var messageObj = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "You have signed up for "+user.subscription+" Updates.",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Keep messages on",
                            "payload": "msg_on"
                        },
                        {
                            "type": "postback",
                            "title": "Turn messages off",
                            "payload": "msg_off"
                        }
                    ]
                }
            }
        };
        
        var subs="شهرياً";
        if(user.subscription=="monthly"){
           subs="أسبوعياً";
           }
        
        var messageObjAr = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": subs+"تم التسجيل لموافاتك بآخر التحديثات",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "إبقاء الرسائل مفعلة",
                            "payload": "msg_on"
                        },
                        {
                            "type": "postback",
                            "title": "إلغاء تفعيل الرسائل",
                            "payload": "msg_off"
                        }
                    ]
                }
            }
        };
        if(user.lang=="Ar"){
            GlobalData.sendGenericMessageFb(senderID, messageObjAr);
            }
        else{
            GlobalData.sendGenericMessageFb(senderID, messageObj);
        }



        //GlobalData.sendGenericMessageFb(senderID, messageObj);
        User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
       }
    else{
        //sengMsg(senderID, msg);
        if(user.lang=="Ar"){
            sengMsg(senderID, "لم يتم التسجيل لموافاتك بآخر التحديثات");
           }
       else{
           sengMsg(senderID, "You have not signed up for Updates.");
       }
        setTimeout(function () {
            subscription_opt(senderID, user);
        }, 3000);
    }
}

function welcomeMessage(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Please click on your preferred language.",
                "buttons": [{
                        "type": "postback",
                        "title": "English",
                        "payload": "langEn"
                    },
                    {
                        "type": "postback",
                        "title": "Arabic",
                        "payload": "langAr"
                    }
                ]
            }
        }
    };
    
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "قبل أن نبدأ ما هي لغتك المفضلة؟",
                "buttons": [{
                        "type": "postback",
                        "title": "الإنجليزية",
                        "payload": "langEn"
                    },
                    {
                        "type": "postback",
                        "title": "العربية",
                        "payload": "langAr"
                    }
                ]
            }
        }
    };
    
    if(user.lang=="En"){ 
        setTimeout(function () {
         
            sengMsg(senderID, "Hello " + user.first_name + "!\nI am Abeer from Apta Advice Careline and I'm here to help with all questions related to motherhood and childhood.");
//            setTimeout(function () {
//                sengMsg(senderID, "During our conversation, I will be guiding you to the information you need based on the options you select next.");
                setTimeout(function () {
                    GlobalData.sendGenericMessageFb(senderID, messageObj);
                }, 2000)
            //}, 2000)
        }, 2000)
    }
    else{
        setTimeout(function () {
            sengMsg(senderID,  "!"+user.first_name + " مرحباً بك\n"+" أنا عبير خبيرة الرعاية من أبتا-أدفيس وأنا هنا للإجابة على جميع استفساراتك المتعلقة بالأمومة والطفولة");
//            setTimeout(function () {
//                sengMsg(senderID, "خلال محادثتنا، سوف أقوم بتوجيهك الى المعلومات التي تحتاجينها بناءً على الإعدادات التي ستختارينها بعد ذلك");
                setTimeout(function () {
                    GlobalData.sendGenericMessageFb(senderID, messageObjAr);
                }, 2000)
            //}, 2000)
        }, 2000)
    }
    
    
    
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "welcomeMessage","offBot":0}}, {upsert: false}, function (err, user) {});
}

function engMenu(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "We have so many valuable and interesting tips to share with you today! Please click on what you would like to know more about.",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pregnancy",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "Motherhood",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Contact experts",
                        "payload": "talkHuman"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}

function arMenu(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "كيف يمكنني مساعدتك اليوم؟ لدينا الكثير من المعلومات القيمة والشيقة لنشاركك إياها... أخبرينا عن اي مرحلة تودين أن تعرفي المزيد؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "الحمل",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "الأمومة",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dobar/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "تحدثي مع خبيراتنا",
                        "payload": "talkHuman"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}

function engMenu_menu(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Welcome back "+user.first_name+". Hope you are doing well. How can I help you today?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pregnancy",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "Motherhood",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+senderID,
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
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}

function arMenu_menu(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": user.first_name+" أهلاً\n"+"نتمنى أن تكوني بخير. كيف يمكننا مساعدتك اليوم؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "الحمل",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "الأمومة",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dobar/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "تحدثي مع خبيراتنا",
                        "payload": "talkHuman"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}


function greetings(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Hi there, what would you like to know about?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pregnancy",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "Motherhood",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+senderID,
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
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "أهلاً بكِ، ما الذي تريدين الاستفسار عنه؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "الحمل",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "الأمومة",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dobar/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "تحدثي مع خبيراتنا",
                        "payload": "talkHuman"
                    }
                ]
            }
        }
    };
    
    if(user.lang=="Ar"){
        GlobalData.sendGenericMessageFb(senderID, messageObjAr);          
       }
   else{

    GlobalData.sendGenericMessageFb(senderID, messageObj);
   }
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}

function errors(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Not sure I understand what you are saying. What would  you like to know about?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pregnancy",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "Motherhood",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+senderID,
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
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "تعذر علينا فهم ما تقصدين. ما الذي تريدين الاستفسار عنه؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "الحمل",
                        "payload": "pregnancy"
                    },
                    {
                        "type": "web_url",
                        "title": "الأمومة",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/dob/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "تحدثي مع خبيراتنا",
                        "payload": "talkHuman"
                    }
                ]
            }
        }
    };
    
    
    if(user.careline_count==2){
       User.findOneAndUpdate({fbid: senderID}, {$set: {"careline_count": 0}}, {upsert: false}, 
            function (err, user){
                if(!err){
                   talkHumanForError(senderID, user);
                   }
            });
       }
    else{
        User.findOneAndUpdate({fbid: senderID}, {$inc: {"careline_count": 1}}, {upsert: false}, 
            function (err, user){
                if(!err){
                   
                        if(user.lang=="Ar"){
                            GlobalData.sendGenericMessageFb(senderID, messageObjAr);
                           }
                       else{
                           GlobalData.sendGenericMessageFb(senderID, messageObj);
                       }
                   }
            });
    }
    //User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "engMenu",}}, {upsert: false}, function (err, user) {});
}



function pregnancy_opt(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Where are you on your journey?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pre-Pregnancy",
                        "payload": "Pre-Pregnancy_opt"
                    },
                    {
                        "type": "postback",
                        "title": "Pregnancy",
                        "payload": "Pregnancy_opt"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function pregnancy_optAr(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "في أي مرحلة أنت الان في رحلتك؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "فترة ما قبل الحمل",
                        "payload": "Pre-Pregnancy_opt"
                    },
                    {
                        "type": "postback",
                        "title": "الحمل",
                        "payload": "Pregnancy_opt"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function subscription_opt(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Would you like to subscribe to our updates?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Weekly",
                        "payload": "weekly"
                    },
                    {
                        "type": "postback",
                        "title": "Monthly",
                        "payload": "monthly"
                    }
                ]
            }
        }
    };
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "هل تريدين الاشتراك كي تصلك آخر التحديثات؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "شهرياً",
                        "payload": "weekly"
                    },
                    {
                        "type": "postback",
                        "title": "أسبوعياً",
                        "payload": "monthly"
                    }
                ]
            }
        }
    };
    if(user.lang=="Ar"){
            GlobalData.sendGenericMessageFb(senderID, messageObjAr);
           }
       else{
           GlobalData.sendGenericMessageFb(senderID, messageObj);
       }
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function subscription_opt1(senderID,user) {
    //console.log("h");
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Hope you enjoyed the article. Would you like to subscribe to our updates?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Weekly",
                        "payload": "weekly"
                    },
                    {
                        "type": "postback",
                        "title": "Monthly",
                        "payload": "monthly"
                    }
                ]
            }
        }
    };
    
    var messageObjAr = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "نتمنى أن تكوني قد استمتعتِ بقراءة المقال. هل تريدين الاشتراك كي تصلك آخر التحديثات؟",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "شهرياً",
                        "payload": "weekly"
                    },
                    {
                        "type": "postback",
                        "title": "أسبوعياً",
                        "payload": "monthly"
                    }
                ]
            }
        }
    };
    
    if(user.lang=="Ar"){
            GlobalData.sendGenericMessageFb(senderID, messageObjAr);
           }
       else{
           GlobalData.sendGenericMessageFb(senderID, messageObj);
       }
    
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function talk_human_mum_opy(senderID, user) {
    var messageObj = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Would you like to talk to a real human mum?",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Contact our careline",
                        "payload": "talkHuman"
                    },
                    {
                        "type": "web_url",
                        "title": "Email us",
                        "url":"https://danone-apta-advice.herokuapp.com/fb/email/"+senderID,
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Main Menu",
                        "payload": "main_menu"
                    }
                ]
            }
        }
    };
    GlobalData.sendGenericMessageFb(senderID, messageObj);
    User.findOneAndUpdate({fbid: senderID}, {$set: {"lastAction": "Pregnancy",}}, {upsert: false}, function (err, user) {});
}

function sendCourousel(senderID,items,p_type){
   var elements= [];
    //console.log("sendCourousel");
    User.findOneAndUpdate(
        {fbid:senderID},
        {$set: {"lastAction":"sent_courosel"}},
        {upsert:false},
        function(err,user){
            setTimeout(function () {
                if(user.lang=="Ar"){
                        for(var i=0;i<items.length;i++)
                           {
                               if(items[i].type=='btn'){
                                    elements[i] = {
                                       "title": items[i].ar,
                                       "image_url": items[i].image,
                                       "buttons": [
                                           {
                                               "title": "اختيار",
                                               "type": "postback",
                                               "payload":items[i].url
                                           }
                                       ]
                                   };
                                  }
                               else if(items[i].type=='subs'){
                                    elements[i] = {
                                       "title": items[i].ar,
                                       "image_url": items[i].image,
                                       "buttons": [
                                           {
                                                "type": "postback",
                                                "title": "شهرياً",
                                                "payload": "weekly"
                                            },
                                            {
                                                "type": "postback",
                                                "title": "أسبوعياً",
                                                "payload": "monthly"
                                            }
                                       ]
                                   };
                                  }
                              else{
                                  let imgUrl = items[i].image;
                                  if(items[i].hasOwnProperty('arImage')){
                                      imgUrl = items[i].arImage;
                                    }

                                  elements[i] = {
                                   "title": items[i].ar,
                                   "image_url": imgUrl,/*
                                    "default_action": {
                                      "type": "web_url",
                                      "url": "https://danone-apta-advice.herokuapp.com/fb/res_url?id="+senderID+"&url="+items[i].url+"&p_type="+p_type,
                                      "webview_height_ratio": "tall",
                                    },*/
                                   "buttons": [
                                       {
                                           "title": "اضغطي للقراءة",
                                           "type": "web_url",
                                           "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+senderID+"&url="+items[i].urlAr+"&p_type="+p_type+"&t_type="+items[i].langAr,
                                            "webview_height_ratio": "full"
                                       }
                                   ]
                               };
                              }
                               
                           }
                   }
                else{
                        for(var i=0;i<items.length;i++)
                           {
                               if(items[i].type=='btn'){
                                   elements[i] = {
                                       "title": items[i].eng,
                                       "image_url": items[i].image,
                                       "buttons": [
                                           {
                                               "title": "Select",
                                               "type": "postback",
                                               "payload":items[i].url
                                           }
                                       ]
                                   };
                               }
                               else if(items[i].type=='subs'){
                                    elements[i] = {
                                       "title": items[i].eng,
                                       "image_url": items[i].image,
                                       "buttons": [
                                           {
                                                "type": "postback",
                                                "title": "Weekly",
                                                "payload": "weekly"
                                            },
                                            {
                                                "type": "postback",
                                                "title": "Monthly",
                                                "payload": "monthly"
                                            }
                                       ]
                                   };
                                  }
                               else{
                                   elements[i] = {
                                       "title": items[i].eng,
                                       "image_url": items[i].image,/*
                                       "default_action": {
                                          "type": "web_url",
                                          "url": "https://danone-apta-advice.herokuapp.com/fb/res_url?id="+senderID+"&url="+items[i].url+"&p_type="+p_type,
                                          "webview_height_ratio": "tall",
                                        },*/
                                       "buttons": [
                                           {
                                               "title": "Click to read",
                                               "type": "web_url",
                                               "url":"https://danone-apta-advice.herokuapp.com/fb/res_url?id="+senderID+"&url="+items[i].url+"&p_type="+p_type+"&t_type="+items[i].langEn,
                                                "webview_height_ratio": "full"

                                           }
                                       ]
                                   };
                               }
                               
                               
                               
                           }
                   }
                
                var messageObj ={
                   "attachment":{
                       "type":"template",
                       "payload":{
                           "template_type":"generic",
                           "elements":elements
                       }
                   }
               }
                GlobalData.sendGenericMessageFb(senderID, messageObj);
            }, 1000);
    });
    
}

function sendCourousel2(senderID,items){
   var elements= [];
    //console.log("sendCourousel");
    User.findOneAndUpdate(
        {fbid:senderID},
        {$set: {"lastAction":"sent_courosel"}},
        {upsert:false},
        function(err,user){
            setTimeout(function () {
                if(user.lang=="Ar"){
                        for(var i=0;i<items.length;i++)
                           {
                               elements[i] = {
                                   "title": items[i].ar,
                                   "image_url": items[i].image,
                                   "buttons": [
                                       {
                                           "title": "اختيار",
                                           "type": "postback",
                                           "payload": items[i].payload
                                       }
                                   ]
                               };
                           }
                   }
                else{
                        for(var i=0;i<items.length;i++)
                           {
                               elements[i] = {
                                   "title": items[i].eng,
                                   "image_url": items[i].image,
                                   "buttons": [
                                       {
                                           "title": "Select",
                                           "type": "postback",
                                           "payload": items[i].payload
                                           
                                       }
                                   ]
                               };
                           }
                   }
                
                var messageObj ={
                   "attachment":{
                       "type":"template",
                       "payload":{
                           "template_type":"generic",
                           "elements":elements
                       }
                   }
               }
                GlobalData.sendGenericMessageFb(senderID, messageObj);
            }, 1000);
    });
    
}

function sengMsg(senderID, msg){
    GlobalData.sendTextMessageFB(senderID, msg);
}

function month0_3(senderID,user){
    var msg = "Fun fact about a 0-3 months old baby: Between birth and three months your little one will start focusing on objects and respond to funny faces.🤱";
    var msgAr = ' حقائق شيقة عن الطفل في عمر 0-3 شهور:\n'+'سيبدأ طفلك الصغير بعد ولادته وحتى عمر 3 أشهر بالتركيز على الأشياء والتفاعل مع الوجوه المضحكة🤱';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth0_3,"Motherhood:0_3");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth0_3,"Motherhood:0_3");

                }, delay);
            }, delay);
       }
}

function month4_6(senderID,user){
    var msg = "Fun fact about a 4-6 months old baby: Your baby’s mobility increases and he begins to communicate through smiles, squeals and movements.🤱";
    var msgAr = ' حقائق شيقة عن الطفل في عمر4-6 أشهر:\n'+'يزداد نشاط طفلك ويبدأ بالتواصل عن طريق الابتسامات والصراخ والحركة🤱';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth4_6,"Motherhood:4_6");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth4_6,"Motherhood:4_6");

                }, delay);
            }, delay);
       }
}

function month7_9(senderID,user){
    var msg = "Fun fact about a 7-9 months old baby: Your little one begins to realise that he is a separate person. He will start to identify his own desires and feelings. 👶🏻";
    var msgAr = ' حقائق شيقة عن الطفل في عمر7-9 أشهر:\n'+'يبدأ طفلك بإدراك أنه شخص مستقل.يبدأ في تحديد رغباته ومشاعره الخاصة👶';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth7_9,"Motherhood:7_9");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth7_9,"Motherhood:7_9");

                }, delay);
            }, delay);
       }
}

function month10_12(senderID,user){
    var msg = "Fun fact about a 10-12 months old baby: Your baby will probably be able to pull himself up to standing, clapping his hands and picking up food to feed himself. 👶🏻";
    var msgAr = ' حقائق شيقة عن الطفل في عمر 10-12 شهراً:\n'+'قد يصبح طفلك قادراً على سحب جسمه والوقوف والتصفيق والتقاط الطعام لإطعام نفسه👶';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth10_12,"Motherhood:10_12");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.mth10_12,"Motherhood:10_12");

                }, delay);
            }, delay);
       }
}

function oneYr(senderID,user){
    var msg = "Fun fact about a 1 year old baby: This is the exciting period where your child's understanding and use of words builds rapidly.";
    var msgAr = 'حقائق شيقة عن الطفل في عمر السنة:\n'+'هذه هي الفترة الأكثر متعة والتي يبدأ فيها طفلكِ بفهم واستخدام  الكلمات بسرعة';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr1,"Motherhood:oneYr");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr1,"Motherhood:oneYr");

                }, delay);
            }, delay);
       }
}

function twoYr(senderID,user){
    var msg = "Fun fact about a 2 year old baby: This is the exciting period where your child's understanding and use of words builds rapidly.";
    var msgAr = 'حقائق شيقة عن الطفل في عمر السنتين:\n'+'هذه هي الفترة الأكثر متعة والتي يبدأ فيها طفلكِ بفهم واستخدام  الكلمات بسرعة';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr2,"Motherhood:twoYr");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr2,"Motherhood:twoYr");

                }, delay);
            }, delay);
       }
    
}

function threeYr(senderID,user){
    var msg = "Fun fact about a 3 year old baby: This is the exciting period where your child's understanding and use of words builds rapidly.";
    var msgAr = 'حقائق شيقة عن الطفل في عمر 3 سنوات:\n'+'هذه هي الفترة الأكثر متعة والتي يبدأ فيها .طفلكِ بفهم واستخدام  الكلمات بسرعة';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr3,"Motherhood:threeYr");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.yr3,"Motherhood:threeYr");

                }, delay);
            }, delay);
       }
}

function pre_school(senderID,user){
    var msg = "Fun fact about a Pre-schooler: Kids at that age can be a handful. It's when they begin to understand that they're separate from adults and are trying to define themselves.👧";
    var msgAr = 'حقائق شيقة عن الطفل في مرحلة ما قبل المدرسة:\n'+'يصعب السيطرة على الأطفال في هذا العمر حيث يبدأ الأطفال بفهم أنهم أشخاص مستقلين عن الكبار ويحاولون التعبير عن أنفسهم'+'👧';
    if(user.lang=="Ar"){
           sengMsg(senderID, msgAr);
            setTimeout(function () {
                sengMsg(senderID, 'إليكِ بعض المعلومات التي قد تفيدك في هذه الفترة');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.pre_school,"Motherhood:pre_school");

                }, delay);
            }, delay);
           }
       else{
            sengMsg(senderID, msg);
            setTimeout(function () {
                sengMsg(senderID, 'Here is some information you might find useful for now.');
                setTimeout(function () {
                sendCourousel(senderID,carousel_data.pre_school,"Motherhood:pre_school");

                }, delay);
            }, delay);
       }
}

function talkHuman(senderID, user) {
    //console.log("5");
    User.findOne({fbid: senderID}).exec(function(err,user_data){
        if(!err){
                    if (user_data.lang == "En") {
                        GlobalData.sendTextMessageFB(senderID, 'Our careline team would love to talk to you. Our team consists of real mums who will be delighted to answer all your questions from Saturday to Thursday 8am to 6pm. Please stay connected, someone will be assisting you soon 😊');
                        //GlobalData.sendTextMessageFB(senderID, 'Thanks for messaging us. We are closed for the Eid occasion. We\'ll get back to you soon. Best wishes, Apta-Advice team.');
                        //console.log("6");
                        let timeStamp = new Date();
                        User.findOneAndUpdate(
                            { fbid: senderID },
                            { $set: { "lastAction": "talkHuman", offBot: 1, lastBotChat: timeStamp } },
                            { upsert: false },
                            function (err, user) {
                                if (!err){
                                    if(user != null){
                                         var data = {
                                             "fbid": senderID,
                                             "msgType": "new thread",
                                             "msg": "new thread",
                                             "from": user.first_name
                                         };
                                         TalkToAHumanController.sendMessage(data);
                                    }
                                }
                            }
                        );
                    }
                else{
                     GlobalData.sendTextMessageFB(senderID, 'فريقنا من الخبيرات يسعدهن التحدث معكِ. يضم فريقنا مجموعة من الأمهات اللاتي سيكون من دواعي سرورهن الإجابة على استفساراتكن من السبت إلى الخميس من الساعة 8 صباحاً حتى 6 مساءً.  ابقي على اتصال معنا، ستتواصل معكِ إحدى خبيراتنا بعد قليل😊');
                     //GlobalData.sendTextMessageFB(senderID, 'شكراً لمراسلتكِم لنا، نحن غير موجودون حالياً بسبب عطلة العيد. وسوف نرد على استفساراتكم قريباً،  مع تحيات فريق أبتا أدفيس');
                       // console.log("6");
                        let timeStamp = new Date();
                        User.findOneAndUpdate(
                            { fbid: senderID },
                            { $set: { "lastAction": "talkHuman", offBot: 1, lastBotChat: timeStamp } },
                            { upsert: false },
                            function (err, user) {
                                if (!err){
                                    if(user != null){
                                         var data = {
                                             "fbid": senderID,
                                             "msgType": "new thread",
                                             "msg": "new thread",
                                             "from": user.first_name
                                         };
                                         TalkToAHumanController.sendMessage(data);
                                    }
                                }
                            }
                        );
                }
            }
    });
                
}

function talkHumanForError(senderID, user) {
    //console.log("5");
    User.findOne({fbid: senderID}).exec(function(err,user_data){
        if(!err){
                    if (user_data.lang == "En") {
                        GlobalData.sendTextMessageFB(senderID, 'Please be patient while we connect you to our Careline.');
                        //console.log("6");
                        let timeStamp = new Date();
                        User.findOneAndUpdate(
                            { fbid: senderID },
                            { $set: { "lastAction": "talkHuman", offBot: 1, lastBotChat: timeStamp } },
                            { upsert: false },
                            function (err, user) {
                                if (!err){
                                    if(user != null){
                                         var data = {
                                             "fbid": senderID,
                                             "msgType": "new thread",
                                             "msg": "new thread",
                                             "from": user.first_name
                                         };
                                         TalkToAHumanController.sendMessage(data);
                                    }
                                }
                            }
                        );
                    }
                else{
                     GlobalData.sendTextMessageFB(senderID, "يرجى الاتظار حتى يتم توصيلك بفريقنا من الخبرات");
                        //console.log("6");
                        let timeStamp = new Date();
                        User.findOneAndUpdate(
                            { fbid: senderID },
                            { $set: { "lastAction": "talkHuman", offBot: 1, lastBotChat: timeStamp } },
                            { upsert: false },
                            function (err, user) {
                                if (!err){
                                    if(user != null){
                                         var data = {
                                             "fbid": senderID,
                                             "msgType": "new thread",
                                             "msg": "new thread",
                                             "from": user.first_name
                                         };
                                         TalkToAHumanController.sendMessage(data);
                                    }
                                }
                            }
                        );
                }
            }
    });
                
}

module.exports = app;
//GlobalData.sendGenericMessageFb
//GlobalData.sendTextMessageFB