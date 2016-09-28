'use strict';

var sentiment = require('sentiment');

module.exports.main = function(event, context, callback) {
    if (event.test) {
        callback(null, {
            test: "success"
        });
        return;
    }
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
        result = ((add / event.messages.length) * 100).toFixed(0);
    }
    if (result > 0) {

        var color;
        if (result < 7) {
            color = "good";
        } else if (result < 14) {
            color = "warning";
        } else {
            color = "danger";
        }

        response = {
            color: color,
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
            color: "good",
            pretext: "Negativity",
            fields: [{
                title: "Score",
                value: "You haven't written any negative posts in this channel " + ":relieved:"
            }]
        };
    }
    callback(null, response);
};
