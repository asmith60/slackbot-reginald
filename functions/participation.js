'use strict';

module.exports.main = function(event, context, callback) {
    var response = 0,
        count = 0,
        total = 0,
        userId = event.userId;
     event.messages.forEach(function (message) {
       if (message.user == userId) {
           count++;
       }
       total++;
     });

    response = ("Your level of participation in this channel is " + (count / total) * 100) + "%.";

    callback(null, response);
};
