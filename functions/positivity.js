'use strict';

var sentiment = require('sentiment');

module.exports.main = function(event, context, callback) {
    var result = 0,
        response = "",
        score = 0,
        message = "",
        words = 0,
        temp = 0,
        posMessage = "",
        userId = event.userId;
    event.messages.forEach(function(data) {
        if (data.user === userId) {
            message = sentiment(data.text);
            console.log(message.score);
            if (message.score > 0) {

                console.log("message" + data.text);
                words = words + message.tokens.length;
                score = score + message.score;
                if (message.score > temp) {
                    temp = message.score;
                    posMessage = data.text;
                }
            }
            console.log("words " + words);
            console.log("score " + score);
            console.log("most positive message: " + posMessage);
            //do validation for if nothing positive is returned
        }
    });
    result = ((score / (words * 4)) * 100).toFixed(2);
    response = {
        pretext: "Positivity",
        fields: [{
            title: "Score",
            value: result + "%"
        }, {
            title: "Most Positive Post",
            value: "\"" + posMessage  + "\""
        }]
    };
    callback(null, response);
};
