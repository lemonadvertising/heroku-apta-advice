const request = require('request');

/*var access_tokenFB = "EAAZA5OJ2zJeYBAPCKYZB7CGuo2TsOWYrkUhHFMFUcZBkQj1sXZAzDwmPHWjfkN5LUycD6vFCmliY3Ey8hngAZCegSe8ZAkjY9klSO0ZAQ4DdtN5fEV0NJP2Q15ZAywrBdr5MYVakfwDjBxp9sTz9zXvJffFl6pLciQVushNbnzESQgZDZD";*/
var access_tokenFB = "EAAZA5OJ2zJeYBAEroYbsZCLIlMQqPZAfZBqA00v6Hn7ZBeHQSG1VlbkBDfFimso4TlbWUaaJvbi62gkTulKvaW63cnoYTZB8ZB9X1PgrBS3RjfcfiH46v214NWi5ZBZBuiKMTL1h5XCjV6j2JrsqeAQ3CGRZAQQ7SsaUkZBYZA6pOcnrWrtsOGU3EdTH";

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: access_tokenFB },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(response);
        } else {
            console.log("XXXXXXXXXXXXXXXXXXX error XXXXXXXXXXXXXXX");
            console.log(error);
            console.log(response);
            console.log(body);
            console.log("XXXXXXXXXXXXXXXXXXX error XXXXXXXXXXXXXXX");
        }
    });
}

module.exports = {
    "accessTokenFb": access_tokenFB,
    "sendTextMessageFB" : (recipientId, messageText) => {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText
            }
        };
        callSendAPI(messageData);
    },
    "sendGenericMessageFb": (recipientId, messageObj) => {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: messageObj
        };
        callSendAPI(messageData);
    },
    "ensureAuthenticated": function(req, res, next){
        if (req.isAuthenticated()) {
            //console.log(req);
            return next();
        } else {
            //req.flash('danger', 'Please login');
            res.redirect('/user/login');
        }
    }
};