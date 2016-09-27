'use strict';

var sentiment = require('sentiment');

module.exports.main = function(event, context, callback) {
    var result = 0,
        response = "",
        message = "",
        temp = 0,
        negMessage = "",
        add = 0,
        userId = event.userId;
    event.messages.forEach(function(data) {
        if (data.user === userId) {
            message = sentiment(data.text);
            if (message.score < 0) {
                add++;
                if (message.score < temp) {
                    temp = message.score;
                    negMessage = data.text;
                }
            }
        }
    });
    if (add > 0) {
        result = ((event.messages.length / add)).toFixed(0);
    }
    if (result > 0) {
        response = {
            pretext: "Negativity",
            fields: [{
                title: "Score",
                value: result + "%" + " of your posts in this channel are negative."
            }, {
                title: "Most Negative Post",
                value: "\"" + negMessage + "\""
            }]
        };
    } else {
        response = {
            pretext: "Negativity",
            fields: [{
                title: "Score",
                value: "You haven't written any negative posts in this channel " + ":relieved:"
            }]
        };
    }
    callback(null, response);
};
