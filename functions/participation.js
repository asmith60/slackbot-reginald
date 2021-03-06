'use strict';

module.exports.main = function(event, context, callback) {
    console.log("Inside participation");
    if (event.test) {
        callback(null, {
            test: "success"
        });
        return;
    }
    var response = "",
        count = 0,
        total = 0,
        result = 0,
        userId = event.userId;
    event.messages.forEach(function(message) {
        if (message.user == userId) {
            count++;
        }
        total++;
    });

    result = ((count / total) * 100).toFixed(0);

    if (isNaN(result)) {
      result = 0;
    }

    response = {
        color: "#439FE0",
        pretext: "Participation",
        fields: [{
            title: "Score",
            value: result + "% of the posts in this channel were penned by you."
        }]
    };

    callback(null, response);
};
