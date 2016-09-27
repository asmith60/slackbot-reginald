'use strict';

var sentiment = require('sentiment');

module.exports.main = function(event, context, callback) {
    var result = 0,
        response = "",
        message = "",
        temp = 0,
        posMessage = "",
        add = 0,
        userId = event.userId;
    event.messages.forEach(function(data) {
        if (data.user === userId) {
            message = sentiment(data.text);
            if (message.score > 0) {
                add++;
                if (message.score > temp) {
                    temp = message.score;
                    posMessage = data.text;
                }
            }
        }
    });
    if (add > 0) {
        result = ((add / event.messages.length) * 100).toFixed(0);
    }
    if (result > 0) {

        var color;
        if (result < 7) {
            color = "danger";
        } else if (result < 14) {
            color = "warning";
        } else {
            color = "good";
        }

        response = {
            color: color,
            pretext: "Positivity",
            fields: [{
                title: "Score",
                value: result + "%" + " of your posts in this channel are positive."
            }, {
                title: "Most Positive Post",
                value: "\"" + posMessage + "\""
            }]
        };
    } else {
        response = {
            color: "danger",
            pretext: "Positivity",
            fields: [{
                title: "Score",
                value: "You haven't written any positive posts in this channel " + ":worried:"
            }]
        };
    }
    callback(null, response);
};
