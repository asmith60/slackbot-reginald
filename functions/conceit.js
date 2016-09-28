'use strict';

module.exports.main = function(event, context, callback) {
    if (event.test) {
        callback(null, {
            test: "success"
        });
        return;
    }
    var total = 0,
        result = 0,
        phrase = "",
        userId = event.userId,
        count = 0,
        response = "",
        phrases = ["I am ", " mine ", " me ", " myself ", "I'm", "I've",
            "I have ", "I do ", "I like ", " my "
        ];
    event.messages.forEach(function(data) {
        if (data.user === userId) {
            phrase = data.text;
            phrases.forEach(function(element) {
                if (phrase.toLowerCase().includes(element.toLowerCase())) {
                    count++;
                }
            });
            total++;
        }
    });

    result = ((count / total) * 100).toFixed(0);

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
            pretext: "Conceit",
            fields: [{
                title: "Score",
                value: result + "% of your posts in this channel are conceited."
            }]
        };
    } else {
        response = {
            color: "good",
            pretext: "Conceit",
            fields: [{
                title: "Score",
                value: "You haven't written any conceited posts in this channel " + ":relieved:"
            }]
        };
    }

    callback(null, response);
};
