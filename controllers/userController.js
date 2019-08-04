const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const sanitize = require('mongo-sanitize');
const passport = require('passport');
const moment = require('moment');
const uniqid = require('uniqid');
//const request = require('request');

const UserLogin = require('../models/UserLogin.model');
const UserChat = require('../models/UserChat.model');
const ChatHistory = require('../models/ChatHistory.model');
const globalData = require('./GlobalData');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/',
        failureRedirect: '/user/login?err=yes',
        failureFlash: false
    })(req, res, next);
});

router.get('/logout', (req, res) =>  {
    req.logout();
    //req.flash('success', 'You are logged out');
    res.redirect('/user/login');
});

router.get('/', globalData.ensureAuthenticated, (req, res) => {
    var page = req.params.page || 1;
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    UserChat.paginate({
        'status': 1
    }, {
        page: page,
        limit: 25,
        sort: {
            started_at: 1
        }
    }, (err, result) => {
        result.moment = moment;
        res.render('index', result);
    });
});

router.get('/oldChats/:page?', globalData.ensureAuthenticated, (req, res) => {
    var page = req.params.page || 1;
    console.log("page",page);
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    UserChat.paginate({
        'status': 0
    }, {
        page: page,
        limit: 25,
        sort: {
            started_at: 1
        }
    }, (err, result) => {
        result.moment = moment;
        res.render('oldChats', result);
    });
});

 /* router.get('/chats/:platform/:page?', globalData.ensureAuthenticated, (req, res) => {
    var platform  = req.params.platform;
    if (platform == "fb" || platform == "web"){
        let platformObj = {"fb":1,"web":2};
        var page = req.params.page || 1;
        if (isNaN(page) || page<1){
            page = 1;
        }
        UserChat.paginate(
            { 'platform': platformObj[platform], 'status': 1 }, 
            { page: page, limit: 25, sort: { started_at:1} }, (err, result) => {
            result.platform = platform;
            result.moment = moment;
            res.render('allChats',result);
        });
    }
    else{
        res.redirect('/user/');
    }
}); */

router.get('/chat/:fbid', globalData.ensureAuthenticated, (req, res) => {
    ChatHistory.find({ "fbid": req.params.fbid}, (err, chats) => {
        if (err){
            return res.redirect('/user/');
        }
        var data = { chats, fbid: req.params.fbid, name: req.user.name, moment, rid: req.user._id};
        res.render('chat', data);
    }).sort({
        created_at: 1
    });
});

router.get('/chatHistory/:fbid', globalData.ensureAuthenticated, (req, res) => {
    ChatHistory.find({ "fbid": req.params.fbid}, (err, chats) => {
        if (err){
            return res.redirect('/user/');
        }
        var data = { chats, fbid: req.params.fbid, name: req.user.name, moment, rid: req.user._id};
        res.render('chatHistory', data);
    }).sort({
        created_at: 1
    });
});

router.get('/add', globalData.ensureAuthenticated, (req, res) => {
    var data = { flashType: "", flashMsg: "", name: "", email: "", password: "" };
    res.render('addUser',data);
});

router.post('/add', globalData.ensureAuthenticated, (req, res) => {
//router.post('/add', (req, res) => {
    console.log("add");
    var data = { flashType: "", flashMsg: "", name: "", email: "", password: ""};
    if (req.body.name != undefined && req.body.email != undefined && req.body.password != undefined){
        var name = req.body.name.trim();
        var email = req.body.email.trim();
        var password = req.body.password.trim();
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        data.name = sanitize(name);
        data.email = sanitize(email);
        data.password = sanitize(password);

        if (data.name == ""){
            data.flashType = "warning";
            data.flashMsg = "Please enter representative's name.";
        }
        else if (!re.test(data.email)){
            data.flashType = "warning";
            data.flashMsg = "Please enter a valid Email";
        }
        else if (data.password == ""){
            data.flashType = "warning";
            data.flashMsg = "Please enter password";
        }
        if (data.flashType!=""){
            res.render('addUser', data);
        }
        else{
            UserLogin.findOne({ email: data.email }).exec((err, user) => {
                if (!err) {
                    if (user == null) {
                        var newUser = UserLogin();
                        newUser.name = data.name;
                        newUser.email = data.email;
                        bcrypt.genSalt(10, (err, salt) =>  {
                            bcrypt.hash(data.password, salt, (err, hash) => {
                                newUser.password = hash;
                                newUser.user_id = uniqid();
                                newUser.save((err, user) => {
                                    if (!err) {
                                        //console.log(user);
                                        data.flashType = "success";
                                        data.flashMsg = "Customer Care Representative added.";
                                        data.name = "";
                                        data.email = "";
                                        data.password = "";
                                    }
                                    else {
                                        console.log(err)
                                        data.flashType = "warning";
                                        data.flashMsg = "Please Try again";
                                    }
                                    res.render('addUser', data);
                                });
                            });
                        });
                    }
                    else{
                        data.flashType = "warning";
                        data.flashMsg = "This email already exist";
                        res.render('addUser', data);
                    }
                }
                else{
                    data.flashType = "warning";
                    data.flashMsg = "Please Try again";
                    res.render('addUser', data);
                }
            });
        }
    }
    else{
        res.render('addUser', data);
    }
});

router.get('/view', globalData.ensureAuthenticated, (req, res) => {
    UserLogin.find({userType: 'representative',status:1}).exec((err, users) => {
        if (!err) {
            res.render('viewUser',{users});
        }else{
            res.render('viewUser',{users:[]});
        }
    });
});
module.exports = router;