'use strict';

var sentiment = require('sentiment');

module.exports.main = function(event, context, callback) {
    var count = 0,
        posNeg = 0,
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
            console.log("most positive message: "+ posMessage );
          //do validation for if nothing positive is returned
        }
    });
    count = (score / (words * 4)) * 100;
    posNeg = count.toFixed(2) + "%";
    console.log("posNeg " + posNeg);
    callback(null, posNeg);
};
