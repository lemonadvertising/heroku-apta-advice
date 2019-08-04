const express = require("express");
const mongoose = require('mongoose');
const socket = require('socket.io');
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const app = express();
//const moment = require('moment');
app.set('views', path.join(__dirname ,"views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname , 'public')));
mongoose.Promise = global.Promise;

app.use(session({
    secret: 'VwqMrwcy-kfU4MY6m-v8RwnWcY',
    resave: false,
    saveUninitialized: true
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://heroku_62t68nbf:paqdd3hobqf5p1i94rf7g5437n@ds225382.mlab.com:25382/heroku_62t68nbf", {useNewUrlParser: true}, (ignore, connection) => {
    connection.onOpen();
});

let PORT = process.env.PORT || 3002;


const fbController = require('./controllers/fbController');
app.use('/fb', fbController);

const userController = require('./controllers/userController');
app.use('/user', userController);

const articleController = require('./controllers/articleController');
app.use('/article', articleController);

const dashboardController = require('./controllers/dashboardController');
app.use('/dashboard', dashboardController);

var server = require('http').Server(app);

server.listen(PORT, function () {
    console.log('Node app is running on port', PORT);
});

const TalkToAHumanController = require('./controllers/TalkToAHumanController');
const io = socket(server);
TalkToAHumanController.setIo(io);
io.on('connection', TalkToAHumanController.onConnection);